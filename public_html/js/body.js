var mctx;
var csize = [];
var scale = 1;
var cscale = 0;
var holdRatio = 0.5;
var mspf = 20;

var grv = [0, 9.8];
var brad = 0.08;
var defFrom = [0.4, 0.0];
var defTo = [0.7, 0.1];
var cycle = 1;
var pat = [];
var balls = [];
var idx = 0;
var even = true;
var step = 1;
var nextBall = null;

function init() {
  var mainc = document.getElementById('mainc');
  if(!mainc.getContext) {
    return;
  }
  csize = [mainc.width, mainc.height];
  mctx = mainc.getContext('2d');
  readScale();
  setPattern();
  setInterval(draw, mspf);
}

function setPattern() {
  var pattern = document.getElementById("input_pattern").value;
  if(!pattern.match(/^[0-9a-z]+$/)) {
    alert("input numbers or small alphabets");
    return;
  }
  var arrive = new Array(pattern.length);
  var pnum = new Array(pattern.length);
  for(var i=0; i<arrive.length; i++) {
    arrive[i] = false;
  }
  for(var i=0; i<pattern.length; i++) {
    var c = pattern.charCodeAt(i);
    var n;
    if(0x30 <= c && c <= 0x39) {
      n = c - 0x30;
    } else {
      n = c - 0x61 + 10;
    }
    pnum[i] = n;
    arrive[(i + n) % pattern.length] = true;
  }
  for(var i=0; i<arrive.length; i++) {
    if(!arrive[i]) {
      alert("this pattern is not jugglable");
      return;
    }
  }
  holdRatio = Number(document.getElementById("input_hold").value);
  step = cycle = Number(document.getElementById("input_cycle").value);
  pat = [];
  for(var i=0; i<pnum.length; i++) {
    pat[i] = new Pattern(pnum[i], defFrom, pnum[i] % 2 === 0 ? defTo : vFlipX(defTo));
  }
  for(var i=0; i<pat.length; i++) {
    var nxtP = pat[(i + pat[i].n) % pat.length];
    var v1 = vSub(pat[i].ps1[2], pat[i].ps1[1]);
    var v2 = vSub(nxtP.ps1[1], nxtP.ps1[0]);
    if(pat[i].n % 2 === 1) {
      v2 = vFlipX(v2);
    }
    var p1 = pat[i].to;
    var p4 = pat[i].n % 2 === 0 ? nxtP.from : vFlipX(nxtP.from);
    var p2 = vAdd(p1, vScale(holdRatio / 7, v1));
    var p3 = vSub(p4, vScale(holdRatio / 7, v2));
    pat[i].ps2 = [p1, p2, p3, p4];
  }
  balls = [];
  idx = 0;
  step = 0;
  even = true;
}

function draw() {
  mctx.setTransform(1, 0, 0, 1, 0, 0);
  mctx.fillStyle = '#ffffff';
  mctx.fillRect(0, 0, csize[0], csize[1]);
  mctx.scale(cscale, cscale);
  mctx.translate(scale, 4 * scale - 1.0);
  mctx.strokeStyle = '#404040';
  mctx.lineWidth = 0.01;
  for(var y=0; y > -4 * scale; y--) {
    mctx.strokeStyle = y % 5 === 0 ? '#ff4040' : '#404040';
    mctx.beginPath();
    mctx.moveTo(-scale, y);
    mctx.lineTo(scale, y);
    mctx.closePath();
    mctx.stroke();
  }
  for(var i=0; i<balls.length; i++) {
    var b = balls[i];
    mctx.fillStyle = b.style;
    var p = pat[b.idx];
    var t = (p.n - holdRatio) * cycle;
    var x = b.step < t ? bezier(p.ps1, b.step / t) :
            bezier(p.ps2, (b.step - t) / (holdRatio * cycle));
    if(b.even) {
      drawCircle(x, brad);
    } else {
      drawCircle(vFlipX(x), brad);
    }
    b.step++;
    if(b.step >= p.n * cycle) {
      nextBall = b;
    }
  }
  step++;
  if(step >= cycle) {
    if(pat[idx].n !== 0) {
      if(nextBall === null) {
        balls[balls.length] = new Ball('#8080ff', idx);
      } else {
        nextBall.idx = idx;
        nextBall.even = even;
        nextBall.step = 0;
        nextBall = null;
      }
    }
    step = 0;
    idx = (idx + 1) % pat.length;
    even = !even;
  }
}

function Pattern(n, from, to) {
  this.n = n;
  var t = (n - holdRatio) * cycle * mspf / 1000;
  this.from = from;
  this.to = to;
  this.ps1 = [from,
    vSub(vScale(0.5, vAdd(from, to)), vScale(t * t / 4, grv)),
    to];
  this.ps2 = [];
}

function Ball(style, idx) {
  this.style = style;
  this.idx = idx;
  this.even = even;
  this.step = 0;
}

function readScale()  {
  scale = Number(document.getElementById("input_scale").value);
  cscale = csize[0] / scale / 2;
}

function bezier(ps, t) {
  var table = new Array(ps.length);
  for(var i=0; i<table.length; i++) {
    table[i] = new Array(ps.length-i);
    table[0][i] = ps[i];
  }
  for(var i=1; i<ps.length; i++) {
    for(var j=0; j<ps.length-i; j++) {
      table[i][j] = vAdd(vScale(1-t, table[i-1][j]),
      vScale(t, table[i-1][j+1]));
    }
  }
  return table[ps.length-1][0];
}

function drawCircle(v, r) {
  mctx.beginPath();
  mctx.arc(v[0], v[1], r, 0, Math.PI*2.0);
  mctx.fill();
}

function vFlipX(v) {
  return [-v[0], v[1]];
}

function vAdd(u, v) {
  var w = new Array(u.length);
  for(var i=0; i<u.length; i++) {
    w[i] = u[i] + v[i];
  }
  return w;
}

function vSub(u, v) {
  var w = new Array(u.length);
  for(var i=0; i<u.length; i++) {
    w[i] = u[i] - v[i];
  }
  return w;
}

function vScale(s, v) {
  var u = new Array(v.length);
  for(var i=0; i<v.length; i++) {
    u[i] = s * v[i];
  }
  return u;
}