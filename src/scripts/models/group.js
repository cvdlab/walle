"use strict";

var Group = function (paper, name, elements) {
  this.paper = paper;
  this.name = name;
  this.elements = elements;

  let vertices = elements.filter(element => Vertex.isVertex(element));

  let active = true;

  let updatePositionHandler = ( currentVertex => (x, y, originalX, originalY) => {
      if (!active) return;
      active = false;
      let deltaX = x - originalX;
      let deltaY = y - originalY;

      vertices.forEach(vertex => {
        if(vertex !== currentVertex)
          vertex.move(vertex.x + deltaX, vertex.y + deltaY);
      });
      active = true;
    }
  );

  vertices.forEach(vertex => {
    vertex.onMove(updatePositionHandler(vertex));
  })
};

Group.prototype.setId = function (id) {
  this.id = id;
};

Group.prototype.toJson = function () {
  return {
    type: "group",
    id: this.id,
    elements: this.elements.map(element => element.id)
  };
};


Group.isGroup = function (group) {
  return (group instanceof Group);
};
