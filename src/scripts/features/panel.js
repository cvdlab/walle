"use strict";

var Panel = function (walle) {
  this.walle = walle;

  this.featuresStatus = {};
  this.featuresBtn = {};
  this.exclusiveFeatures = [];

  this.colors = {
    strokeOff: "#8E9BA2",
    strokeOn: "#1c79bc"
  };
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

  this.addFeature("wallsDrawer", "flaticon-walls1", "Draw new wall", false, true);
  this.addFeature("edgesMover", "flaticon-move24", "Move edge", false, true);
  this.addFeature("wallsMover", "flaticon-up13", "Move wall", false, true);
  this.addFeature("easterEgg", "flaticon-testtube1", "Experimental", false, true);

  this.addFeature("roomsDetector", "flaticon-plan1", "Rooms", true, false);
  this.addFeature("export", "flaticon-internet43", "Export", false, false);
  this.addFeature("grid", "flaticon-table41", "Show grids", true, false);
  this.addFeature("debugger", "flaticon-computer196", "Debug mode", false, false);

};


/**
 * stop
 */
Panel.prototype.stop = function () {


};


/**
 * add feature
 */
Panel.prototype.addFeature = function (featureName, iconClass, featureDescription, defaultOn, exclusive) {

  let featuresStatus = this.featuresStatus;
  let featuresBtn = this.featuresBtn;
  let colors = this.colors;
  let panel = this.panel;
  let exclusiveFeatures = this.exclusiveFeatures;

  featuresStatus[featureName] = false;
  if(exclusive) exclusiveFeatures.push(featureName);


  let featureBtn = featuresBtn[featureName] = jQuery("<a href />")
    .css({display: "inline-block", width: 40, "font-size": "30px", "text-align": "center", "text-decoration":"none", color: colors.strokeOff})
    .attr({title: featureDescription})
    .appendTo(this.panel);

  let icon = jQuery("<i/>", {class: iconClass})
    .css({color: "inherit", "font-size": "28px"})
    .appendTo(featureBtn);

  let width = 0;
  panel.find('a').each(function (i) {
    width += jQuery(this).outerWidth(true);
  });
  panel.width(width);

  let handler = (event) => {
    if (featuresStatus[featureName]) {
      this.turnOff(featureName);
    } else {
      this.turnOn(featureName);
    }

    event.preventDefault();
  };

  featureBtn.on('click', handler);

  if(defaultOn) this.turnOn(featureName);

};


Panel.prototype.turnOn = function (featureName) {
  console.log(featureName + ' turn on');

  let exclusiveFeatures = this.exclusiveFeatures;

  if(exclusiveFeatures.indexOf(featureName) !== -1){
    exclusiveFeatures.forEach(currentFeatureName =>{
      if(this.featuresStatus[currentFeatureName] && exclusiveFeatures.indexOf(currentFeatureName) !== -1){
        this.turnOff(currentFeatureName);
      }
    });
  };

  let colors = this.colors;
  this.walle.features[featureName].start();
  this.featuresStatus[featureName] = true;
  this.featuresBtn[featureName].css({color: colors.strokeOn});
};


Panel.prototype.turnOff = function (featureName) {
  console.log(featureName + ' turn off');

  let colors = this.colors;
  this.walle.features[featureName].stop();
  this.featuresStatus[featureName] = false;
  this.featuresBtn[featureName].css({color: colors.strokeOff});
};
