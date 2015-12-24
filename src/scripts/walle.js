"use strict";

/**
 * Constructor
 * @param container
 * @constructor
 */
var Walle = function (container) {

  this.scene = new Scene();
  this.document = jQuery(document);
  this.pixelPerUnit = 60;

  //init vars;
  this.width = container.offsetWidth;
  this.height = container.offsetHeight;

  this.events = new Events();
  this.debugMode = false;
  this.featuresInstance = {};

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

  //snap to
  this.snapTo = new SnapTo(this);

  //abort
  let buttons = {esc: 27};
  this.document.on("keydown", event => {
    if (event.keyCode == buttons.esc) this.events.dispatchEvent('abort', event);
  });

};

/**
 * get feature
 */
Walle.prototype.feature = function (featureName) {
  if (this.featuresInstance.hasOwnProperty(featureName))
    return this.featuresInstance[featureName];

  if (!window.hasOwnProperty(featureName)) {
    throw new Error("feature " + featureName + " not found");
  }

  return this.featuresInstance[featureName] = new window[featureName](this);
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
  return this.nearestElement('wall', x, y, minAcceptedDistance);
};
/**
 * nearestEdge
 */
Walle.prototype.nearestEdge = function (x, y, minAcceptedDistance) {
  return this.nearestElement('edge', x, y, minAcceptedDistance);
};


/**
 * nearestElement
 */
Walle.prototype.nearestElement = function (type, x, y, minAcceptedDistance) {

  let minElement = null;
  let minDistance = Infinity;
  let elements = this.scene.getElements(type);

  elements.forEach(function (element) {

    let distance = element.distanceFromPoint(x, y);

    if(distance < minDistance){
      minDistance = distance;
      minElement = element;
    }
  });

  if (minDistance <= minAcceptedDistance){
    return minElement;
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

/** snap **/
Walle.prototype.useSnapTo = function(handler){
  this.snapTo.use(handler);
};

/** snap **/
Walle.prototype.removeSnapTo = function(){
  this.snapTo.remove();
};
