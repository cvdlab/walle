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

Scene.prototype.getEdges = function () {
  return this.getElements('edge');
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

  let groups = {};

  this.getElements().forEach(function (element) {
    let typeOf = Scene.typeof(element);
    groups[typeOf] = groups[typeOf] || [];
    groups[typeOf].push(element.toJson());
  });

  return groups;
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
  let hashMap = [];

  let hashEdge = (edge) => {
    return edge.type + '_' + edge.x + '_' + edge.y
  };
  let hashWall = (wall)=> {
    return wall.type + '_' + hashEdge(wall.edge0) + '_' + hashEdge(wall.edge1)
  };

  data.edge = data.edge || [];
  data.wall = data.wall || [];
  data.window = data.window || [];
  data.door = data.door || [];

  //load edge
  data.edge.forEach((edge)=> {
    let edgeObj = new Edge(paper, edge.x, edge.y);
    hashMap[hashEdge(edge)] = edgeObj;
    this.addElement(edgeObj);
  });

  //load wall
  data.wall.forEach((wall)=> {
    let edge0 = hashMap[hashEdge(wall.edge0)];
    let edge1 = hashMap[hashEdge(wall.edge1)];
    if (!edge0 || !edge1) throw new Error("Edge not found");

    let wallObj = new Wall(paper, edge0, edge1);
    hashMap[hashWall(wall)] = wallObj;
    this.addElement(wallObj);
  });

  //load window
  data.window.forEach((window) => {
    let wall = hashMap[hashWall(window.wall)];
    if (!wall) throw new Error("Wall not found");

    let windowObj = new Window(paper, wall, window.offset);
    this.addElement(windowObj);
  });

  //load door
  data.door.forEach((door) => {
    let wall = hashMap[hashWall(door.wall)];
    if (!wall) throw new Error("Wall not found");

    let doorObj = new Door(paper, wall, door.offset);
    this.addElement(doorObj);
  });

  //redraw edge
  this.getEdges().forEach((edge)=> {
    edge.redraw();
  });
};

Scene.prototype.refreshRooms = function () {
  let scene = this;
  let edges = scene.getEdges();
  let walls = scene.getWalls();

  //remove old rooms
  scene.getRooms().forEach(function (room) {
    scene.removeElement(room);
    room.remove();
  });

  //add new rooms
  let edgesArray = edges.map(function (edge) {
    return [edge.x, edge.y];
  });
  let wallsArray = walls.map(function (wall) {
    return wall.edges.map(function (edge) {
      return edges.indexOf(edge);
    })
  });

  let cycles = find_inner_cycles(edgesArray, wallsArray);

  let rooms = cycles.v_cycles.map(function (roomEdgesIds) {
    return roomEdgesIds.map(function (edgeId) {
      return edges[edgeId];
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

  rooms.forEach((edges, i) => {
    let room = new Room(this.paper, edges, roomsColor[i], roomsPatternDirection[i]);
    scene.addElement(room);
  });
};


Scene.typeof = function (obj) {
  if (Door.isDoor(obj)) return 'door';
  if (Window.isWindow(obj)) return 'window';
  if (Room.isRoom(obj)) return 'room';
  if (Edge.isEdge(obj)) return 'edge';
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

