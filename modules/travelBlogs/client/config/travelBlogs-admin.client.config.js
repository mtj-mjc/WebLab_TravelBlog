(function () {
  'use strict';

  // Configuring the TravelBlogs Admin module
  angular
    .module('travelBlogs.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage TravelBlogs',
      state: 'admin.travelBlogs.list'
    });
  }
}());
