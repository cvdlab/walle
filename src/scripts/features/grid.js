"use strict";

var Grid = function (walle) {
  this.walle = walle;
  this.paper = walle.paper;

  this.grid = {horizontal: [], vertical: []};
};


/**
 * start
 */
Grid.prototype.start = function () {
  let width = this.walle.width;
  let height = this.walle.height;
  let step = 20;

  //horizontal
  for (let x = 0; x <= width; x += step) {
    let line = this.paper.line(x, 0, x, height);
    line.attr({strokeWidth: 1, stroke: "#eee"});
    this.grid.vertical.push(line);
  }

  //vertical
  for (let y = 0; y <= height; y += step) {
    let line = this.paper.line(0, y, width, y);
    line.attr({strokeWidth: 1, stroke: "#eee"});
    this.grid.horizontal.push(line);
  }
};


/**
 * stop
 */
Grid.prototype.stop = function () {

  this.grid.vertical.forEach(function (element) {
    element.remove();
  });
  this.grid.horizontal.forEach(function (element) {
    element.remove();
  });

};
