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

  walle.addElementsFeedback(['wall', 'hole']);

  /** click handler **/
  this.clickHandler = (event, element) => {
    if (
      this.status === ElementsProperties.statusWaiting
      && element
      && (Wall.isWall(element) || Hole.isHole(element))
    ) {
      this.openPanel(element);
    }
  };

  scene.onClick(this.clickHandler);

};

/**
 * openPanel
 */
ElementsProperties.prototype.openPanel = function (element) {

  let walle = this.walle;

  walle.overlay(true);
  let modal = this.modal = jQuery("<div/>", {class: "modal mini"}).appendTo(walle.wrapper);

  let htmlElementMap = {
    wall: 'form-wall',
    window: 'form-hole',
    door: 'form-hole'
  };

  let tagHtml = htmlElementMap[Scene.typeof(element)];
  if (!tagHtml) return;

  let DOMElement = document.createElement(tagHtml);
  DOMElement.element = element;
  DOMElement.addEventListener('properties-changed', (event)=> {
    element.redraw();
    this.closePanel();
  });
  DOMElement.addEventListener('cancel', (event)=> {
    this.closePanel();
  });
  modal.html(DOMElement);

};


ElementsProperties.prototype.closePanel = function (element) {

  this.modal.remove();
  this.walle.overlay(false);
  this.modal = false;

};

/**
 * stop
 */
ElementsProperties.prototype.stop = function () {
  let scene = this.walle.scene;
  let walle = this.walle;
  if (this.modal) this.closePanel();

  walle.removeElementsFeedback(['wall', 'hole']);

  scene.offClick(this.clickHandler);
};

