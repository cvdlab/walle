"use strict";

var Debugger = function (walle) {
  this.walle = walle;
};


/**
 * start
 */
Debugger.prototype.start = function () {

  this.walle.debugMode = true;

};


/**
 * stop
 */
Debugger.prototype.stop = function () {

  this.walle.debugMode = false;

};
