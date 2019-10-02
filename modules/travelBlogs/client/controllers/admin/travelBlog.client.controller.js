(function () {
  'use strict';

  angular
    .module('travelBlogs.admin')
    .controller('TravelBlogsAdminController', TravelBlogsAdminController);

  TravelBlogsAdminController.$inject = ['$scope', '$state', '$window', 'travelBlogResolve', 'Authentication', 'Notification'];

  function TravelBlogsAdminController($scope, $state, $window, travelBlog, Authentication, Notification) {
    var vm = this;

    vm.travelBlog = travelBlog;
    console.error(vm.travelBlog);
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.cancel = cancel;

    // Remove existing TravelBlog
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.travelBlog.$remove(function () {
          $state.go('travelBlogs.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> TravelBlog deleted successfully!' });
        });
      }
    }

    // Save TravelBlog
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.travelBlogForm');
        return false;
      }

      // Create a new travelBlog, or update the current instance
      vm.travelBlog.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('travelBlogs.view', { travelBlogId: vm.travelBlog._id }); // should we send the User to the list or the updated TravelBlog's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> TravelBlog saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> TravelBlog save error!' });
      }
    }

    function cancel() {
      $state.go('travelBlogs.view', { travelBlogId: vm.travelBlog._id });
    }
  }
}());
