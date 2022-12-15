(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.objectId = factory());
}(this, (function () { 'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var UNIQUE_KEY_PROP_NAME = '__unique_key_prop__';
var VALUE_PREFIX = '__uid__' + Date.now() + '_';

var defaultOptions = {
  key: UNIQUE_KEY_PROP_NAME,
  enumerable: false
};

var uid = 0;

function extend(dest, src) {
  for (var key in src) {
    dest[key] = src[key];
  }
  return dest;
}

function isObject(obj) {
  return obj !== null && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object';
}

function objectId(obj, options) {
  if (isObject(obj)) {
    var _extend = extend(extend({}, defaultOptions), options),
        key = _extend.key,
        enumerable = _extend.enumerable;

    if (obj.hasOwnProperty(key)) {
      return obj[key];
    }
    var value = VALUE_PREFIX + uid++;
    Object.defineProperty(obj, key, { value: value, enumerable: enumerable });
    return value;
  }
  return obj;
}

return objectId;

})));
