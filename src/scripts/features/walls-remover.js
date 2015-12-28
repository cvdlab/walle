"use strict";

var WallsRemover = function (walle) {
  this.walle = walle;
  this.paper = walle.paper;
};


/**
 * start
 */
WallsRemover.prototype.start = function () {

  let walle = this.walle;
  let paper = this.paper;

  this.clickHandler = (event) => {
    this.removeWall(event.offsetX, event.offsetY);
  };

  paper.click(this.clickHandler);

};

WallsRemover.prototype.removeWall = function (x, y) {
  console.log(x, y);
  let scene = this.walle.scene;
  let wall = this.walle.nearestWall(x, y, 10);

  if (Wall.isWall(wall)) {
    wall.attachedElements.forEach(function(element){
      scene.removeElement(element);
      element.remove();
    });
    //check and remove edge
    scene.removeElement(wall);
    wall.remove();
  }
};

/**
 * stop
 */
WallsRemover.prototype.stop = function () {
  this.paper.unclick(this.clickHandler);
};
