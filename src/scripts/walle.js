"use strict";

/**
 * Constructor
 * @param container
 * @constructor
 */
var Walle = function (container) {

  this.document = jQuery(document);

  this.model = {};
  this.pixelPerUnit = 60;

  //init vars;
  this.width = container.offsetWidth;
  this.height = container.offsetHeight;
  this.emitter = new EventEmitter2({wildcard: true});
  this.debugMode = false;

  // init wrapper
  this.wrapper = jQuery("<div/>", {
    width: this.width,
    height: this.height,
    class: 'walle-wrapper'
  }).css({position: "relative"});
  this.wrapper.appendTo(container);

  //init paper
  this.paper = Snap(this.width, this.height);
  this.paper.appendTo(this.wrapper.get(0));

  //init features
  this.features = {
    grid: new Grid(this),
    wallsDrawer: new WallsDrawer(this),
    easterEgg: new EasterEgg(this),
    panel: new Panel(this),
    debugger: new Debugger(this),
    export: new Export(this),
    edgesMover: new EdgesMover(this),
  };

  this.snapTo = new SnapTo(this);

  //abort
  let buttons = {esc: 27};
  this.document.on("keydown", event => {
    if (event.keyCode == buttons.esc) this.emitter.emit("abort.**");
  });

};

/**
 * get feature
 */
Walle.prototype.feature = function (featureName) {
  if (!this.features.hasOwnProperty(featureName)) {
    throw new Error("feature " + featureName + " not found");
  }
  return this.features[featureName];
};


/**
 * changeCursor
 */
Walle.prototype.changeCursor = function (cursor) {
  this.wrapper.css('cursor', cursor);
};



