"use strict";

var VisibilityLayer = function (walle) {
  this.walle = walle;
  this.paper = walle.paper;
  this.layers = {};

  this.icons = {
    on: 'flaticon-eye110',
    off: 'flaticon-visibility2'
  };
};


/**
 * start
 */
VisibilityLayer.prototype.start = function () {

  let layers = this.layers;
  let icons = this.icons;
  let walle = this.walle;

  this.panel = jQuery("<div/>", {
    class: 'visibility-layer'
  })
    .click(function (event) {
      event.preventDefault();

      let btn = jQuery(event.target);
      let layerID = btn.attr('layer-id');
      if (!layerID) return;
      let layer = layers[layerID];
      layer.status = !layer.status;

      if (layer.status) {
        layer.icon.attr('class', icons.on);
        layer.btn.addClass('on');
        layer.btn.removeClass('off');
        walle.showLayer(layerID);
      } else {
        layer.icon.attr('class', icons.off);
        layer.btn.addClass('off');
        layer.btn.removeClass('on');
        walle.hideLayer(layerID);
      }
    })
    .appendTo(this.walle.wrapper);

  this.addVisibilityElementButton('layer-walls', 'Walls');
  this.addVisibilityElementButton('layer-rooms', 'Rooms');
  this.addVisibilityElementButton('layer-windows', 'Windows');
  this.addVisibilityElementButton('layer-doors', 'Doors');
  this.addVisibilityElementButton('layer-grid', 'Grid');

};

VisibilityLayer.prototype.addVisibilityElementButton = function (layerID, label) {

  let icons = this.icons;

  let btn = jQuery("<a href />")
    .text(label)
    .attr({class: "btn on", 'layer-id': layerID})
    .appendTo(this.panel);

  let icon = jQuery("<i/>", {class: icons.on})
    .prependTo(btn);

  this.layers[layerID] = {
    status: true,
    btn: btn,
    icon: icon
  };

};

/**
 * stop
 */
VisibilityLayer.prototype.stop = function () {

};
