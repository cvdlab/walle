"use strict";

/**
 * Constructor
 * @param container
 * @constructor
 */
var Walle = function (container) {

  this.document = jQuery(document);
  this.pixelPerUnit = 60;
  this.splashTime = 0;

  //init vars;
  this.width = container.offsetWidth;
  this.height = container.offsetHeight;

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
  this.paper.appendTo(this.wrapper.get(0));
  this.scene = new Scene(this.paper);

  //snap to
  this.snapTo = new SnapTo(this);

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

/** snap **/
Walle.prototype.useSnapTo = function (handler) {
  this.snapTo.use(handler);
};

/** snap **/
Walle.prototype.removeSnapTo = function () {
  this.snapTo.remove();
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
  let storageKey = 'walle_scene_autosave';
  let storage = window.localStorage;

  let scene = this.scene;

  if (storage.getItem(storageKey) !== null) {
    //revert
    let json = JSON.parse(storage.getItem(storageKey));
    scene.load(json);
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
