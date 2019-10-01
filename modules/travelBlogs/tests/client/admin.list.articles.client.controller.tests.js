(function () {
  'use strict';

  describe('Admin TravelBlogs List Controller Tests', function () {
    // Initialize global variables
    var TravelBlogsAdminListController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      TravelBlogsService,
      mockTravelBlog;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _TravelBlogsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      TravelBlogsService = _TravelBlogsService_;

      // Ignore parent template get on state transitions
      $httpBackend.whenGET('/modules/travelBlogs/client/views/list-travelBlogs.client.view.html').respond(200, '');
      $httpBackend.whenGET('/modules/core/client/views/home.client.view.html').respond(200, '');

      // create mock travelBlog
      mockTravelBlog = new TravelBlogsService({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An TravelBlog about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user', 'admin']
      };

      // Initialize the TravelBlogs List controller.
      TravelBlogsAdminListController = $controller('TravelBlogsAdminListController as vm', {
        $scope: $scope
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('Instantiate', function () {
      var mockTravelBlogList;

      beforeEach(function () {
        mockTravelBlogList = [mockTravelBlog, mockTravelBlog];
      });

      it('should send a GET request and return all travelBlogs', inject(function (TravelBlogsService) {
        // Set POST response
        $httpBackend.expectGET('/api/travelBlogs').respond(mockTravelBlogList);


        $httpBackend.flush();

        // Test form inputs are reset
        expect($scope.vm.travelBlogs.length).toEqual(2);
        expect($scope.vm.travelBlogs[0]).toEqual(mockTravelBlog);
        expect($scope.vm.travelBlogs[1]).toEqual(mockTravelBlog);

      }));
    });
  });
}());
