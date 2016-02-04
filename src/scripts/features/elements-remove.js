"use strict";

var ElementsRemove = function (walle) {
  this.walle = walle;
  this.paper = walle.paper;
};


/**
 * start
 */
ElementsRemove.prototype.start = function () {

  let walle = this.walle;
  let paper = this.paper;
  let scene = walle.scene;

  walle.addElementsFeedback(['wall', 'hole']);

  this.clickHandler = (event, element) => {
    if (Wall.isWall(element) || Hole.isHole(element)) {
      this.remove(element);
    }
  };

  scene.onClick(this.clickHandler);

};

ElementsRemove.prototype.remove = function (element) {
  let scene = this.walle.scene;
  let removeList = [element];

  if (Wall.isWall(element)) {
    element.attachedElements.forEach(element => removeList.push(element));

    element.vertices.forEach(function (vertex) {
      vertex.removeAttachedElement(element);

      if (vertex.attachedElements.size === 0) {
        removeList.push(vertex);
      }
    });
  }

  scene.removeElements(removeList);
  removeList.forEach(element=> element.remove());

};

/**
 * stop
 */
ElementsRemove.prototype.stop = function () {
  let walle = this.walle;
  let scene = walle.scene;

  walle.removeElementsFeedback(['wall', 'hole']);
  scene.offClick(this.clickHandler);
};
