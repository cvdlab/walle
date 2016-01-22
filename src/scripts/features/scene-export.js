"use strict";

var SceneExport = function (walle) {
  this.walle = walle;
};

/**
 * start
 */
SceneExport.prototype.start = function () {

  let scene = this.walle.scene;
  let walle = this.walle;

  walle.overlay(true);

  this.downloadWindow = jQuery("<div/>", {class: "panel"}).appendTo(walle.wrapper);

  this.textarea = jQuery("<textarea/>", {
    width: "100%",
    height: "100%"
  })
    .focus(function () {
      var $this = jQuery(this);
      $this.select();
      // Work around Chrome's little problem
      $this.mouseup(function () {
        // Prevent further mouseup intervention
        $this.unbind("mouseup");
        return false;
      });
    })
    .appendTo(this.downloadWindow);

  let json = JSON.stringify(scene.toJson(), null, ' ');

  this.textarea.val(json);

};


/**
 * stop
 */
SceneExport.prototype.stop = function () {

  this.walle.overlay(false);
  this.downloadWindow.remove();
};
