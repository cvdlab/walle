"use strict";

var SceneImporter = function (walle) {
  this.walle = walle;
};

/**
 * start
 */
SceneImporter.prototype.start = function () {

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

  this.uploadWindow = jQuery("<div/>", {
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

  let textarea = this.textarea = jQuery("<textarea/>", {
    width: "100%",
    height: "90%",
    placeholder: "Paste here your saved scene"
  })
    .css({
      border: 0,
      display: "block",
      padding: 0,
      "font-family": "courier"

    })
    .appendTo(this.uploadWindow);

  this.button = jQuery("<button/>", {
    width: "100%",
    height: "10%"
  })
    .text("Import scene")
    .css({
      border: 0,
      display: "block",
      padding: 0,
      color: "#fff",
      "font-size": "17px",
      "background-color": "#1c79bc",
      "border-radius": "5px",
      cursor: "pointer"
    })
    .click((event) =>{
      this.import(textarea.val());
    })
    .appendTo(this.uploadWindow);


};

SceneImporter.prototype.import = function (data) {
  let scene = this.walle.scene;
  scene.remove();
  try {
    let json = JSON.parse(data);
    scene.load(json);
  }catch (e){
    alert("Impossible to parse scene");
    return;
  }

  this.stop();
};

/**
 * stop
 */
SceneImporter.prototype.stop = function () {

  this.overlay.remove();
  this.uploadWindow.remove();
};
