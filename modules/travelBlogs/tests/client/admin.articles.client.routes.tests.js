﻿(function () {
  'use strict';

  describe('TravelBlogs Route Tests', function () {
    // Initialize global variables
    var $scope,
      TravelBlogsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _TravelBlogsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      TravelBlogsService = _TravelBlogsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('admin.travelBlogs');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/travelBlogs');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('List Route', function () {
        var liststate;
        beforeEach(inject(function ($state) {
          liststate = $state.get('admin.travelBlogs.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should be not abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/travelBlogs/client/views/admin/list-posts.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          TravelBlogsAdminController,
          mockTravelBlog;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('admin.travelBlogs.create');
          $templateCache.put('/modules/travelBlogs/client/views/admin/form-post.client.view.html', '');

          // Create mock travelBlog
          mockTravelBlog = new TravelBlogsService();

          // Initialize Controller
          TravelBlogsAdminController = $controller('TravelBlogsAdminController as vm', {
            $scope: $scope,
            travelBlogResolve: mockTravelBlog
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.travelBlogResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/admin/travelBlogs/create');
        }));

        it('should attach an travelBlog to the controller scope', function () {
          expect($scope.vm.travelBlog._id).toBe(mockTravelBlog._id);
          expect($scope.vm.travelBlog._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('/modules/travelBlogs/client/views/admin/form-post.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          TravelBlogsAdminController,
          mockTravelBlog;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('admin.travelBlogs.edit');
          $templateCache.put('/modules/travelBlogs/client/views/admin/form-post.client.view.html', '');

          // Create mock travelBlog
          mockTravelBlog = new TravelBlogsService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An TravelBlog about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          TravelBlogsAdminController = $controller('TravelBlogsAdminController as vm', {
            $scope: $scope,
            travelBlogResolve: mockTravelBlog
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:travelBlogId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.travelBlogResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            travelBlogId: 1
          })).toEqual('/admin/travelBlogs/1/edit');
        }));

        it('should attach an travelBlog to the controller scope', function () {
          expect($scope.vm.travelBlog._id).toBe(mockTravelBlog._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('/modules/travelBlogs/client/views/admin/form-post.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
