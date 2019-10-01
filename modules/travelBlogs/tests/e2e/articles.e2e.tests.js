'use strict';

describe('TravelBlogs E2E Tests:', function () {
  describe('Test travelBlogs page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/travelBlogs');
      expect(element.all(by.repeater('travelBlog in travelBlogs')).count()).toEqual(0);
    });
  });
});
