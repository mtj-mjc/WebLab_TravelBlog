'use strict';

/**
 * Module dependencies
 */
var travelBlogsPolicy = require('../policies/travelBlogs.server.policy'),
  travelBlogs = require('../controllers/travelBlogs.server.controller');

module.exports = function (app) {
  // TravelBlogs collection routes
  app.route('/api/travelBlogs').all(travelBlogsPolicy.isAllowed)
    .get(travelBlogs.list)
    .post(travelBlogs.create);

  // Single travelBlog routes
  app.route('/api/travelBlogs/:travelBlogId').all(travelBlogsPolicy.isAllowed)
    .get(travelBlogs.read)
    .put(travelBlogs.update)
    .delete(travelBlogs.delete);

  // Finish by binding the travelBlog middleware
  app.param('travelBlogId', travelBlogs.travelBlogByID);
};
