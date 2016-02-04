"use strict";

var Scene = function (paper) {
  this.paper = paper;
  this.elements = {};
  this.events = new Events();
  this.nextId = 0;

  this.onChange((element) => {
    if (Room.isRoom(element) || Hole.isHole(element)) return;
    this.refreshRooms();
  });

  let genericHandler = (eventName) => {
    return (event) => {
      let node = event.target;

      while (!node.id || node.tagName === 'div' || node.tagName === 'svg') {
        node = node.parentNode;
      }

      if (node.id) {
        let element = this.elements[node.id];
        this.events.dispatchEvent(eventName, event, element);
      }
    }
  };

  this.clickHandler = genericHandler('click');
  this.mouseDownHandler = genericHandler('mousedown');

  this.paper.click(this.clickHandler);
  this.paper.mousedown(this.mouseDownHandler);
};

Scene.prototype.addElements = function (elements) {
  elements.forEach((element) => {
    if (!this.hasElement(element)) {
      let id = 'we' + this.nextId++;
      element.setId(id);
      this.elements[id] = element;
    }
  });
  this.events.dispatchEvent('change', elements, 'add');
  this.events.dispatchEvent('add', elements);
};

Scene.prototype.addElement = function (element) {
  if (!this.hasElement(element)) {
    let id = 'we' + this.nextId++;
    element.setId(id);
    this.elements[id] = element;
  }
  this.events.dispatchEvent('change', element, 'add');
  this.events.dispatchEvent('add', element);
};

Scene.prototype.removeElement = function (element) {
  delete this.elements[element.id];
  this.events.dispatchEvent('change', element, 'remove');
  this.events.dispatchEvent('remove', element);
};

Scene.prototype.removeElements = function (elements) {
  elements.forEach(element => delete this.elements[element.id]);
  this.events.dispatchEvent('change', elements, 'remove');
  this.events.dispatchEvent('remove', elements);
};

Scene.prototype.getVertices = function () {
  return this.getElements('vertex');
};

Scene.prototype.getWalls = function () {
  return this.getElements('wall');
};

Scene.prototype.getRooms = function () {
  return this.getElements('room');
};


Scene.prototype.getElements = function (type) {

  type = !type ? false : type.toLowerCase();

  let elements = [];

  for (let id in this.elements) {
    let element = this.elements[id];

    if (!type || Scene.typeof(element) === type) {
      elements.push(element);
    }
  }

  return elements;
};


Scene.prototype.hasElement = function (element) {
  let elements = this.elements;
  return element.hasOwnProperty('id') && elements.hasOwnProperty(element.id);
};


Scene.prototype.toJson = function () {

  return this.getElements()
    .map((element) => element.toJson());

};

/** events **/
Scene.prototype.onChange = function (handler) {
  this.events.addEventListener('change', handler);
};

Scene.prototype.offChange = function (handler) {
  this.events.removeEventListener('change', handler);
};

Scene.prototype.onAdd = function (handler) {
  this.events.addEventListener('add', handler);
};

Scene.prototype.offAdd = function (handler) {
  this.events.removeEventListener('add', handler);
};

Scene.prototype.onRemove = function (handler) {
  this.events.addEventListener('remove', handler);
};

Scene.prototype.offRemove = function (handler) {
  this.events.removeEventListener('remove', handler);
};

Scene.prototype.onClick = function (handler) {
  this.events.addEventListener('click', handler);
};

Scene.prototype.offClick = function (handler) {
  this.events.removeEventListener('click', handler);
};

Scene.prototype.onMouseDown = function (handler) {
  this.events.addEventListener('mousedown', handler);
};

Scene.prototype.offMouseDown = function (handler) {
  this.events.removeEventListener('mousedown', handler);
};

Scene.prototype.onMouseUp = function (handler) {
  this.paper.mouseup(handler);
};

Scene.prototype.offMouseUp = function (handler) {
  this.paper.unmouseup(handler);
};

Scene.prototype.onMouseMove = function (handler) {
  this.paper.mousemove(handler);
};

