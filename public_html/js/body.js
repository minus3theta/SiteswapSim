var mctx;
function init() {
  var mainc = document.getElementById('mainc');
  if(mainc.getContext) {
    mctx = mainc.getContext('2d');
  }
}
