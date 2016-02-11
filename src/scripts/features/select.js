"use strict";

var Select = function (walle) {
  this.walle = walle;
  this.status = Select.statusDirty;
  this.paper = walle.paper;
  this.scene = walle.scene;

  this.selectionStartPoint = null;
  this.selectionEndPoint = null;
  this.selectionBoudingBox = null;
  this.symbol = null;
  this.selectedElements = [];
};

Select.statusWaiting = 0;
Select.statusWorking = 1;
Select.statusDirty = 2;
Select.statusSelected = 2;

/**
 * start
 */
Select.prototype.start = function () {

  this.mouseDownHandler = (event) => {
    if (this.status === Select.statusWaiting || this.status === Select.statusSelected) {
      this.beginSelection(event.offsetX, event.offsetY);
      event.stopPropagation();
    }

  };

  this.mouseUpHandler = (event) => {
    if (this.status === Select.statusWorking) {
      this.endSelection(event.offsetX, event.offsetY);
      event.stopPropagation();
    }
  };

  this.mouseMoveHandler = (event) => {
    if (this.status === Select.statusWorking) {
      this.updateSelection(event.offsetX, event.offsetY);
      event.stopPropagation();
    }
  };

  let paper = this.walle.paper;

  paper.mousedown(this.mouseDownHandler);
  paper.mouseup(this.mouseUpHandler);
  paper.mousemove(this.mouseMoveHandler);

  this.status = Select.statusWaiting;
};

Select.prototype.beginSelection = function (x, y) {
  console.log('b', x, y);

  let scene = this.scene;
  let paper = this.paper;

  this.abortSelection();
  this.status = Select.statusWorking;
  this.selectionStartPoint = {x, y};
  this.selectionEndPoint = {x, y};
  this.selectionBoudingBox = {x, y, width: 0, height: 0};
  this.symbol = paper.rect(x, y, 0, 0).addClass('selection-rect');
};

Select.prototype.updateSelection = function (x, y) {
  //console.log('u', x, y);

  let start = this.selectionStartPoint;
  let end = {x, y};
  let boundingBox = Utils.boundingBox(start, end);

  this.selectionBoudingBox = boundingBox;
  this.symbol.attr(boundingBox);
  this.selectionEndPoint = {x, y};

  this.selectedElements.forEach(element => element.selected(false));

  let scene = this.scene;
  let insideElements = [];
  scene.getVertices().forEach(vertex => {
    let inside = vertex.insideBoundingBox(boundingBox.x, boundingBox.y, boundingBox.width, boundingBox.height);
    if(inside){
      vertex.selected(true);
      insideElements.push(vertex);
    }
  });

  scene.getWalls().forEach(wall => {
    let inside = wall.vertices.every(vertex => insideElements.indexOf(vertex) >= 0);
    if(inside){
      wall.selected(true);
      insideElements.push(wall);
      wall.attachedElements.forEach(attachedElement => {
        insideElements.push(attachedElement);
        attachedElement.selected(true);
      });
    }

  });

  this.selectedElements = insideElements;
};

Select.prototype.endSelection = function (x, y) {
  console.log('e', x, y);
  this.updateSelection(x, y);
  this.symbol.remove();
  this.symbol = null;
  this.status = Select.statusSelected;
};

Select.prototype.abortSelection = function () {

  if (this.status === Select.statusSelected || this.status === Select.statusWorking) {
    if (this.symbol) {
      this.symbol.remove();
      this.symbol = null;
    }
  }
  this.status = Select.statusWaiting;
};

/**
 * stop
 */
Select.prototype.stop = function () {
  let paper = this.paper;

  let scene = this.scene;
  scene.getWalls().forEach(wall => wall.selected(false));
  scene.getVertices().forEach(wall => wall.selected(false));

  paper.unmousedown(this.mouseDownHandler);
  paper.unmouseup(this.mouseUpHandler);
  paper.unmousemove(this.mouseMoveHandler);
};