Scene.prototype.offMouseMove = function (handler) {
  this.paper.unmousemove(handler);
};

Scene.prototype.remove = function () {
  this.getElements().forEach(function (element) {
    element.remove();
  });
  this.elements = {};
  this.events.dispatchEvent('change', this, 'remove');
  this.events.dispatchEvent('remove', this);
};

Scene.prototype.load = function (data) {

  let paper = this.paper;
  let scene = this;
  scene.remove();

  let loadedElements = {};

  data
    .filter(d => d.type == 'vertex')
    .forEach(d => {
      loadedElements[d.id] = new Vertex(paper, d.x, d.y)
    });

  data
    .filter(d => d.type == 'wall')
    .forEach(d => {
      let vertex0 = loadedElements[d.vertex0];
      if (!vertex0) throw new Error('Impossibile to load vertex ' + d.vertex0);
      let vertex1 = loadedElements[d.vertex1];
      if (!vertex1) throw new Error('Impossibile to load vertex ' + d.vertex1);
      loadedElements[d.id] = new Wall(paper, vertex0, vertex1, d.tickness);
    });

  data
    .filter(d => d.type == 'window')
    .forEach(d => {
      let wall = loadedElements[d.wall];
      if (!wall) throw new Error('Impossibile to load vertex ' + d.wall);
      loadedElements[d.id] = new Window(paper, wall, d.offset, d.distanceFromFloor, d.inverted, d.opposite);
    });

  data
    .filter(d => d.type == 'door')
    .forEach(d => {
      let wall = loadedElements[d.wall];
      if (!wall) throw new Error('Impossibile to load vertex ' + d.wall);
      loadedElements[d.id] = new Door(paper, wall, d.offset, d.distanceFromFloor, d.inverted, d.opposite);
    });

  let loadedElementsArray = [];
  for (var ID in loadedElements) {
    loadedElementsArray.push(loadedElements[ID]);
  }

  scene.addElements(loadedElementsArray);

  this.getVertices().forEach(vertex=> vertex.redraw());
};

Scene.prototype.refreshRooms = function () {
  let scene = this;
  let vertices = scene.getVertices();
  let walls = scene.getWalls();

  //remove old rooms
  scene.getRooms().forEach(function (room) {
    scene.removeElement(room);
    room.remove();
  });

  //add new rooms
  let verticesArray = vertices.map(function (vertex) {
    return [vertex.x, vertex.y];
  });
  let wallsArray = walls.map(function (wall) {
    return wall.vertices.map(function (vertex) {
      return vertices.indexOf(vertex);
    })
  });

  let cycles = find_inner_cycles(verticesArray, wallsArray);

  let rooms = cycles.v_cycles.map(function (roomVerticesIds) {
    return roomVerticesIds.map(function (vertexId) {
      return vertices[vertexId];
    });
  });

  let roomsColor = randomColor({
    count: rooms.length,
    hue: 'green',
    luminosity: 'light',
    format: 'rgb'
  });

  let roomsPatternDirection = randomNumber({
    count: rooms.length,
    max: 180,
    shuffle: true
  });

  rooms.forEach((vertices, i) => {
    let room = new Room(this.paper, vertices, roomsColor[i], roomsPatternDirection[i]);
    scene.addElement(room);
  });
};


Scene.typeof = function (obj) {
  if (Door.isDoor(obj)) return 'door';
  if (Window.isWindow(obj)) return 'window';
  if (Room.isRoom(obj)) return 'room';
  if (Vertex.isVertex(obj)) return 'vertex';
  if (Wall.isWall(obj)) return 'wall';
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
};

/**
 * nearestElement
 */
Scene.prototype.nearestElement = function (x, y, minAcceptedDistance, type) {

  let minElement = null;
  let minDistance = Infinity;
  let elements = type ? this.getElements(type) : this.getElements();

  elements.forEach(function (element) {

    let distance = element.distanceFromPoint(x, y);

    if (distance < minDistance) {
      minDistance = distance;
      minElement = element;
    }
  });

  if (minDistance <= minAcceptedDistance) {
    return minElement;
  } else {
    return null;
  }
};

