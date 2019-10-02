(function () {
  'use strict';

  angular
    .module('posts')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
  /*  menuService.addMenuItem('topbar', {
      title: 'Posts',
      state: 'posts.list',
      roles: ['*']
    });
*/
  }
}());
