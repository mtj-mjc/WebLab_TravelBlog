(function () {
  'use strict';

  angular
    .module('posts.services')
    .factory('PostsService', PostsService);

  PostsService.$inject = ['$resource', '$log'];

  function PostsService($resource, $log) {
    var Post = $resource('/api/posts/:postId', {
      postId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Post.prototype, {
      createOrUpdate: function () {
        var post = this;
        return createOrUpdate(post);
      }
    });

    return Post;

    function createOrUpdate(post) {
      if (post._id) {
        return post.$update(onSuccess, onError);
      } else {
        return post.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(post) {
        // Any required internal processing from inside the service, goes here.
      }

      // Handle error response
      function onError(errorResponse) {
        var error = errorResponse.data;
        // Handle error internally
        handleError(error);
      }
    }

    function handleError(error) {
      // Log error
      $log.error(error);
    }
  }
}());
