var IRiS = (function (XDM) {

  XDM.init(window);

  XDM.addListener('IRiS:ready', function () {
    if (typeof api.onready === 'function') {
      api.onready();
    }
  });

  XDM.addListener('IRiS:navUpdate', function (havePrev, haveNext) {
    if (typeof api.onnavUpdate === 'function') {
      api.onnavUpdate(havePrev, haveNext);
    }
  });

  var frame = null;
  var api = {};

  api.setFrame = function (frameWindow) {
    if (!frameWindow.postMessage) {
      frameWindow = frameWindow.contentWindow || frameWindow;
    }

    frame = frameWindow;
  };

  api.loadToken = function (vendorId, token) {
    return XDM(frame).post('IRiS:loadToken', vendorId, token);
  };

  api.loadContent = function (vendorId, token) {
    return XDM(frame).post('IRiS:loadContent', vendorId, token);
  };

  api.setResponse = function (value) {
    return XDM(frame).post('IRiS:setResponse', value);
  };

  api.setResponses = function (itemResponses) {
    return XDM(frame).post('IRiS:setResponses', itemResponses);
  };

  api.getResponse = function () {
    return XDM(frame).post('IRiS:getResponse');
  };

  api.showNext = function () {
    return XDM(frame).post('IRiS:showNext');
  };

  api.showPrev = function () {
    return XDM(frame).post('IRiS:showPrev');
  };

  api.onready = null;
  api.onnavUpdate = null;

  // expose api
  return api;

})(window.Util && window.Util.XDM);
