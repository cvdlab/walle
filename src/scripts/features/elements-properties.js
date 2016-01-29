"use strict";

var ElementsProperties = function (walle) {
  this.walle = walle;
  this.paper = walle.paper;
  this.status = ElementsProperties.statusWaiting;
};

/** costants */
ElementsProperties.statusWaiting = 0;
ElementsProperties.statusWorking = 1;


/**
 * start
 */
ElementsProperties.prototype.start = function () {

  let paper = this.paper;
  let scene = this.walle.scene;

  walle.addElementsFeedback(['wall', 'hole']);

  /** click handler **/
  this.clickHandler = (event, element) => {
    if (
      this.status === ElementsProperties.statusWaiting
      && element
      && (Wall.isWall(element) || Hole.isHole(element))
    ) {
      this.openPanel(element);
    }
  };

  scene.onClick(this.clickHandler);

};

/**
 * openPanel
 */
ElementsProperties.prototype.openPanel = function (element) {

  let walle = this.walle;

  walle.overlay(true);
  this.modal = jQuery("<div/>", {class: "modal mini"}).appendTo(walle.wrapper);

  let template = jQuery(ElementsProperties.template[Scene.typeof(element)]);

  this.modal.html(template);

  let inputText = template.find('input[type=text]');
  let inputCheckbox = template.find('input[type=checkbox]');

  inputText.each(function () {
    let input = jQuery(this);
    let bind = input.attr('data-bind');
    let value = element[bind];
    input.val(value);
  });

  inputCheckbox.each(function () {
    let input = jQuery(this);
    let bind = input.attr('data-bind');
    let value = element[bind];
    input.prop('checked', value);
  });

  template.find('input[type=reset]').click((event)=> {
    this.closePanel();
  });

  template.find('input[type=submit]').click((event)=> {
    event.preventDefault();

    inputText.each(function () {
      let input = jQuery(this);
      let bind = input.attr('data-bind');
      element[bind] = parseInt(input.val());
    });

    inputCheckbox.each(function () {
      let input = jQuery(this);
      let bind = input.attr('data-bind');
      element[bind] = input.is(':checked');
    });

    element.redraw();

    this.closePanel();
  });

};


ElementsProperties.prototype.closePanel = function (element) {

  this.modal.remove();
  this.walle.overlay(false);
  this.modal = false;

};

/**
 * stop
 */
ElementsProperties.prototype.stop = function () {
  let scene = this.walle.scene;
  let walle = this.walle;
  if (this.modal) this.closePanel();

  walle.removeElementsFeedback(['wall', 'hole']);

  scene.offClick(this.clickHandler);
};


/**
 * template
 */
ElementsProperties.template = {

  // window template
  window: `
    <form>
      <h3>Configure Window</h3>
      <div class="group">
        <label>Width</label>
        <input type="text" data-bind="length">
      </div>
      <div class="group">
        <label>Height</label>
        <input type="text" data-bind="height">
      </div>
      <div class="group">
        <label>Distance from floor</label>
        <input type="text" data-bind="distanceFromFloor">
      </div>
      <div class="group">
        <label>Inverted</label>
        <input type="checkbox" data-bind="inverted" value="1">
      </div>
      <div class="group">
        <label>Opposite</label>
        <input type="checkbox" data-bind="opposite" value="1">
      </div>
      <input type="reset" value="Annulla"/>
      <input type="submit" value="Aggiorna"/>
    </form>
    `,

  // door template
  door: `
    <form>
      <h3>Configure Door</h3>
      <div class="group">
        <label>Width</label>
        <input type="text" data-bind="length">
      </div>
      <div class="group">
        <label>Height</label>
        <input type="text" data-bind="height">
      </div>
      <div class="group">
        <label>Distance from floor</label>
        <input type="text" data-bind="distanceFromFloor">
      </div>
      <div class="group">
        <label>Inverted</label>
        <input type="checkbox" data-bind="inverted" value="1">
      </div>
      <div class="group">
        <label>Opposite</label>
        <input type="checkbox" data-bind="opposite" value="1">
      </div>
      <input type="reset" value="Annulla"/>
      <input type="submit" value="Aggiorna"/>
    </form>
    `,

    // wall template
  wall: `
    <form>
      <h3>Configure Wall</h3>
      <div class="group">
        <label>Tickness</label>
        <input type="text" data-bind="tickness">
      </div>
      <input type="reset" value="Annulla"/>
      <input type="submit" value="Aggiorna"/>
    </form>
    `


};
