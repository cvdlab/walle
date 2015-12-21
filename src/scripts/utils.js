"use strict";

var Utils = {};

Utils.twoPointsDistance = function (x1, y1, x2, y2) {

  return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));

};

Utils.linePointDistance = function (x1, y1, x2, y2, xp, yp) {

  let a = Math.abs((y2 - y1) * xp - (x2 - x1) * yp + x2 * y1 - y2 * x1);
  let b = Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2));

  return a / b;

};

Utils.angleBetweenTwoPoints = function (x1, y1, x2, y2) {

  let angle = Math.atan2((x2 - x1), (y2 - y1)) * 180 / Math.PI;
  if (angle < 0) {
    return (360 + angle);
  } else {
    return (angle);
  }

};

Utils.lineIntoBox = function (x1, y1, x2, y2, width, height) {

  let r1, r2;

  let m = (y2 - y1) / (x2 - x1);
  let q = y1 - m * x1;
  let t = m * width + q;

  if (q > 0)
    r1 = {x: 0, y: q};
  else
    r1 = {x: -q / m, y: 0};

  if (t < height)
    r2 = {x: width, y: t};
  else
    r2 = {x: (height - q) / m, y: height};

  return {r1, r2};

};

Utils.verticalLineIntoBox = function (x, y, width, height) {

  let r1 = {x: x, y: 0};
  let r2 = {x: x, y: height};

  return {r1, r2};

};

Utils.horizontalLineIntoBox = function (x, y, width, height) {

  let r1 = {x: 0, y: y};
  let r2 = {x: width, y: y};

  return {r1, r2};

};

//nearest point from line
Utils.intersectPoint = function (x1, y1, x2, y2, xp, yp) {

  if (x1 === x2) return {x: x1, y: yp};
  if (y1 === y2) return {x: xp, y: y1};

  let m = (y2 - y1) / (x2 - x1);
  let q = y1 - m * x1;

  let mi = -1 / m;
  let qi = yp - mi * xp;

  let x = (qi - q) / (m - mi);
  let y = (m * x + q);

  return {x, y};

};


Utils.centerPoint = function (x1, y1, x2, y2) {
  return {x: (x1 + x2) / 2, y: (y1 + y2) / 2};
};


Utils.translationVector = function (x1, y1, x2, y2, xp, yp) {

  //punto medio segmento
  let xm = (x1 + x2) / 2;
  let ym = (y1 + y2) / 2;

  //eq segmento
  let m =  (y2 - y1) / (x2 - x1);

  //retta perpendicolare
  let mi = -1 / m;
  let qi = ym - mi * xm;

  //retta parallela interseca (xp, yp)
  let mii = m;
  let qii = yp - mii * xp;

  //punto (xp, yp) proiettato su perpendicolare
  let xt = ( qii - qi ) / (mi - mii);
  let yt = mii * xt + qii;

  //vettore translazione
  let vx = xt - xm;
  let vy = yt - ym;

  return {x: xt, y: yt, vx, vy};
};


Utils.segmentPointDistance = function pDistance(x1, y1, x2, y2, xp, yp) {

  var A = xp - x1;
  var B = yp - y1;
  var C = x2 - x1;
  var D = y2 - y1;

  var dot = A * C + B * D;
  var len_sq = C * C + D * D;
  var param = -1;
  if (len_sq != 0) //in case of 0 length line
    param = dot / len_sq;

  var xx, yy;

  if (param < 0) {
    xx = x1;
    yy = y1;
  }
  else if (param > 1) {
    xx = x2;
    yy = y2;
  }
  else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }

  var dx = xp - xx;
  var dy = yp - yy;
  return Math.sqrt(dx * dx + dy * dy);
};

Utils.randomColor = function (numOfSteps, step) {
  // This function generates vibrant, "evenly spaced" colours (i.e. no clustering). This is ideal for creating easily distinguishable vibrant markers in Google Maps and other apps.
  // Adam Cole, 2011-Sept-14
  // HSV to RBG adapted from: http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
  var r, g, b;
  var h = step / numOfSteps;
  var i = ~~(h * 6);
  var f = h * 6 - i;
  var q = 1 - f;
  switch(i % 6){
    case 0: r = 1; g = f; b = 0; break;
    case 1: r = q; g = 1; b = 0; break;
    case 2: r = 0; g = 1; b = f; break;
    case 3: r = 0; g = q; b = 1; break;
    case 4: r = f; g = 0; b = 1; break;
    case 5: r = 1; g = 0; b = q; break;
  }
  var c = "#" + ("00" + (~ ~(r * 255)).toString(16)).slice(-2) + ("00" + (~ ~(g * 255)).toString(16)).slice(-2) + ("00" + (~ ~(b * 255)).toString(16)).slice(-2);
  return (c);
};

Utils.randomIntInclusive = function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
