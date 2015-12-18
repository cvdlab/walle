"use strict";

var Events = function () {
  this.events = {};
};


Events.prototype.addEventListener = function (type, listener, context) {
  type = type.toLowerCase();
  this.events[type] = this.events[type] || [];
  this.events[type].push(listener);
};


Events.prototype.removeEventListener = function (type, listener) {

  type = type.toLowerCase();

  if (!this.events.hasOwnProperty(type)) return;

  let handlers = this.events[type];

  var i = handlers.indexOf(listener);
  if (i != -1) {
    handlers.splice(i, 1);
  }
};


Events.prototype.dispatchEvent = function (type) {
  type = type.toLowerCase();
  let handlers = this.events[type];
  if (!Array.isArray(handlers)) return;

  var args = Array.prototype.slice.call(arguments);
  handlers.forEach(function (event) {
    event.apply(this, args.slice(1));
  });
};


