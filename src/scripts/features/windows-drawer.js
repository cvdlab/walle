"use strict";

var WindowsDrawer = function (walle) {
  HolesDrawer.call(this, walle, Window);
};

WindowsDrawer.prototype = Object.create(HolesDrawer.prototype);

WindowsDrawer.prototype.constructor = WindowsDrawer;
