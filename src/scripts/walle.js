"use strict";

/**
 * Constructor
 * @param container
 * @constructor
 */
var Walle = function (container) {

  this.isProduction = window.location.port == "";
  this.document = jQuery(document);
  this.pixelPerUnit = 60;
  this.splashTime = (this.isProduction) ? 3000 : 0;

  //init vars;
  let width = this.width = container.offsetWidth;
  let height = this.height = container.offsetHeight;

  this.events = new Events();
  this.debugMode = false;
  this.featuresInstance = {};

  // init wrapper
  this.wrapper = jQuery("<div/>", {
    width: this.width,
    height: this.height,
    class: 'walle'
  }).appendTo(container);
  jQuery("<div/>", { class: "overlay" }).appendTo(this.wrapper);

  //init paper and scene
  this.paper = Snap(this.width, this.height);
  this.paper.g().attr({id: "grids"});
  this.paper.g().attr({id: "rooms"});
  this.paper.g().attr({id: "walls"});
  this.paper.g().attr({id: "holes"});
  this.paper.g().attr({id: "vertices"});
  this.paper.g().attr({id: "snap-elements"});
  this.paper.g().attr({id: "rulers"});
  this.paper.appendTo(this.wrapper.get(0));
  this.scene = new Scene(this.paper, width, height);

  this.showSplash();
  this.revertAndAutosave();

  //abort
  let buttons = {esc: 27};
  this.document.on("keydown", event => {
    if (event.keyCode == buttons.esc) this.events.dispatchEvent('abort', event);
  });

};

/**
 * get feature
 */
Walle.prototype.feature = function (featureName) {
  if (this.featuresInstance.hasOwnProperty(featureName))
    return this.featuresInstance[featureName];

  if (!window.hasOwnProperty(featureName)) {
    throw new Error("feature " + featureName + " not found");
  }

  return this.featuresInstance[featureName] = new window[featureName](this);
};


/**
 * changeCursor
 */
Walle.prototype.changeCursor = function (cursor) {
  this.wrapper.css('cursor', cursor);
};

/** events **/
Walle.prototype.onAbort = function (handler) {
  this.events.addEventListener('abort', handler);
};

Walle.prototype.offAbort = function (handler) {
  this.events.removeEventListener('abort', handler);
};


Walle.prototype.showSplash = function () {
  let splash = jQuery("<div/>", {
    class: 'splash'
  })
    .appendTo(this.wrapper);

  let content = jQuery('<div>', {
    class: "content"
  })
    .html("<i class=\"flaticon-draft\"></i> Walle 1.0")
    .appendTo(splash);

  setInterval(function () {
    splash.fadeOut("slow", function () {
      splash.remove();
    });
  }, this.splashTime);

};

Walle.prototype.revertAndAutosave = function () {

  if (!window.localStorage) return;
  let storageKey = 'walle_scene_autosave_v1';
  let storage = window.localStorage;

  let scene = this.scene;

  if (storage.getItem(storageKey) !== null) {
    //revert
    let data = storage.getItem(storageKey);
    try {
      let json = JSON.parse(data);
      scene.load(json);
    } catch (e) {
      console.error(e);
      alert("Impossible to restore scene");
      scene.remove();
    }
  }

  scene.onChange(function () {

    let json = JSON.stringify(scene.toJson());
    storage.setItem(storageKey, json);

  });

};

Walle.prototype.overlay = function (on) {
  let wrapper = this.wrapper;
  if(on)
    wrapper.addClass('show-overlay');
  else
    wrapper.removeClass('show-overlay');
};

Walle.prototype.addElementsFeedback = function (elementsName) {
  let wrapper = this.wrapper;
  elementsName.forEach(elementName => wrapper.addClass(elementName + '-feedback'));
};

Walle.prototype.removeElementsFeedback = function (elementsName) {
  let wrapper = this.wrapper;
  elementsName.forEach(elementName => wrapper.removeClass(elementName + '-feedback'));
};

Walle.prototype.showLayer = function (layerID) {
  let wrapper = this.wrapper;
  wrapper.removeClass(`hide-${layerID}`);
};

Walle.prototype.hideLayer = function (layerID) {
  let wrapper = this.wrapper;
  wrapper.addClass(`hide-${layerID}`);
};
