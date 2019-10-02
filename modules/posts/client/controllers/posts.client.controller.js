(function () {
  'use strict';

  angular
    .module('posts')
    .controller('PostsController', PostsController);

  PostsController.$inject = ['$scope', 'postResolve', 'Authentication'];

  function PostsController($scope, post, Authentication) {
    var vm = this;

    vm.post = post;
    vm.authentication = Authentication;

  }
}());
