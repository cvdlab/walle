"use strict";

/**
 * Constructor
 * @param container
 * @constructor
 */
var Walle = function (container) {

  this.document = jQuery(document);

  this.model = {
    walls: [],
    edges: []
  };
  this.pixelPerUnit = 60;

  //init vars;
  this.width = container.offsetWidth;
  this.height = container.offsetHeight;
  this.emitter = new EventEmitter2({wildcard: true});
  this.events = new Events();
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
    wallsMover: new WallsMover(this)
  };

  this.snapTo = new SnapTo(this);

  //abort
  let buttons = {esc: 27};
  this.document.on("keydown", event => {
    if (event.keyCode == buttons.esc) this.emitter.emit("abort.**");
    if (event.keyCode == buttons.esc) this.events.dispatchEvent('abort', event);
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


/**
 * nearestWall
 */
Walle.prototype.nearestWall = function (x, y, minAcceptedDistance) {

  let minWall = null;
  let minDistance = Infinity;
  let walls = this.model.walls;

  walls.forEach(function (wall) {
    let distance = wall.distanceFromPoint(x, y);
    console.log(distance);

    if(distance < minDistance){
      minDistance = distance;
      minWall = wall;
    }
  });

  if (minDistance <= minAcceptedDistance){
    return minWall;
  }else{
    return null;
  }
};


/** events **/
Walle.prototype.onAbort = function (handler) {
  this.events.addEventListener('abort', handler);
};

Walle.prototype.offAbort = function (handler) {
  this.events.removeEventListener('abort', handler);
};
