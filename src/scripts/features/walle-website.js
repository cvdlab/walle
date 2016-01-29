"use strict";

var WalleWebsite = function (walle) {
  this.walle = walle;
  this.paper = walle.paper;
};


/**
 * start
 */
WalleWebsite.prototype.start = function () {
  location.assign("https://github.com/cvdlab/walle");
};

/**
 * stop
 */
WalleWebsite.prototype.stop = function () {

};
