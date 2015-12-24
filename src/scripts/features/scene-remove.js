"use strict";

var SceneRemove = function (walle) {
  this.walle = walle;
};

/**
 * start
 */
SceneRemove.prototype.start = function () {

  if (window.confirm("Do you really want to remove this scene?")) {
    let scene = this.walle.scene;
    scene.remove();
  }

};

/**
 * stop
 */
SceneRemove.prototype.stop = function () {

};
