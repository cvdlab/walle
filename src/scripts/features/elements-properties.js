"use strict";

var ElementsProperties = function (walle) {
  this.walle = walle;
  this.paper = walle.paper;
  this.status = ElementsProperties.statusWaiting;
};

/** costants */
ElementsProperties.statusWaiting = 0;
ElementsProperties.statusWorking = 1;


/**
 * start
 */
ElementsProperties.prototype.start = function () {

  let paper = this.paper;
  let scene = this.walle.scene;

  /** click handler **/
  this.clickHandler = (event) => {
    if(this.status === ElementsProperties.statusWaiting){

      let wall = scene.nearestElement(event.offsetX, event.offsetY, 5, 'wall');
      if (Wall.isWall(wall)) {
        this.openPanel(wall);
        event.stopPropagation();
      }
    }
  };

  paper.click(this.clickHandler);

};

/**
 * openPanel
 */
ElementsProperties.prototype.openPanel = function (element) {

  console.log(element);

};


/**
 * stop
 */
ElementsProperties.prototype.stop = function () {

};
