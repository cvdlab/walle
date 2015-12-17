"use strict";

var Panel = function (walle) {
  this.walle = walle;
  this.features = [];
};


/**
 * start
 */
Panel.prototype.start = function () {

  this.panel = jQuery("<div/>", {
    width: 200,
    height: 33,
    class: 'walle-panel'
  })
    .css({position: "absolute", bottom: 5, left: 5, "background-color": "#f7f7f7", border: "1px solid #e3e3e3"})
    .appendTo(this.walle.wrapper);

  this.addFeature("wallsDrawer", "fa fa-plus", "Draw new wall", false);
  this.addFeature("edgesMover", "fa fa-hand-paper-o", "Move edge", false);
  this.addFeature("easterEgg", "fa fa-flask", "Experimental", false);
  this.addFeature("export", "fa fa-save", "Export", false);

  this.addFeature("grid", "fa fa-th", "Show grids", true);
  this.addFeature("debugger", "fa fa-terminal", "Debug mode", false);

  let width = 0;
  this.panel.find('a').each(function (i) {
    width += jQuery(this).outerWidth(true);
  });
  this.panel.width(width);

};


/**
 * stop
 */
Panel.prototype.stop = function () {


};


/**
 * add feature
 */
Panel.prototype.addFeature = function (featureName, iconClass, featureDescription, defaultOn) {

  let features = this.walle.features;

  this.features.push({iconClass, featureName, featureDescription});

  let colors = {
    strokeNormal: "#8E9BA2",
    strokeSelected: "#1c79bc"
  };

  let featureOn = function (event) {
    jQuery(this)
      .css({color: colors.strokeSelected})
      .one("click", featureOff);
    event.preventDefault();

    features[featureName].start();

    console.log(featureName + " now is ON");
  };

  let featureOff = function (event) {
    jQuery(this)
      .css({color: colors.strokeNormal})
      .one("click", featureOn);
    event.preventDefault();

    features[featureName].stop();

    console.log(featureName + " now is OFF");
  };


  let featureBtn = jQuery("<a href />")
    .css({display: "inline-block", width: 40, color: defaultOn ? colors.strokeSelected : colors.strokeNormal, "font-size": "30px", "text-align": "center"})
    .attr({title: featureDescription})
    .one('click', defaultOn ? featureOff : featureOn)
    .appendTo(this.panel);


  let icon = jQuery("<i/>", {
    class: iconClass
  })
    .css({color: "inherit", "font-size": "30px"})
    .appendTo(featureBtn);

  if (defaultOn) {
    features[featureName].start();
  }


};
