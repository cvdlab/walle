"use strict";

var WallsDrawer = function (walle) {
  this.walle = walle;
  this.paper = walle.paper;

  this.drawingWall = null;

  walle.model.walls = walle.model.walls || [];
  walle.model.edges = walle.model.edges || [];

  this.walls = walle.model.walls;
  this.edges = walle.model.edges;

  this.snapPoints = [];
};


/**
 * start
 */
WallsDrawer.prototype.start = function () {
  console.log("start walls mode");

  //add a point everywhere
  this.paper.addListener("click.wallsdrawer.begin", event => {
    this.beginDrawing(event.offsetX, event.offsetY);
  });

  //add a point using snap points
  this.useSnapPoints(
    (event, x, y) => {
      this.beginDrawing(x, y);
      event.stopPropagation();
    }
  );
};


/**
 * restart
 */
WallsDrawer.prototype.restart = function () {
  console.log("restart walls mode");

  //clear drawing area
  this.destroySnapPoints();
  this.walle.changeCursor("auto");

  //unregister events
  this.paper.removeAllListeners("mousemove.wallsdrawer.update");
  this.paper.removeAllListeners("click.wallsdrawer.end");
  this.walle.emitter.removeAllListeners("abort.wallsdrawer");

  this.drawingWall = null;

  //start
  this.start();
};


/**
 * stop
 */
WallsDrawer.prototype.stop = function () {
  console.log("stop walls mode");

  //abort if needed
  if (this.drawingWall !== null) this.abortDrawing();

  //add a point everywhere
  this.paper.removeAllListeners("click.wallsdrawer.**");
  this.destroySnapPoints();
};


/**
 * beginDrawing
 * @param x
 * @param y
 */
WallsDrawer.prototype.beginDrawing = function (x, y) {
  console.log("begin drawing wall", x, y);

  //draw wall and edge
  let edge0 = new Edge(this.paper, x, y);
  let edge1 = new Edge(this.paper, x, y);
  let wall = new Wall(this.paper, edge0, edge1);
  edge0.redraw();
  edge1.redraw();

  edge0.selected(true);
  edge1.selected(true);
  wall.selected(true);

  this.drawingWall = wall;

  //change mouse mode
  this.walle.changeCursor("crosshair");

  //(un)register events
  this.paper.addListener("mousemove.wallsdrawer.update", event => {
    this.updateDrawing(event.offsetX, event.offsetY);
  });
  this.paper.addListener("click.wallsdrawer.end", event => {
    this.endDrawing(event.offsetX, event.offsetY, event.shiftKey);
  });
  this.paper.removeAllListeners("click.wallsdrawer.begin");
  this.walle.emitter.addListener("abort.wallsdrawer", event => {
    this.abortDrawing();
  });

  //use snap mode
  this.destroySnapPoints();

  this.useSnapPoints(
    (event, x, y) => {
      edge1.selected(false);
      this.endDrawing(x, y, event.shiftKey);
      event.stopPropagation();
    },
    (event, x, y) => {
      this.updateDrawing(x, y);
      event.stopPropagation();
    }
  );

};

/**
 * abortDrawing
 */
WallsDrawer.prototype.abortDrawing = function () {
  console.log("abort drawing wall");

  //abort
  this.drawingWall.edges[0].remove();
  this.drawingWall.edges[1].remove();
  this.drawingWall.remove();

  this.drawingWall = null;

  this.restart();
};

/**
 * updateDrawing
 * @param x
 * @param y
 */
WallsDrawer.prototype.updateDrawing = function (x, y) {
  //console.log("update drawing wall", x, y);

  //move wall endpoint
  this.drawingWall.edges[1].move(x, y);
};

/**
 * endDrawing
 * @param x
 * @param y
 */
WallsDrawer.prototype.endDrawing = function (x, y, startNew) {
  console.log("end drawing wall", x, y);

  //set new wall
  let wall = this.drawingWall;
  wall.edges[1].move(x, y);

  wall.edges[0].selected(false);
  wall.edges[1].selected(false);
  wall.selected(false);

  this.walls.push(wall);
  this.edges.push(wall.edges[0]);
  this.edges.push(wall.edges[1]);

  //restart
  this.restart();
  if (startNew) this.beginDrawing(x, y);

};

/** useSnapPoints */
WallsDrawer.prototype.useSnapPoints = function (clickFn, mousemoveFn) {

  console.log("use snap point");

  mousemoveFn = mousemoveFn || function () {
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

  let addLineSnapPoint = function (x1, y1, x2, y2) {

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
        clickFn(event, coords.x, coords.y);
      })
      .mousemove(event => {
        let coords = Utils.intersectPoint(x1, y1, x2, y2, event.offsetX, event.offsetY);
        mousemoveFn(event, coords.x, coords.y);
      });

    snapPoints.push(line);
    return line;
  };

  let addCircleSnapPoint = function (x, y) {
    let circle = paper.circle(x, y, 20)
      .attr(snapElementStyles.circle)
      .click(event => {
        clickFn(event, x, y);
      })
      .mousemove(event => {
        mousemoveFn(event, x, y);
      });

    snapPoints.push(circle);
    return circle;
  };


  ////add cross snap point
  this.edges.forEach((edge) => {
    let hCoords = Utils.horizontalLineIntoBox(edge.x, edge.y, width, height);
    let vCoords = Utils.verticalLineIntoBox(edge.x, edge.y, width, height);

    addLineSnapPoint(hCoords.r1.x, hCoords.r1.y, hCoords.r2.x, hCoords.r2.y);
    addLineSnapPoint(vCoords.r1.x, vCoords.r1.y, vCoords.r2.x, vCoords.r2.y);
  });

  //add continue snap point
  this.walls.forEach((wall) => {
    let coords = Utils.lineIntoBox(wall.edges[0].x, wall.edges[0].y, wall.edges[1].x, wall.edges[1].y, width, height);

    addLineSnapPoint(coords.r1.x, coords.r1.y, coords.r2.x, coords.r2.y);
  });

  //add wall snap point
  this.edges.forEach((edge) => {

    addCircleSnapPoint(edge.x, edge.y)
      .mouseover(event => {
        edge.hovered(true);
      })
      .mouseout(event => {
        edge.hovered(false);
      });

  });


};

/** destroySnapPoints */
WallsDrawer.prototype.destroySnapPoints = function () {
  console.log("remove snap point");

  this.snapPoints.forEach(p => {
    p.remove()
  });
  this.snapPoints = [];
};


