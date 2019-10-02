(function () {
  'use strict';

  angular
    .module('travelBlogs')
    .controller('TravelBlogsController', TravelBlogsController);

  TravelBlogsController.$inject = ['$scope', 'travelBlogResolve', 'Authentication', 'PostsService', '$window', '$state'];

  function TravelBlogsController($scope, travelBlog, Authentication, PostsService, $window, $state) {
    var vm = this;

    vm.travelBlog = travelBlog;
    vm.authentication = Authentication;
    vm.posts = PostsService.query({
      travelBlogId: vm.travelBlog._id
    });
    vm.remove = remove;

    // Remove existing TravelBlog
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.travelBlog.$remove(function () {
          $state.go('travelBlogs.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> TravelBlog deleted successfully!' });
        });
      }
    }
  }
}());
