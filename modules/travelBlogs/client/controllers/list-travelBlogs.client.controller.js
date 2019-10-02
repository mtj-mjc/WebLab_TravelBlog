(function () {
  'use strict';

  angular
    .module('travelBlogs')
    .controller('TravelBlogsListController', TravelBlogsListController);

  TravelBlogsListController.$inject = ['TravelBlogsService'];

  function TravelBlogsListController(TravelBlogsService) {
    var vm = this;

    vm.travelBlogs = TravelBlogsService.query();
    console.error(vm.travelBlogs);
  }
}());
