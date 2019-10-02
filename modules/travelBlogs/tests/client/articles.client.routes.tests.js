(function () {
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
          mainstate = $state.get('travelBlogs');
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
          liststate = $state.get('travelBlogs.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/travelBlogs/client/views/list-posts.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          TravelBlogsController,
          mockTravelBlog;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('travelBlogs.view');
          $templateCache.put('/modules/travelBlogs/client/views/view-post.client.view.html', '');

          // create mock travelBlog
          mockTravelBlog = new TravelBlogsService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An TravelBlog about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          TravelBlogsController = $controller('TravelBlogsController as vm', {
            $scope: $scope,
            travelBlogResolve: mockTravelBlog
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:travelBlogId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.travelBlogResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            travelBlogId: 1
          })).toEqual('/travelBlogs/1');
        }));

        it('should attach an travelBlog to the controller scope', function () {
          expect($scope.vm.travelBlog._id).toBe(mockTravelBlog._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('/modules/travelBlogs/client/views/view-post.client.view.html');
        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope, $templateCache) {
          $templateCache.put('/modules/travelBlogs/client/views/list-posts.client.view.html', '');

          $state.go('travelBlogs.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('travelBlogs/');
          $rootScope.$digest();

          expect($location.path()).toBe('/travelBlogs');
          expect($state.current.templateUrl).toBe('/modules/travelBlogs/client/views/list-posts.client.view.html');
        }));
      });
    });
  });
}());
