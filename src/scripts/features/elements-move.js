"use strict";

var ElementsMove = function (walle) {
  this.walle = walle;
  this.paper = walle.paper;

  this.currentElement = null;
};


/**
 * start
 */
ElementsMove.prototype.start = function () {

  let walle = this.walle;
  let scene = walle.scene;

  walle.addElementsFeedback(['hole']);

  this.beginDragHandler = (event, element) => {
    if(Hole.isHole(element))
      this.beginDragging(element, event.offsetX, event.offsetY);
  };

  this.endDragHandler = (event) => {
    if (this.currentElement) this.endDragging(event.offsetX, event.offsetY);
  };

  this.draggingHandler = (event) => {
    if (this.currentElement) this.updateDragging(event.offsetX, event.offsetY);
  };

  scene.onMouseDown(this.beginDragHandler);
  scene.onMouseUp(this.endDragHandler);
  scene.onMouseMove(this.draggingHandler);

};

ElementsMove.prototype.beginDragging = function (element, x, y) {
  walle.removeElementsFeedback(['hole']);
  this.currentElement = element;
  element.move(x, y);
  element.selected(true);
};

ElementsMove.prototype.updateDragging = function (x, y) {
  console.log('update');
  this.currentElement.move(x, y);
};

ElementsMove.prototype.endDragging = function (x, y) {
  console.log('end', this.currentElement);
  let element = this.currentElement;
  let walle = this.walle;

  walle.addElementsFeedback(['hole']);
  element.move(x, y);
  element.selected(false);

  this.currentElement = null;
};


/**
 * stop
 */
ElementsMove.prototype.stop = function () {

};
