'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke TravelBlogs Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/travelBlogs',
      permissions: '*'
    }, {
      resources: '/api/travelBlogs/:travelBlogId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/travelBlogs',
      permissions: ['get']
    }, {
      resources: '/api/travelBlogs/:travelBlogId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/travelBlogs',
      permissions: ['get']
    }, {
      resources: '/api/travelBlogs/:travelBlogId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If TravelBlogs Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an travelBlog is being processed and the current user created it then allow any manipulation
  if (req.travelBlog && req.user && req.travelBlog.user && req.travelBlog.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
