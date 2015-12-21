"use strict";

var RoomsDetector = function (walle) {
  this.walle = walle;
  this.paper = walle.paper;
};


/**
 * start
 */
RoomsDetector.prototype.start = function () {
  console.log("start rooms detector");

  this.changeHandler = (element) => {
    if (Room.isRoom(element)) return;
    this.refreshRooms();
  };

  this.walle.scene.onChange(this.changeHandler);

};

/**
 * refresh rooms
 */
RoomsDetector.prototype.refreshRooms = function () {
  console.log("refresh rooms");

  let scene = this.walle.scene;
  let edges = scene.getEdges();
  let walls = scene.getWalls();

  //clear old rooms
  scene.getRooms().forEach(function (room) {
    scene.removeElement(room);
    room.remove();
  });

  //TODO implement room detection system
  if (walls.length === 3) {
    let room = new Room(this.paper, walls);
    scene.addElement(room);
  }

};


/**
 * stop
 */
RoomsDetector.prototype.stop = function () {
  console.log("stop rooms detector");
};
