"use strict";

var Utils = function () {
};


Utils.twoPointsDistance = function (x1, y1, x2, y2) {

  return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));

};

Utils.angleBetweenTwoPoints = function (x1, y1, x2, y2) {

  let angle = Math.atan2((x2 - x1), (y2 - y1)) * 180 / Math.PI;
  if (angle < 0) {
    return (360 + angle);
  } else {
    return (angle);
  }

};
