﻿(function () {
  'use strict';

  // Configuring the Posts Admin module
  angular
    .module('posts.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Posts',
      state: 'admin.posts.list'
    });
  }
}());
