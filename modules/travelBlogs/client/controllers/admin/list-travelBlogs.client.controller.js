(function () {
  'use strict';

  angular
    .module('travelBlogs.admin')
    .controller('TravelBlogsAdminListController', TravelBlogsAdminListController);

  TravelBlogsAdminListController.$inject = ['TravelBlogsService'];

  function TravelBlogsAdminListController(TravelBlogsService) {
    var vm = this;

    vm.travelBlogs = TravelBlogsService.query();
  }
}());
