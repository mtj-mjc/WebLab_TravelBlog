(function () {
  'use strict';

  angular
    .module('travelBlogs.services')
    .factory('TravelBlogsService', TravelBlogsService);

  TravelBlogsService.$inject = ['$resource', '$log'];

  function TravelBlogsService($resource, $log) {
    var TravelBlog = $resource('/api/travelBlogs/:travelBlogId', {
      travelBlogId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(TravelBlog.prototype, {
      createOrUpdate: function () {
        var travelBlog = this;
        return createOrUpdate(travelBlog);
      }
    });

    return TravelBlog;

    function createOrUpdate(travelBlog) {
      if (travelBlog._id) {
        return travelBlog.$update(onSuccess, onError);
      } else {
        return travelBlog.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(travelBlog) {
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
