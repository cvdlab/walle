"use strict";

var Scene = function (paper) {
  this.paper = paper;
  this.elements = [];
  this.events = new Events();
};


Scene.prototype.addElement = function (element) {
  console.log("add", element);
  this.elements.push(element);
  this.events.dispatchEvent('change', element, 'add');
  this.events.dispatchEvent('add', element);
};

Scene.prototype.removeElement = function (element) {
  console.log("remove", element);
  var i = this.elements.indexOf(element);
  if (i !== -1) this.elements.splice(i, 1);
  this.events.dispatchEvent('change', element, 'remove');
  this.events.dispatchEvent('remove', element);
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
  if (!type) return this.elements;

  type = type.toLowerCase();

  let elements = [];

  this.elements.forEach(function (element) {
    let typeOf = Scene.typeof(element);

    if (typeOf === type) {
      elements.push(element);
    }
  });

  return elements;
};


Scene.prototype.hasElement = function (element) {
  return this.elements.indexOf(element) >= 0;
};


Scene.prototype.toJson = function () {

  let groups = {};

  this.elements.forEach(function (element) {
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

Scene.prototype.remove = function () {
  this.elements.forEach(function (element) {
    element.remove();
  });
  this.elements = [];
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


Scene.typeof = function (obj) {
  if (Door.isDoor(obj)) return 'door';
  if (Window.isWindow(obj)) return 'window';
  if (Room.isRoom(obj)) return 'room';
  if (Edge.isEdge(obj)) return 'edge';
  if (Wall.isWall(obj)) return 'wall';
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
};


