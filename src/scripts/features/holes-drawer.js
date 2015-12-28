"use strict";

var HolesDrawer = function (walle, holePrototype) {
  this.walle = walle;
  this.paper = walle.paper;

  this.drawingHole = null;
  this.status = HolesDrawer.statusDirty;
  this.holePrototype = holePrototype;
};

/** costants */
HolesDrawer.statusCompletable = 0;
HolesDrawer.statusUncompletable = 1;
HolesDrawer.statusDirty = 2;

/**
 * start
 */
HolesDrawer.prototype.start = function () {

  this.clickHandler = (event) => {
    if(this.status === HolesDrawer.statusCompletable){
      this.endDrawing();
    }
  };

  this.moveHandler = (event) => {
    if (this.status === HolesDrawer.statusCompletable || this.status == HolesDrawer.statusUncompletable) {
      this.updateDrawingWithPoint(event.offsetX, event.offsetY);
    }
  };

  this.paper.mousemove(this.moveHandler);
  this.paper.click(this.clickHandler);

  this.beginDrawingWithPoint(-999, -999);

};

HolesDrawer.prototype.beginDrawingWithPoint = function (x, y) {
  let paper = this.paper;

  this.drawingHole = new this.holePrototype(paper);
  this.drawingHole.move(x, y);

  this.status = HolesDrawer.statusUncompletable;
};


HolesDrawer.prototype.updateDrawingWithPoint = function (x, y) {

  let walle = this.walle;
  let drawingHole = this.drawingHole;
  let nearestWall = walle.nearestWall(x, y, 10);

  if(Wall.isWall(drawingHole.wall)) {
    //attached mode
    this.status = HolesDrawer.statusCompletable;
    walle.changeCursor('crosshair');

    //wall leaved
    if(nearestWall == null){
      drawingHole.detach();
    }

    //wall changed
    if(nearestWall !== null && nearestWall !== drawingHole.wall){
      drawingHole.detach();
      drawingHole.attach(nearestWall);
    }
  }else{
    //detached mode
    this.status = HolesDrawer.statusUncompletable;
    walle.changeCursor('not-allowed');

    if(nearestWall !== null){
      drawingHole.attach(nearestWall, 0);
    }
  }

  drawingHole.move(x, y);
};

HolesDrawer.prototype.endDrawing= function () {
  this.walle.scene.addElement(this.drawingHole);
  this.drawingHole = null;
  this.beginDrawingWithPoint(-999, -999);

};



/**
 * stop
 */
HolesDrawer.prototype.stop = function () {

  this.drawingHole.remove();
  this.paper.unmousemove(this.moveHandler);
  this.paper.unclick(this.clickHandler);
  walle.changeCursor('auto');

};
