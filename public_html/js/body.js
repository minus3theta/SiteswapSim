var mctx;
var aRatio = 1;

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
  var scale = mainc.width / 2.0;
  aRatio = mainc.height / mainc.width;
  mctx = mainc.getContext('2d');
  
  mctx.translate(mainc.width / 2, mainc.height / 2);
  mctx.scale(scale, scale);
  setPattern();
  setInterval(draw, 20);
}

function setPattern() {
  pat = [
    new Pattern(3, [0.5, 0.0], [0.6, 0.0])
  ];
  balls = [
    new Ball(vv, '#ff8080', 0, 150),
    new Ball(vv, '#80ff80', 50, 150),
    new Ball(vv, '#8080ff', 100, 150)
  ];
}

var vv = [[-0.5, 0.5], [0.0, -1.0], [0.5, 0.5]];

function draw() {
  mctx.fillStyle = '#ffffff';
  mctx.fillRect(-1, -aRatio, 2, 2*aRatio);
  for(var i=0; i<balls.length; i++) {
    mctx.fillStyle = balls[i].style;
    drawCircle(bezier(vv, balls[i].step / balls[i].cycle), brad);
    balls[i].step = (balls[i].step + 1) % balls[i].cycle;
  }
}

function Pattern(n, start, end) {
  this.n = n;
  this.start = start;
  this.end = end;
}

function Ball(ps, style, step, cycle) {
  this.ps = ps;
  this.style = style;
  this.step = step;
  this.cycle = cycle;
}

function state(idx, step) {
  this.idx = idx;
  this.step = step;
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