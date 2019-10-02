(function () {
  'use strict';

  angular
    .module('posts.admin')
    .controller('PostsAdminController', PostsAdminController);

  PostsAdminController.$inject = ['$scope', '$state', '$window', 'postResolve', 'Authentication', 'Notification', '$stateParams'];

  function PostsAdminController($scope, $state, $window, post, Authentication, Notification, $stateParams) {
    var vm = this;

    vm.post = post;
    console.error(vm.post);
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.cancel = cancel;

    // Remove existing Post
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.post.$remove(function () {
          $state.go('travelBlogs.view', { travelBlogId: $stateParams.travelBlogId });
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Post deleted successfully!' });
        });
      }
    }

    // Save Post
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.postForm');
        return false;
      }

      vm.post.travelBlog = $stateParams.travelBlogId;
      // Create a new post, or update the current instance
      vm.post.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('travelBlogs.view', { travelBlogId: $stateParams.travelBlogId }); // should we send the User to the list or the updated Post's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Post saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Post save error!' });
      }
    }

    function cancel() {
      $state.go('travelBlogs.view', { travelBlogId: $stateParams.travelBlogId });
    }
  }
}());
