"use strict";

var WindowsDrawer = function (walle) {
  this.walle = walle;
  this.paper = walle.paper;

  this.drawingWindow = null;
  this.status = WindowsDrawer.statusDirty;
};

/** costants */
WindowsDrawer.statusCompletable = 0;
WindowsDrawer.statusUncompletable = 1;
WindowsDrawer.statusDirty = 2;

/**
 * start
 */
WindowsDrawer.prototype.start = function () {

  this.clickHandler = (event) => {
    if(this.status === WindowsDrawer.statusCompletable){
      this.endDrawing();
    }
  };

  this.moveHandler = (event) => {
    if (this.status === WindowsDrawer.statusCompletable || this.status == WindowsDrawer.statusUncompletable) {
      this.updateDrawingWithPoint(event.offsetX, event.offsetY);
    }
  };

  this.paper.mousemove(this.moveHandler);
  this.paper.click(this.clickHandler);

  this.beginDrawingWithPoint(-999, -999);

};

WindowsDrawer.prototype.beginDrawingWithPoint = function (x, y) {
  let paper = this.paper;

  this.drawingWindow = new Window(paper);
  this.drawingWindow.move(x, y);

  this.status = WindowsDrawer.statusUncompletable;
};


WindowsDrawer.prototype.updateDrawingWithPoint = function (x, y) {

  let walle = this.walle;
  let drawingWindow = this.drawingWindow;
  let nearestWall = walle.nearestWall(x, y, 10);

  if(Wall.isWall(drawingWindow.wall)) {
    //attached mode
    this.status = WindowsDrawer.statusCompletable;
    walle.changeCursor('crosshair');

    //wall leaved
    if(nearestWall == null){
      drawingWindow.detach();
    }

    //wall changed
    if(nearestWall !== null && nearestWall !== drawingWindow.wall){
      drawingWindow.detach();
      drawingWindow.attach(nearestWall);
    }
  }else{
    //detached mode
    this.status = WindowsDrawer.statusUncompletable;
    walle.changeCursor('not-allowed');

    if(nearestWall !== null){
      drawingWindow.attach(nearestWall, 0);
    }
  }

  drawingWindow.move(x, y);
};

WindowsDrawer.prototype.endDrawing= function () {
  this.walle.scene.addElement(this.drawingWindow);
  this.drawingWindow = null;
  this.beginDrawingWithPoint(-999, -999);

};



/**
 * stop
 */
WindowsDrawer.prototype.stop = function () {

  this.drawingWindow.remove();
  this.paper.unmousemove(this.moveHandler);
  this.paper.unclick(this.clickHandler);
  walle.changeCursor('auto');

};
