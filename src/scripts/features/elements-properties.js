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
  this.clickHandler = (event, element) => {
    if(this.status === ElementsProperties.statusWaiting){
      this.openPanel(element);
    }
  };

  scene.onClick(this.clickHandler);

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
  let scene = this.walle.scene;
  scene.offClick(this.clickHandler);
};
