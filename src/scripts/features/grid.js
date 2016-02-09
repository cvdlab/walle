"use strict";

var Grid = function (walle) {
  this.walle = walle;
  this.paper = walle.paper;
};


/**
 * start
 */
Grid.prototype.start = function () {
  let paper = this.paper;
  let width = this.walle.width;
  let height = this.walle.height;
  let step = this.walle.pixelPerUnit / 2;
  let grid = this.grid = paper.g().addClass('grid');

  paper.select('#grids').append(grid);

  //horizontal
  for (let x = 0; x <= width; x += step) {
    paper.line(x, 0, x, height).appendTo(grid);
  }

  //vertical
  for (let y = 0; y <= height; y += step) {
    paper.line(0, y, width, y).appendTo(grid);
  }
};


/**
 * stop
 */
Grid.prototype.stop = function () {
  this.grid.remove();
};
