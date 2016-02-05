"use strict";

var SnapLayer = function (scene) {
  this.scene = scene;
  let snapElements = this.snapElements = [];
  let hoveredSnapElement = null;
  let events = this.events = new Events();

  let paper = this.paper = scene.paper;

  let parametricHandler = handlerName => {
    return (event) => {

      let activeElements = snapElements
        .map(snapElement => {
          return {
            distance: snapElement.distanceFromPoint(event.offsetX, event.offsetY),
            snapElement: snapElement,
            priority: snapElement.priority
          }
        })
        .filter(o => o.distance < o.snapElement.radius)
        .sort((a, b) => {
          if (a.priority > b.priority) return -1;
          if (a.priority < b.priority) return 1;
          return a.distance - b.distance;
        });

      if (activeElements.length > 0) {
        let snapElement = activeElements[0].snapElement;
        let targetElement = snapElement.targetElement;
        let targetPoint = snapElement.targetPoint(event.offsetX, event.offsetY);
        if(hoveredSnapElement !== snapElement){
          if(hoveredSnapElement) hoveredSnapElement.hover(false);
          snapElement.hover(true);
          hoveredSnapElement = snapElement;
        }
        events.dispatchEvent(handlerName, targetPoint.x, targetPoint.y, targetElement);
      }else if(hoveredSnapElement){
        hoveredSnapElement.hover(false);
        hoveredSnapElement = null;
      }
    }
  };

  let addHandler = (elements) => {
    if (!Array.isArray(elements)) elements = [elements];
    this.addTargetElements(elements);
  };

  paper.click(parametricHandler('click'));
  paper.mousemove(parametricHandler('mousemove'));
  scene.onAdd(addHandler);
};

SnapLayer.prototype.onClick = function (handler) {
  this.events.addEventListener('click', handler);
};

SnapLayer.prototype.offClick = function (handler) {
  this.events.removeEventListener('click', handler);
};

SnapLayer.prototype.onMouseMove = function (handler) {
  this.events.addEventListener('mousemove', handler);
};

SnapLayer.prototype.offMouseMove = function (handler) {
  this.events.removeEventListener('mousemove', handler);
};

SnapLayer.prototype.addTargetElements = function (elements) {
  let paper = this.paper;
  let snapElements = this.snapElements;
  let scene = this.scene;
  let width = scene.width, height = scene.height;

  elements.forEach(element => {

    if (Wall.isWall(element)) {
      let x1 = element.vertices[0].x, y1 = element.vertices[0].y;
      let x2 = element.vertices[1].x, y2 = element.vertices[1].y;

      let coords = Utils.lineIntoBox(x1, y1, x2, y2, width, height);
      let snapElement = new SnapLine(paper, coords.r1.x, coords.r1.y, coords.r2.x, coords.r2.y, element, 10, 5);
      snapElements.push(snapElement);
    }

    if (Vertex.isVertex(element)) {
      let vCoords = Utils.verticalLineIntoBox(element.x, element.y, width, height);
      let vSnapElement = new SnapLine(paper, vCoords.r1.x, vCoords.r1.y, vCoords.r2.x, vCoords.r2.y, element, 10, 5);
      snapElements.push(vSnapElement);

      let hCoords = Utils.horizontalLineIntoBox(element.x, element.y, width, height);
      let hSnapElement = new SnapLine(paper, hCoords.r1.x, hCoords.r1.y, hCoords.r2.x, hCoords.r2.y, element, 10, 5);
      snapElements.push(hSnapElement);

      let pointSnapElement = new SnapPoint(paper, element.x, element.y, element, 20, 20);
      snapElements.push(pointSnapElement);
    }

  });
};

