"use strict";

(function (Snap) {

  Snap.plugin(function (Snap, Element, Paper, glob, Fragment) {

    let supportedEvents = [
      "click", "dblclick",
      "mousedown", "mousemove", "mouseout", "mouseover", "mouseup",
      "touchstart", "touchmove", "touchend", "touchcancel"];

    Element.prototype.addListener = function (event, listener) {
      let element = this;

      if (!element.emitter) {

        let emitter = new EventEmitter2({wildcard: true});

        supportedEvents.forEach(eventName => {
          element[eventName](event => {
            emitter.emit(eventName + ".**", event)
          });
        });

        element.emitter = emitter;
      }
      element.emitter.addListener(event, listener);
    };

    Element.prototype.removeListener = function (event, listener) {
      let element = this;
      if (!element.emitter) return;
      element.emitter.removeListener(event, listener);
    };

    Element.prototype.removeAllListeners = function (event) {
      let element = this;
      if (!element.emitter) return;
      element.emitter.removeAllListeners(arguments);
    };
  });

})(Snap);
