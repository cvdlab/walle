"use strict";

var DoorsDrawer = function (walle) {
  HolesDrawer.call(this, walle, Door);
};

DoorsDrawer.prototype = Object.create(HolesDrawer.prototype);

DoorsDrawer.prototype.constructor = DoorsDrawer;
