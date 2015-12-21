"use strict";

var Export = function (walle) {
  this.walle = walle;
};

/**
 * start
 */
Export.prototype.start = function () {

  let scene = this.walle.scene;

  console.info('export', scene.toJson());

  this.changeHandler = function (element) {
    console.info('export', scene.toJson());
  };

  this.walle.scene.onChange(this.changeHandler)

};


/**
 * stop
 */
Export.prototype.stop = function () {

  this.walle.scene.offChange(this.changeHandler);
};
