"use strict";

var SnapEvents = function (walle) {
  this.walle = walle;
  this.paper = walle.paper;

  this.snapPoints = [];

  walle.model.walls = walle.model.walls || [];
  walle.model.edges = walle.model.edges || [];

  this.walls = walle.model.walls;
  this.edges = walle.model.edges;
};

/**
 *
 * @param clickFn = function(event, x, y, anchorObject)
 * @param mouseMoveFn = function(event, x, y, anchorObject)
 */

SnapEvents.prototype.add = function (clickFn, mouseMoveFn) {

  console.log("use snap events");

  mouseMoveFn = mouseMoveFn || function () {
    };

  let snapElementStyles = {
    circle: {strokeWidth: 1, stroke: "#000", fill: "#fff", opacity: this.walle.debugMode ? 0.5 : 0},
    line: {strokeWidth: 15, stroke: "#000", opacity: this.walle.debugMode ? 0.3 : 0},
    anchor: {strokeWidth: 1, stroke: "#1c79bc", opacity: 0}
  };

  let width = this.walle.width;
  let height = this.walle.height;
  let snapPoints = this.snapPoints;
  let paper = this.paper;

  let addLineSnapPoint = function (x1, y1, x2, y2, anchorObject) {

    let anchor = paper.line(x1, y1, x2, y2).attr(snapElementStyles.anchor);


    let line = paper.line(x1, y1, x2, y2)
      .attr(snapElementStyles.line)
      .mouseover(event => {
        anchor.attr({opacity: 1});
      })
      .mouseout(event => {
        anchor.attr({opacity: 0});
      })
      .click(event => {
        let coords = Utils.intersectPoint(x1, y1, x2, y2, event.offsetX, event.offsetY);
        clickFn(event, coords.x, coords.y, anchorObject);
      })
      .mousemove(event => {
        let coords = Utils.intersectPoint(x1, y1, x2, y2, event.offsetX, event.offsetY);
        mouseMoveFn(event, coords.x, coords.y, anchorObject);
      });

    snapPoints.push(line);
    return line;
  };

  let addCircleSnapPoint = function (x, y, anchorObject) {
    let circle = paper.circle(x, y, 20)
      .attr(snapElementStyles.circle)
      .click(event => {
        clickFn(event, x, y, anchorObject);
      })
      .mousemove(event => {
        mouseMoveFn(event, x, y, anchorObject);
      });

    snapPoints.push(circle);
    return circle;
  };


  ////add cross snap point
  this.edges.forEach((edge) => {
    let hCoords = Utils.horizontalLineIntoBox(edge.x, edge.y, width, height);
    let vCoords = Utils.verticalLineIntoBox(edge.x, edge.y, width, height);

    addLineSnapPoint(hCoords.r1.x, hCoords.r1.y, hCoords.r2.x, hCoords.r2.y, edge);
    addLineSnapPoint(vCoords.r1.x, vCoords.r1.y, vCoords.r2.x, vCoords.r2.y, edge);
  });

  //add continue snap point
  this.walls.forEach((wall) => {
    let coords = Utils.lineIntoBox(wall.edges[0].x, wall.edges[0].y, wall.edges[1].x, wall.edges[1].y, width, height);

    addLineSnapPoint(coords.r1.x, coords.r1.y, coords.r2.x, coords.r2.y, wall);
  });

  //add wall snap point
  this.edges.forEach((edge) => {

    addCircleSnapPoint(edge.x, edge.y, edge)
      .mouseover(event => {
        edge.hovered(true);
      })
      .mouseout(event => {
        edge.hovered(false);
      });

  });


};


SnapEvents.prototype.remove = function () {


  console.log("remove snap events");

  this.snapPoints.forEach(p => {
    p.remove()
  });
  this.snapPoints = [];
};
