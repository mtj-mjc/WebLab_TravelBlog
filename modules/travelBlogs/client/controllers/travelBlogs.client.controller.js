(function () {
  'use strict';

  angular
    .module('travelBlogs')
    .controller('TravelBlogsController', TravelBlogsController);

  TravelBlogsController.$inject = ['$scope', 'travelBlogResolve', 'Authentication'];

  function TravelBlogsController($scope, travelBlog, Authentication) {
    var vm = this;

    vm.travelBlog = travelBlog;
    vm.authentication = Authentication;

  }
}());
