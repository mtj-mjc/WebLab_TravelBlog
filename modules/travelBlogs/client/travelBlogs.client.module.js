(function (app) {
  'use strict';

  app.registerModule('travelBlogs', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('travelBlogs.admin', ['core.admin']);
  app.registerModule('travelBlogs.admin.routes', ['core.admin.routes']);
  app.registerModule('travelBlogs.services');
  app.registerModule('travelBlogs.routes', ['ui.router', 'core.routes', 'travelBlogs.services']);
}(ApplicationConfiguration));
