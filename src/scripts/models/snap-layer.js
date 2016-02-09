"use strict";

var SnapLayer = function (scene) {
  this.scene = scene;
  let snapElements = this.snapElements = [];
  this.hoveredSnapElement = null;
  let events = this.events = new Events();

  let paper = this.paper = scene.paper;
  this.active = false;

  let parametricHandler = handlerName => {
    return (event) => {

      if (!this.active) return;
      if (scene.extractElementFromDOM(event.target)) {
        this.resetHover();
        return;
      }

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
        if (this.hoveredSnapElement !== snapElement) {
          if (this.hoveredSnapElement) this.hoveredSnapElement.hover(false);
          snapElement.hover(true);
          this.hoveredSnapElement = snapElement;
        }
        events.dispatchEvent(handlerName, event, targetPoint.x, targetPoint.y, targetElement);
      } else if (this.hoveredSnapElement) {
        this.hoveredSnapElement.hover(false);
        this.hoveredSnapElement = null;
      }
    }
  };

  let addHandler = (elements) => {
    if (!Array.isArray(elements)) elements = [elements];
    this.addTargetElements(elements);
  };

  let removeHandler = (elements) => {
    if (!Array.isArray(elements)) elements = [elements];

    this.snapElements = snapElements = snapElements.filter(snapElement => {
      return elements.indexOf(snapElement.targetElement) === -1;
    });

  };

  paper.click(parametricHandler('click'));
  paper.mousemove(parametricHandler('mousemove'));
  scene.onAdd(addHandler);
  scene.onRemove(removeHandler);
};

SnapLayer.prototype.onClick = function (handler) {
  this.active = true;
  this.events.addEventListener('click', handler);
};

SnapLayer.prototype.offClick = function (handler) {
  this.events.removeEventListener('click', handler);
  this.active = this.events.length > 0;
};

SnapLayer.prototype.onMouseMove = function (handler) {
  this.active = true;
  this.events.addEventListener('mousemove', handler);
};

SnapLayer.prototype.offMouseMove = function (handler) {
  this.events.removeEventListener('mousemove', handler);
  this.active = this.events.length > 0;
};

SnapLayer.prototype.addTargetElements = function (elements) {
  let paper = this.paper;
  let snapElements = this.snapElements;
  let scene = this.scene;
  let width = scene.width, height = scene.height;

  elements.forEach(element => {

    if (Wall.isWall(element)) {
      let x1, y1, x2, y2;

      x1 = element.vertices[0].x;
      y1 = element.vertices[0].y;
      x2 = element.vertices[1].x;
      y2 = element.vertices[1].y;

      let coords = Utils.lineIntoBox(x1, y1, x2, y2, width, height);
      let snapElement = new SnapLine(paper, coords.r1.x, coords.r1.y, coords.r2.x, coords.r2.y, element, 10, 5)
      snapElements.push(snapElement);

      element.onMove(event => {
        x1 = element.vertices[0].x;
        y1 = element.vertices[0].y;
        x2 = element.vertices[1].x;
        y2 = element.vertices[1].y;
        coords = Utils.lineIntoBox(x1, y1, x2, y2, width, height);
        snapElement.move(coords.r1.x, coords.r1.y, coords.r2.x, coords.r2.y);
      });
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

      element.onMove(event => {
        vCoords = Utils.verticalLineIntoBox(element.x, element.y, width, height);
        hCoords = Utils.horizontalLineIntoBox(element.x, element.y, width, height);

        vSnapElement.move(vCoords.r1.x, vCoords.r1.y, vCoords.r2.x, vCoords.r2.y);
        hSnapElement.move(hCoords.r1.x, hCoords.r1.y, hCoords.r2.x, hCoords.r2.y);
        pointSnapElement.move(element.x, element.y);
      });
    }

    if (GridLine.isGridLine(element)) {
      let position = element.position;
      let priority = 30;
      let radius = 15;
      let gridSnapLine =
        element.isVertical() ?
          new SnapLine(paper, position, 0, position, height, element, priority, radius) :
          new SnapLine(paper, 0, position, width, position, element, priority, radius);

      gridSnapLine.hover(true);
      snapElements.push(gridSnapLine);
    }
  });
};

SnapLayer.prototype.resetHover = function () {
  if (this.hoveredSnapElement) {
    this.hoveredSnapElement.hover(false);
    this.hoveredSnapElement = null;
  }
};


