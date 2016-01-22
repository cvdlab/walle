"use strict";

var SceneImporter = function (walle) {
  this.walle = walle;
};

/**
 * start
 */
SceneImporter.prototype.start = function () {

  let scene = this.walle.scene;
  let walle = this.walle;

  walle.overlay(true);

  this.uploadWindow = jQuery("<div/>", {class: "panel"}).appendTo(walle.wrapper);

  let textarea = this.textarea = jQuery("<textarea/>", {
    width: "100%",
    height: "90%",
    placeholder: "Paste here your saved scene"
  }).appendTo(this.uploadWindow);

  this.button = jQuery("<button/>", {
    width: "100%",
    height: "10%"
  })
    .text("Import scene")
    .click((event) => {
      this.import(textarea.val());
    })
    .appendTo(this.uploadWindow);

  textarea.focus();

};

SceneImporter.prototype.import = function (data) {
  let scene = this.walle.scene;
  scene.remove();
  try {
    let json = JSON.parse(data);
    scene.load(json);
  } catch (e) {
    alert("Impossible to parse scene");
    return;
  }

  this.stop();
};

/**
 * stop
 */
SceneImporter.prototype.stop = function () {

  this.walle.overlay(false);
  this.uploadWindow.remove();
};
