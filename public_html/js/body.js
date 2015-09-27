var mctx;
var csize = [];
var scale = 1;
var cscale = 0;
var mspf = 20;

var grv = [0, 9.8];
var brad = 0.08;
var cycle = 100;
var pat = [];
var balls = [];
var ptr = [0, 1];

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
  pat = [
    new Pattern(3, [0.5, 0.0], [0.6, 0.0])
  ];
  balls = [
    new Ball(vv, '#ff8080', 0, 60),
    new Ball(vv, '#80ff80', 20, 60),
    new Ball(vv, '#8080ff', 40, 60)
  ];
}

var vv = [[-0.5, 0.0], [0.5, 0.0]];

function draw() {
  mctx.setTransform(1, 0, 0, 1, 0, 0);
  mctx.fillStyle = '#ffffff';
  mctx.fillRect(0, 0, csize[0], csize[1]);
  mctx.scale(cscale, cscale);
  mctx.translate(scale, 4 * scale - 0.5);
  for(var i=0; i<balls.length; i++) {
    mctx.fillStyle = balls[i].style;
    drawCircle(bezier(balls[i].ps, balls[i].step / balls[i].cycle), brad);
    balls[i].step = (balls[i].step + 1) % balls[i].cycle;
  }
}

function Pattern(n, start, end) {
  this.n = n;
  this.start = start;
  this.end = end;
}

function Ball(vs, style, step, cycle) {
  var t = cycle * mspf / 1000;
  this.ps = [vs[0],
    vSub(vScale(0.5, vAdd(vs[0], vs[1])), vScale(t * t / 4, grv)),
    vs[1]];
  this.style = style;
  this.step = step;
  this.cycle = cycle;
}

function state(idx, step) {
  this.idx = idx;
  this.step = step;
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
//  var u = new Array(v.length);
//  for(var i=0; i<v.length; i++) {
//    u[i] = -v[i];
//  }
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