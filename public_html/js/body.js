var mctx;
var csize;
var scale;
var origin;

function init() {
  var mainc = document.getElementById('mainc');
  if(!mainc.getContext) {
    return;
  }
  csize = [mainc.width, mainc.height];
  scale = csize[0] / 2.0;
  origin = vScale(0.5, csize);
  mctx = mainc.getContext('2d');
  setInterval(draw, 20);
}

function draw() {
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