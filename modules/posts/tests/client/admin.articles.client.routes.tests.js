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
          mainstate = $state.get('admin.posts');
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
          liststate = $state.get('admin.posts.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should be not abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/posts/client/views/admin/list-posts.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          PostsAdminController,
          mockPost;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('admin.posts.create');
          $templateCache.put('/modules/posts/client/views/admin/form-post.client.view.html', '');

          // Create mock post
          mockPost = new PostsService();

          // Initialize Controller
          PostsAdminController = $controller('PostsAdminController as vm', {
            $scope: $scope,
            postResolve: mockPost
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.postResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/admin/posts/create');
        }));

        it('should attach an post to the controller scope', function () {
          expect($scope.vm.post._id).toBe(mockPost._id);
          expect($scope.vm.post._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('/modules/posts/client/views/admin/form-post.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          PostsAdminController,
          mockPost;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('admin.posts.edit');
          $templateCache.put('/modules/posts/client/views/admin/form-post.client.view.html', '');

          // Create mock post
          mockPost = new PostsService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Post about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          PostsAdminController = $controller('PostsAdminController as vm', {
            $scope: $scope,
            postResolve: mockPost
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:postId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.postResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            postId: 1
          })).toEqual('/admin/posts/1/edit');
        }));

        it('should attach an post to the controller scope', function () {
          expect($scope.vm.post._id).toBe(mockPost._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('/modules/posts/client/views/admin/form-post.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
