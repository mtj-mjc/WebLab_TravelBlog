(function () {
  'use strict';

  angular
    .module('travelBlogs.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('travelBlogs', {
        abstract: true,
        url: '/travelBlogs',
        template: '<ui-view/>'
      })
      .state('travelBlogs.list', {
        url: '',
        templateUrl: '/modules/travelBlogs/client/views/list-travelBlogs.client.view.html',
        controller: 'TravelBlogsListController',
        controllerAs: 'vm'
      })
      .state('travelBlogs.view', {
        url: '/:travelBlogId',
        templateUrl: '/modules/travelBlogs/client/views/view-travelBlog.client.view.html',
        controller: 'TravelBlogsController',
        controllerAs: 'vm',
        resolve: {
          travelBlogResolve: getTravelBlog
        },
        data: {
          pageTitle: '{{ travelBlogResolve.title }}'
        }
      });
  }

  getTravelBlog.$inject = ['$stateParams', 'TravelBlogsService'];

  function getTravelBlog($stateParams, TravelBlogsService) {
    return TravelBlogsService.get({
      travelBlogId: $stateParams.travelBlogId
    }).$promise;
  }
}());
