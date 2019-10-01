(function () {
  'use strict';

  angular
    .module('travelBlogs.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.travelBlogs', {
        abstract: true,
        url: '/travelBlogs',
        template: '<ui-view/>'
      })
      .state('admin.travelBlogs.list', {
        url: '',
        templateUrl: '/modules/travelBlogs/client/views/admin/list-travelBlogs.client.view.html',
        controller: 'TravelBlogsAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.travelBlogs.create', {
        url: '/create',
        templateUrl: '/modules/travelBlogs/client/views/admin/form-travelBlog.client.view.html',
        controller: 'TravelBlogsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          travelBlogResolve: newTravelBlog
        }
      })
      .state('admin.travelBlogs.edit', {
        url: '/:travelBlogId/edit',
        templateUrl: '/modules/travelBlogs/client/views/admin/form-travelBlog.client.view.html',
        controller: 'TravelBlogsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin'],
          pageTitle: '{{ travelBlogResolve.title }}'
        },
        resolve: {
          travelBlogResolve: getTravelBlog
        }
      });
  }

  getTravelBlog.$inject = ['$stateParams', 'TravelBlogsService'];

  function getTravelBlog($stateParams, TravelBlogsService) {
    return TravelBlogsService.get({
      travelBlogId: $stateParams.travelBlogId
    }).$promise;
  }

  newTravelBlog.$inject = ['TravelBlogsService'];

  function newTravelBlog(TravelBlogsService) {
    return new TravelBlogsService();
  }
}());
