var mctx;

var csize = 0;
var scale = 0;
var origin = [];

var brad = 0.1;
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
  scale = csize[0] / 2.0;
  origin = vScale(0.5, csize);
  mctx = mainc.getContext('2d');
  
  setPattern();
  setInterval(draw, 20);
}

function setPattern() {
  pat = [
    new Pattern(3, [0.5, 0.0], [0.6, 0.0])
  ];
}

var step = 0;
var vv = [[-0.5, 0.0], [0.0, -1.0], [0.5, 0.0]];

function draw() {
  mctx.fillStyle = '#ffffff';
  mctx.fillRect(0, 0, csize[0], csize[1]);
  mctx.fillStyle = '#808080';
  drawCircle(bezier(vv, step / cycle), 0.1);
  step = (step + 1) % cycle;
}

function Pattern(n, start, end) {
  this.n = n;
  this.start = start;
  this.end = end;
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
  var wv = project(v);
  mctx.beginPath();
  mctx.arc(wv[0], wv[1], r*scale, 0, Math.PI*2.0, true);
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

function project(v) {
  return vAdd(vScale(scale, v), origin);
}

function unproject(v) {
  return vScale(1/scale, vSub(v, origin));
}