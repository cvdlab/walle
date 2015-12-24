"use strict";

var SceneExport = function (walle) {
  this.walle = walle;
};

/**
 * start
 */
SceneExport.prototype.start = function () {

  let scene = this.walle.scene;

  this.overlay = jQuery("<div/>", {
    width: "100%",
    height: "100%"
  })
    .css({
      position: "absolute",
      top: 0,
      left: 0,
      "background-color": "#000",
      "z-index": 500,
      opacity: 0.7
    })
    .appendTo(this.walle.wrapper);

  this.downloadWindow = jQuery("<div/>", {
    width: "60%",
    height: "80%"
  })
    .css({
      position: "absolute",
      top: 25,
      left: 0,
      right: 0,
      margin: "0 auto",
      padding: 5,
      border: "5px solid #1c79bc",
      "background-color": "#fff",
      "z-index": 1000
    })
    .appendTo(this.walle.wrapper);

  this.textarea = jQuery("<textarea/>", {
    width: "100%",
    height: "100%"
  })
    .css({
      border: 0,
      display: "block",
      padding: 0,
      "font-family": "courier",
      outline: 0
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

  this.overlay.remove();
  this.downloadWindow.remove();
};
