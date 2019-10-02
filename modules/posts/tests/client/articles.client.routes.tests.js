(function () {
  'use strict';

  describe('Posts Route Tests', function () {
    // Initialize global variables
    var $scope,
      PostsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _PostsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      PostsService = _PostsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('posts');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/posts');
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
          liststate = $state.get('posts.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/posts/client/views/list-posts.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          PostsController,
          mockPost;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('posts.view');
          $templateCache.put('/modules/posts/client/views/view-post.client.view.html', '');

          // create mock post
          mockPost = new PostsService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Post about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          PostsController = $controller('PostsController as vm', {
            $scope: $scope,
            postResolve: mockPost
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:postId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.postResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            postId: 1
          })).toEqual('/posts/1');
        }));

        it('should attach an post to the controller scope', function () {
          expect($scope.vm.post._id).toBe(mockPost._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('/modules/posts/client/views/view-post.client.view.html');
        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope, $templateCache) {
          $templateCache.put('/modules/posts/client/views/list-posts.client.view.html', '');

          $state.go('posts.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('posts/');
          $rootScope.$digest();

          expect($location.path()).toBe('/posts');
          expect($state.current.templateUrl).toBe('/modules/posts/client/views/list-posts.client.view.html');
        }));
      });
    });
  });
}());
