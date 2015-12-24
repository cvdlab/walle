"use strict";

var SceneRemove = function (walle) {
  this.walle = walle;
};

/**
 * start
 */
SceneRemove.prototype.start = function () {

  let scene = this.walle.scene;
  scene.remove();

};

/**
 * stop
 */
SceneRemove.prototype.stop = function () {

};
