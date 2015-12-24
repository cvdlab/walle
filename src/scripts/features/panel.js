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
    .css({position: "absolute", bottom: 5, left: 5, "background-color": "#f7f7f7", border: "1px solid #fff", "z-index": 700})
    .appendTo(this.walle.wrapper);

  this.addFeature("WallsDrawer", "flaticon-walls1", "Add a new wall", false, true);
  this.addFeature("EdgesMover", "flaticon-move24", "Move wall anchor point", false, true);
  this.addFeature("WallsMover", "flaticon-up13", "Move wall", false, true);
  this.addFeature("WindowsDrawer", "flaticon-opened17", "Add window", false, true);
  this.addFeature("SceneExport", "flaticon-internet43", "Download plan", false, true);

  this.addFeature("RoomsDetector", "flaticon-plan1", "Show Rooms", false, false);
  this.addFeature("Grid", "flaticon-table41", "Show grids", true, false);
  this.addFeature("Debugger", "flaticon-computer196", "Debug mode", false, false);
  this.addFeature("EasterEgg", "flaticon-testtube1", "Experimental", false, true);
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
    .addClass('tooltip')
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
  this.walle.feature(featureName).start();
  this.featuresStatus[featureName] = true;
  this.featuresBtn[featureName].css({color: colors.strokeOn});
};


Panel.prototype.turnOff = function (featureName) {
  console.log(featureName + ' turn off');

  let colors = this.colors;
  this.walle.feature(featureName).stop();
  this.featuresStatus[featureName] = false;
  this.featuresBtn[featureName].css({color: colors.strokeOff});
};
