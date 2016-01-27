"use strict";

var Panel = function (walle) {
  this.walle = walle;

  this.featuresStatus = {};
  this.featuresBtn = {};
  this.exclusiveFeatures = [];

};


/**
 * start
 */
Panel.prototype.start = function () {

  this.panel = jQuery("<div/>", {
    class: 'panel'
  })
    .appendTo(this.walle.wrapper);

  this.addFeature("WallsDrawer", "flaticon-walls1", "Add wall", false, true);
  this.addFeature("WindowsDrawer", "flaticon-opened17", "Add window", false, true);
  this.addFeature("DoorsDrawer", "flaticon-open203", "Add door", false, true);
  this.addSeparator();

  this.addFeature("ElementsProperties", "flaticon-up13", "Change element properties", false, true);
  this.addFeature("WallsMover", "flaticon-up13", "Move wall", false, true);
  this.addFeature("WallsRemover", "flaticon-eraser11", "Remove wall", false, true);
  this.addFeature("EdgesMover", "flaticon-move24", "Move wall anchor point", false, true);

  this.addSeparator();

  this.addFeature("SceneExport", "flaticon-social13", "Download scene", false, true);
  this.addFeature("SceneImporter", "flaticon-arrow68", "Import scene", false, true);
  this.addFeature("SceneRemove", "flaticon-basket33", "Remove scene", false, true);

  this.addSeparator();

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
  if (exclusive) exclusiveFeatures.push(featureName);


  let featureBtn = featuresBtn[featureName] = jQuery("<a href />")
    .attr({class: "btn tooltip", title: featureDescription})
    .appendTo(this.panel);

  let icon = jQuery("<i/>", {class: iconClass})
    .appendTo(featureBtn);

  let width = 0;
  panel.find('a, span').each(function (i) {
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

  if (defaultOn) this.turnOn(featureName);

};

Panel.prototype.addSeparator = function () {
  jQuery("<span />", {class: "separator"})
    .appendTo(this.panel);
};


Panel.prototype.turnOn = function (featureName) {
  console.log(featureName + ' turn on');

  let exclusiveFeatures = this.exclusiveFeatures;

  if (exclusiveFeatures.indexOf(featureName) !== -1) {
    exclusiveFeatures.forEach(currentFeatureName => {
      if (this.featuresStatus[currentFeatureName] && exclusiveFeatures.indexOf(currentFeatureName) !== -1) {
        this.turnOff(currentFeatureName);
      }
    });
  }

  let colors = this.colors;
  this.walle.feature(featureName).start();
  this.featuresStatus[featureName] = true;
  this.featuresBtn[featureName].addClass('on');
};


Panel.prototype.turnOff = function (featureName) {
  console.log(featureName + ' turn off');

  let colors = this.colors;
  this.walle.feature(featureName).stop();
  this.featuresStatus[featureName] = false;
  this.featuresBtn[featureName].removeClass('on');
};
