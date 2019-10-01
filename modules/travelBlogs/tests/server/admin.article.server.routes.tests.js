'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  TravelBlog = mongoose.model('TravelBlog'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  travelBlog;

/**
 * TravelBlog routes tests
 */
describe('TravelBlog Admin CRUD tests', function () {
  before(function (done) {
    // Get application
    app = express.init(mongoose.connection.db);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      usernameOrEmail: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      roles: ['user', 'admin'],
      username: credentials.usernameOrEmail,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new travelBlog
    user.save()
      .then(function () {
        travelBlog = {
          title: 'TravelBlog Title',
          content: 'TravelBlog Content'
        };

        done();
      })
      .catch(done);
  });

  it('should be able to save an travelBlog if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new travelBlog
        agent.post('/api/travelBlogs')
          .send(travelBlog)
          .expect(200)
          .end(function (travelBlogSaveErr, travelBlogSaveRes) {
            // Handle travelBlog save error
            if (travelBlogSaveErr) {
              return done(travelBlogSaveErr);
            }

            // Get a list of travelBlogs
            agent.get('/api/travelBlogs')
              .end(function (travelBlogsGetErr, travelBlogsGetRes) {
                // Handle travelBlog save error
                if (travelBlogsGetErr) {
                  return done(travelBlogsGetErr);
                }

                // Get travelBlogs list
                var travelBlogs = travelBlogsGetRes.body;

                // Set assertions
                (travelBlogs[0].user._id).should.equal(userId);
                (travelBlogs[0].title).should.match('TravelBlog Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to update an travelBlog if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new travelBlog
        agent.post('/api/travelBlogs')
          .send(travelBlog)
          .expect(200)
          .end(function (travelBlogSaveErr, travelBlogSaveRes) {
            // Handle travelBlog save error
            if (travelBlogSaveErr) {
              return done(travelBlogSaveErr);
            }

            // Update travelBlog title
            travelBlog.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing travelBlog
            agent.put('/api/travelBlogs/' + travelBlogSaveRes.body._id)
              .send(travelBlog)
              .expect(200)
              .end(function (travelBlogUpdateErr, travelBlogUpdateRes) {
                // Handle travelBlog update error
                if (travelBlogUpdateErr) {
                  return done(travelBlogUpdateErr);
                }

                // Set assertions
                (travelBlogUpdateRes.body._id).should.equal(travelBlogSaveRes.body._id);
                (travelBlogUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an travelBlog if no title is provided', function (done) {
    // Invalidate title field
    travelBlog.title = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new travelBlog
        agent.post('/api/travelBlogs')
          .send(travelBlog)
          .expect(422)
          .end(function (travelBlogSaveErr, travelBlogSaveRes) {
            // Set message assertion
            (travelBlogSaveRes.body.message).should.match('Title cannot be blank');

            // Handle travelBlog save error
            done(travelBlogSaveErr);
          });
      });
  });

  it('should be able to delete an travelBlog if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new travelBlog
        agent.post('/api/travelBlogs')
          .send(travelBlog)
          .expect(200)
          .end(function (travelBlogSaveErr, travelBlogSaveRes) {
            // Handle travelBlog save error
            if (travelBlogSaveErr) {
              return done(travelBlogSaveErr);
            }

            // Delete an existing travelBlog
            agent.delete('/api/travelBlogs/' + travelBlogSaveRes.body._id)
              .send(travelBlog)
              .expect(200)
              .end(function (travelBlogDeleteErr, travelBlogDeleteRes) {
                // Handle travelBlog error error
                if (travelBlogDeleteErr) {
                  return done(travelBlogDeleteErr);
                }

                // Set assertions
                (travelBlogDeleteRes.body._id).should.equal(travelBlogSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a single travelBlog if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new travelBlog model instance
    travelBlog.user = user;
    var travelBlogObj = new TravelBlog(travelBlog);

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new travelBlog
        agent.post('/api/travelBlogs')
          .send(travelBlog)
          .expect(200)
          .end(function (travelBlogSaveErr, travelBlogSaveRes) {
            // Handle travelBlog save error
            if (travelBlogSaveErr) {
              return done(travelBlogSaveErr);
            }

            // Get the travelBlog
            agent.get('/api/travelBlogs/' + travelBlogSaveRes.body._id)
              .expect(200)
              .end(function (travelBlogInfoErr, travelBlogInfoRes) {
                // Handle travelBlog error
                if (travelBlogInfoErr) {
                  return done(travelBlogInfoErr);
                }

                // Set assertions
                (travelBlogInfoRes.body._id).should.equal(travelBlogSaveRes.body._id);
                (travelBlogInfoRes.body.title).should.equal(travelBlog.title);

                // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                (travelBlogInfoRes.body.isCurrentUserOwner).should.equal(true);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  afterEach(function (done) {
    TravelBlog.remove().exec()
      .then(User.remove().exec())
      .then(done())
      .catch(done);
  });
});
