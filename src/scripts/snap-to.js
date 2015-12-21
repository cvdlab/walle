"use strict";

var SnapTo = function (walle) {
  this.walle = walle;
  this.paper = walle.paper;

  this.scene = walle.scene;

  this.snapElements = [];

  let handler = function (event) {

    let minDistance = 15;
    let xp = event.offsetX, yp = event.offsetY;
    let eventType = event.type;

    let found = false;

    this.snapElements.forEach(element => {

      let handlers = element.handlers;
      let anchorObject = element.anchorObject;
      let distance = element.distanceFn(xp, yp);
      let coords;

      element.over = element.over || false;

      //mouse enter into area
      if (
        element.over === false
        && distance <= minDistance
        && eventType === 'mousemove'
        && handlers.hasOwnProperty('mouseover')
      ) {
        coords = coords || element.snapPointFn(xp, yp);
        element.over = true;
        handlers.mouseover(event, coords.x, coords.y, anchorObject);
      }

      //mouse leave area
      if (
        element.over === true
        && distance > minDistance
        && eventType === 'mousemove'
        && handlers.hasOwnProperty('mouseout')
      ) {
        coords = coords || element.snapPointFn(xp, yp);
        element.over = false;
        handlers.mouseout(event, coords.x, coords.y, anchorObject);
      }

      if (found) return;

      if (distance <= minDistance) {

        found = true;

        coords = coords || element.snapPointFn(xp, yp);

        if (eventType === 'click' || eventType === 'mousemove' && handlers.hasOwnProperty(eventType)) {
          handlers[eventType](event, coords.x, coords.y, anchorObject);
          event.stopImmediatePropagation();
        }

        if (eventType === 'click' && handlers.hasOwnProperty('mouseout')) {
          handlers.mouseout(event, coords.x, coords.y, anchorObject);
        }
      }
    });

  }.bind(this);


  this.paper
    .click(handler)
    .mousemove(handler);
};

/**
 * Add all snap points
 * @param handlers[] = function(event, x, y, anchorObject)
 */

SnapTo.prototype.add = function (handlers) {

  console.log("use snap events");

  let width = this.walle.width;
  let height = this.walle.height;
  let snapElements = this.snapElements;
  let paper = this.paper;
  let edges = this.scene.getEdges();
  let walls = this.scene.getWalls();

  //add wall snap point
  edges.forEach((edge) => {

    this.addSnapPoint(edge.x, edge.y, edge, handlers);

  });

  //add horizontal and vertical snap line
  edges.forEach((edge) => {
    let hCoords = Utils.horizontalLineIntoBox(edge.x, edge.y, width, height);
    let vCoords = Utils.verticalLineIntoBox(edge.x, edge.y, width, height);

    this.addSnapLine(hCoords.r1.x, hCoords.r1.y, hCoords.r2.x, hCoords.r2.y, edge, handlers);
    this.addSnapLine(vCoords.r1.x, vCoords.r1.y, vCoords.r2.x, vCoords.r2.y, edge, handlers);
  });

  //add continue snap point
  walls.forEach((wall) => {
    let coords = Utils.lineIntoBox(wall.edges[0].x, wall.edges[0].y, wall.edges[1].x, wall.edges[1].y, width, height);

    this.addSnapLine(coords.r1.x, coords.r1.y, coords.r2.x, coords.r2.y, wall, handlers);
  });
};

/**
 * Remove all snap points
 */
SnapTo.prototype.remove = function () {
  console.log("remove snap events");

  this.snapElements.forEach(item => {
    item.hover.remove()
  });

  this.snapElements = [];

};

/**
 * Add a snap line based on a rect
 * @param x1
 * @param y1
 * @param x2
 * @param y2
 * @param anchorObject
 * @param handlers[] = function(event, x, y, anchorObject)
 * @returns line
 */
SnapTo.prototype.addSnapLine = function (x1, y1, x2, y2, anchorObject, handlers) {

  let opacityDefault = this.walle.debugMode ? 0.3 : 0;

  handlers = Object.assign({}, handlers);

  let element = {x1, y1, x2, y2, anchorObject, handlers};

  let hover = element.hover = this.paper.line(x1, y1, x2, y2).attr({
    strokeWidth: 1,
    stroke: "red",
    opacity: opacityDefault
  });

  handlers.mouseover = function (event) {
    hover.attr({opacity: 1});
  };

  handlers.mouseout = function (event) {
    hover.attr({opacity: opacityDefault});
  };

  element.snapPointFn = function (xp, yp) {
    return Utils.intersectPoint(x1, y1, x2, y2, event.offsetX, event.offsetY);
  };

  element.distanceFn = function (xp, yp) {
    return Utils.linePointDistance(x1, y1, x2, y2, xp, yp);
  };

  this.snapElements.push(element);
};

/**
 * Add a snap point based on a circle
 * @param x
 * @param y
 * @param anchorObject
 * @param handlers[] = function(event, x, y, anchorObject)
 * @returns {*}
 */
SnapTo.prototype.addSnapPoint = function (x, y, anchorObject, handlers) {

  let opacityDefault = this.walle.debugMode ? 0.3 : 0;

  handlers = Object.assign({}, handlers);

  let element = {x, y, anchorObject, handlers};

  let hover = element.hover = this.paper.circle(x, y, 15).attr({
    strokeWidth: 1,
    stroke: "red",
    fill: "none",
    opacity: opacityDefault
  });

  handlers.mouseover = (event) => {
    hover.attr({opacity: 1});
    this.showOverlay(x, y, 15);
  };

  handlers.mouseout = (event) => {
    hover.attr({opacity: opacityDefault});
    this.hideOverlay();
  };

  element.snapPointFn = function (xp, yp) {
    return {x, y};
  };

  element.distanceFn = function (xp, yp) {
    return Utils.twoPointsDistance(x, y, xp, yp);
  };

  this.snapElements.push(element);
};

SnapTo.prototype.showOverlay = function(x, y, r){

  console.log("showOverlay");

  let rect = this.paper.rect(0, 0, "100%", "100%").attr({fill: "white"});
  let circle = this.paper.circle(x, y, r);
  let mask = this.paper.mask().append(rect).append(circle);

  let maskRect = this.paper
    .rect(0, 0, this.walle.width, this.walle.height)
    .attr({fill: "black", opacity: 0, mask: mask})
    .animate({opacity: 0.3}, 100);

  this.overlay = {
    rect, circle, mask, maskRect
  };
};

SnapTo.prototype.hideOverlay = function(){

  this.overlay.rect.remove();
  this.overlay.circle.remove();
  this.overlay.mask.remove();
  this.overlay.maskRect.remove();

};
