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
describe('TravelBlog CRUD tests', function () {

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

  it('should not be able to save an travelBlog if logged in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/travelBlogs')
          .send(travelBlog)
          .expect(403)
          .end(function (travelBlogSaveErr, travelBlogSaveRes) {
            // Call the assertion callback
            done(travelBlogSaveErr);
          });

      });
  });

  it('should not be able to save an travelBlog if not logged in', function (done) {
    agent.post('/api/travelBlogs')
      .send(travelBlog)
      .expect(403)
      .end(function (travelBlogSaveErr, travelBlogSaveRes) {
        // Call the assertion callback
        done(travelBlogSaveErr);
      });
  });

  it('should not be able to update an travelBlog if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/travelBlogs')
          .send(travelBlog)
          .expect(403)
          .end(function (travelBlogSaveErr, travelBlogSaveRes) {
            // Call the assertion callback
            done(travelBlogSaveErr);
          });
      });
  });

  it('should be able to get a list of travelBlogs if not signed in', function (done) {
    // Create new travelBlog model instance
    var travelBlogObj = new TravelBlog(travelBlog);

    // Save the travelBlog
    travelBlogObj.save(function () {
      // Request travelBlogs
      agent.get('/api/travelBlogs')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single travelBlog if not signed in', function (done) {
    // Create new travelBlog model instance
    var travelBlogObj = new TravelBlog(travelBlog);

    // Save the travelBlog
    travelBlogObj.save(function () {
      agent.get('/api/travelBlogs/' + travelBlogObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', travelBlog.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single travelBlog with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    agent.get('/api/travelBlogs/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'TravelBlog is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single travelBlog which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent travelBlog
    agent.get('/api/travelBlogs/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No travelBlog with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should not be able to delete an travelBlog if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/travelBlogs')
          .send(travelBlog)
          .expect(403)
          .end(function (travelBlogSaveErr, travelBlogSaveRes) {
            // Call the assertion callback
            done(travelBlogSaveErr);
          });
      });
  });

  it('should not be able to delete an travelBlog if not signed in', function (done) {
    // Set travelBlog user
    travelBlog.user = user;

    // Create new travelBlog model instance
    var travelBlogObj = new TravelBlog(travelBlog);

    // Save the travelBlog
    travelBlogObj.save(function () {
      // Try deleting travelBlog
      agent.delete('/api/travelBlogs/' + travelBlogObj._id)
        .expect(403)
        .end(function (travelBlogDeleteErr, travelBlogDeleteRes) {
          // Set message assertion
          (travelBlogDeleteRes.body.message).should.match('User is not authorized');

          // Handle travelBlog error error
          done(travelBlogDeleteErr);
        });

    });
  });

  it('should be able to get a single travelBlog that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      usernameOrEmail: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.usernameOrEmail,
      password: _creds.password,
      provider: 'local',
      roles: ['admin']
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new travelBlog
          agent.post('/api/travelBlogs')
            .send(travelBlog)
            .expect(200)
            .end(function (travelBlogSaveErr, travelBlogSaveRes) {
              // Handle travelBlog save error
              if (travelBlogSaveErr) {
                return done(travelBlogSaveErr);
              }

              // Set assertions on new travelBlog
              (travelBlogSaveRes.body.title).should.equal(travelBlog.title);
              should.exist(travelBlogSaveRes.body.user);
              should.equal(travelBlogSaveRes.body.user._id, orphanId);

              // force the travelBlog to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
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
                        should.equal(travelBlogInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single travelBlog if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new travelBlog model instance
    var travelBlogObj = new TravelBlog(travelBlog);

    // Save the travelBlog
    travelBlogObj.save(function (err) {
      if (err) {
        return done(err);
      }
      agent.get('/api/travelBlogs/' + travelBlogObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', travelBlog.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single travelBlog, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create temporary user creds
    var _creds = {
      usernameOrEmail: 'travelBlogowner',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create user that will create the TravelBlog
    var _travelBlogOwner = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'temp@test.com',
      username: _creds.usernameOrEmail,
      password: _creds.password,
      provider: 'local',
      roles: ['admin', 'user']
    });

    _travelBlogOwner.save(function (err, _user) {
      // Handle save error
      if (err) {
        return done(err);
      }

      // Sign in with the user that will create the TravelBlog
      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var userId = _user._id;

          // Save a new travelBlog
          agent.post('/api/travelBlogs')
            .send(travelBlog)
            .expect(200)
            .end(function (travelBlogSaveErr, travelBlogSaveRes) {
              // Handle travelBlog save error
              if (travelBlogSaveErr) {
                return done(travelBlogSaveErr);
              }

              // Set assertions on new travelBlog
              (travelBlogSaveRes.body.title).should.equal(travelBlog.title);
              should.exist(travelBlogSaveRes.body.user);
              should.equal(travelBlogSaveRes.body.user._id, userId);

              // now signin with the test suite user
              agent.post('/api/auth/signin')
                .send(credentials)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
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
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (travelBlogInfoRes.body.isCurrentUserOwner).should.equal(false);

                      // Call the assertion callback
                      done();
                    });
                });
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
