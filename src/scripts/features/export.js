"use strict";

var Export = function (walle) {
  this.walle = walle;
};


/**
 * start
 */
Export.prototype.start = function () {

  this.export();

};


/**
 * stop
 */
Export.prototype.stop = function () {


};


/**
 * export
 */
Export.prototype.export = function () {


  var file = {};

  for (var modelKey in this.walle.model) {
    file[modelKey] = this.walle.model[modelKey].map(function (item) {
      return item.toString()
    });
  }

  console.info("file export", file);
  console.info("memory model", this.walle.model);
};
