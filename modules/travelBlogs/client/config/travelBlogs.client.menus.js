(function () {
  'use strict';

  angular
    .module('travelBlogs')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'TravelBlogs',
      state: 'travelBlogs.list',
      roles: ['*']
    });

  }
}());
