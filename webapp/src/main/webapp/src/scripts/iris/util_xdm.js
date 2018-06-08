//*******************************************************************************
// Educational Online Test Delivery System
// Copyright (c) 2015 American Institutes for Research
//
// Distributed under the AIR Open Source License, Version 1.0
// See accompanying file AIR-License-1_0.txt or at
// http://www.smarterapp.org/documents/American_Institutes_for_Research_Open_Source_Software_License.pdf
//*******************************************************************************
window.Util = window.Util || {};

/*
 Cross-domain messaging API.
 - Requires jQuery
 - Supports promises
 - Return objects from handlers
 - Serializes error messages

 Inspiration:
 - http://engineering.wingify.com/posts/jquery-promises-with-postmessage/
 - https://github.com/wingify/please.js

 Example:

 XDM.init(window); // <-- window to listen on (call this on parent and frame)

 // register handler in frame
 XDM.addListener('TDS:setResponse', function(itemKey, value) {
 return { key: + new Date() };
 });

 // post to frame in parent
 XDM(frame).post('TDS:setResponse', 100, 'A')
 .then(function(obj) {
 console.log('setResponse data: ', obj.key);
 }, function(ex) {
 console.log('setResponse error: ', ex);
 });

 */

Util.XDM = (function ($) {

  var defaults = {
    targetWindow: window,
    targetOrigin: '*',
    sourceOrigin: false
  };

  var id = 0;
  var requests = {};
  var listeners = {};

  var XDM = function (targetWindow, targetOrigin) {
    targetWindow = targetWindow || window;
    return $.extend(XDM.bind(), {
      targetWindow: targetWindow,
      targetOrigin: targetOrigin,
      post: postRequest
    });
  };

  XDM.useJQuery = function (jQuery) {
    $ = jQuery;
  };

  XDM.serialize = function (value) {
    return JSON.stringify(value);
  };

  XDM.deserialize = function (value) {
    return JSON.parse(value);
  };

  XDM.suppressException = false;

  XDM.init = function (thisWindow) {
    thisWindow = thisWindow || window;
    if (thisWindow.addEventListener) {
      thisWindow.addEventListener('message', messageHandler, true);
    }
    return XDM;
  };

  // register a listener
  XDM.addListener = function(name, callback) {
    listeners[name] = callback;
  };

  // remove a listener
  XDM.removeListener = function (name) {
    delete listeners[name];
  };

  // clear all listeners
  XDM.removeListeners = function () {
    Object.keys(listeners).forEach(function(key) {
      XDM.removeListener(key);
    });
  };

  // send a request
  function postRequest(requestName) {
    var req = new Request(requestName);
    req.targetWindow = this.targetWindow || defaults.targetWindow;
    req.targetOrigin = this.targetOrigin || defaults.targetOrigin;
    req.data = [].slice.call(arguments, 1);
    req.send();
    return req;
  }

  // recieve a request/response
  function messageHandler(evt) {

    if (!evt.data
      || typeof evt.data !== 'string'
      || evt.data.toUpperCase().indexOf("IRIS") < 0) {
      return;
    }

    try {
      var data = XDM.deserialize(evt.data);
    } catch (ex) {
      console.log('XDM: error parsing json data');
      return;
    }

    if (data.type === 'request') {
      // message request on the server from the client
      var response = new Response(data);
      response.targetWindow = evt.source;
      response.targetOrigin = evt.origin === 'null' ? defaults.targetOrigin : evt.origin;
      response.send();
    }
    else if (data.type === 'response') {
      // message response from the server to the client
      if (data.success) {
        requests[data.id].resolve(data.data);
      } else {
        requests[data.id].reject(new XDM.Error(data.data));
      }

      delete requests[data.id];
    }
  }

  function Request(name) {
    this.init.apply(this, [].slice.call(arguments));
  }

  Request.prototype.init = function(name) {

    $.extend(this, $.Deferred());

    this.id = ++id;
    this.name = name;
    this.data = [].slice.call(arguments);
    this.type = 'request';

    requests[id] = this;
  };

  Request.prototype.send = function() {
    this.targetWindow = this.targetWindow || defaults.targetWindow;
    this.targetOrigin = this.targetOrigin || defaults.targetOrigin;
    this.targetWindow.postMessage(XDM.serialize(this), this.targetOrigin);
  };

  Request.prototype.toJSON = function() {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      data: this.data
    };
  };

  Request.create = function (obj) {
    return $.extend(new Request(), obj);
  };

  function Response(req) {
    this.init(req);
  }

  Response.prototype.init = function(req) {
    this.id = req.id;
    this.name = req.name;
    this.type = 'response';
    try {
      // parse the request data
      var request = Request.create(req);

      // lookup the listener for this type of request
      var listener = listeners[req.name];

      // if there is a listener found the run it
      if (listener) {
        this.data = listener.apply(this, request.data);
        this.success = true;
      } else {
        throw new Error('Could not find the listener \'' + req.name + '\'');
      }
    } catch (error) {
      // listener threw an exception
      this.data = new XDM.Error(error);
      this.success = false;
    }
  };

  Response.prototype.send = function () {

    // set defaults
    this.targetWindow = this.targetWindow || defaults.targetWindow;
    this.targetOrigin = this.targetOrigin || defaults.targetOrigin;

    var request = this;
    function postMessage(value) {
      request.data = value;
      request.targetWindow.postMessage(XDM.serialize(request), request.targetOrigin);
    }

    // delay posting message in case listener returned a promise
    $.when(this.data).then(function (value) {
      postMessage(value);
    }, function(error) {
      request.success = false;
      if (error instanceof Error) {
        error = new XDM.Error(error);
      }
      postMessage(error);
    });

    // throw exception
    if (!XDM.suppressException && !this.success) {
      throw this.data.error;
    }
  };

  Response.prototype.toJSON = function() {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      data: this.data,
      success: this.success
    };
  };

  XDM.Error = function (error) {
    this.error = error;
    $.extend(this, error);
    this.name = error.name;
    this.message = error.message;

    // IE
    this.number = error.number;
    this.description = error.description;

    // Firefox
    this.fileName = error.fileName;
    this.lineNumber = error.lineNumber;

    // Chrome / Firefox / latest IE
    this.stack = error.stack;

    this.toString = function () {
      return this.message;
    };

  };

  return XDM;

})(window.$);
