'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Post = mongoose.model('Post'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  post;

/**
 * Post routes tests
 */
describe('Post CRUD tests', function () {

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

    // Save a user to the test db and create new post
    user.save()
      .then(function () {
        post = {
          title: 'Post Title',
          content: 'Post Content'
        };

        done();
      })
      .catch(done);
  });

  it('should not be able to save an post if logged in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/posts')
          .send(post)
          .expect(403)
          .end(function (postSaveErr, postSaveRes) {
            // Call the assertion callback
            done(postSaveErr);
          });

      });
  });

  it('should not be able to save an post if not logged in', function (done) {
    agent.post('/api/posts')
      .send(post)
      .expect(403)
      .end(function (postSaveErr, postSaveRes) {
        // Call the assertion callback
        done(postSaveErr);
      });
  });

  it('should not be able to update an post if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/posts')
          .send(post)
          .expect(403)
          .end(function (postSaveErr, postSaveRes) {
            // Call the assertion callback
            done(postSaveErr);
          });
      });
  });

  it('should be able to get a list of posts if not signed in', function (done) {
    // Create new post model instance
    var postObj = new Post(post);

    // Save the post
    postObj.save(function () {
      // Request posts
      agent.get('/api/posts')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single post if not signed in', function (done) {
    // Create new post model instance
    var postObj = new Post(post);

    // Save the post
    postObj.save(function () {
      agent.get('/api/posts/' + postObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', post.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single post with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    agent.get('/api/posts/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Post is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single post which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent post
    agent.get('/api/posts/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No post with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should not be able to delete an post if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/posts')
          .send(post)
          .expect(403)
          .end(function (postSaveErr, postSaveRes) {
            // Call the assertion callback
            done(postSaveErr);
          });
      });
  });

  it('should not be able to delete an post if not signed in', function (done) {
    // Set post user
    post.user = user;

    // Create new post model instance
    var postObj = new Post(post);

    // Save the post
    postObj.save(function () {
      // Try deleting post
      agent.delete('/api/posts/' + postObj._id)
        .expect(403)
        .end(function (postDeleteErr, postDeleteRes) {
          // Set message assertion
          (postDeleteRes.body.message).should.match('User is not authorized');

          // Handle post error error
          done(postDeleteErr);
        });

    });
  });

  it('should be able to get a single post that has an orphaned user reference', function (done) {
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

          // Save a new post
          agent.post('/api/posts')
            .send(post)
            .expect(200)
            .end(function (postSaveErr, postSaveRes) {
              // Handle post save error
              if (postSaveErr) {
                return done(postSaveErr);
              }

              // Set assertions on new post
              (postSaveRes.body.title).should.equal(post.title);
              should.exist(postSaveRes.body.user);
              should.equal(postSaveRes.body.user._id, orphanId);

              // force the post to have an orphaned user reference
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

                    // Get the post
                    agent.get('/api/posts/' + postSaveRes.body._id)
                      .expect(200)
                      .end(function (postInfoErr, postInfoRes) {
                        // Handle post error
                        if (postInfoErr) {
                          return done(postInfoErr);
                        }

                        // Set assertions
                        (postInfoRes.body._id).should.equal(postSaveRes.body._id);
                        (postInfoRes.body.title).should.equal(post.title);
                        should.equal(postInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single post if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new post model instance
    var postObj = new Post(post);

    // Save the post
    postObj.save(function (err) {
      if (err) {
        return done(err);
      }
      agent.get('/api/posts/' + postObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', post.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single post, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create temporary user creds
    var _creds = {
      usernameOrEmail: 'postowner',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create user that will create the Post
    var _postOwner = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'temp@test.com',
      username: _creds.usernameOrEmail,
      password: _creds.password,
      provider: 'local',
      roles: ['admin', 'user']
    });

    _postOwner.save(function (err, _user) {
      // Handle save error
      if (err) {
        return done(err);
      }

      // Sign in with the user that will create the Post
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

          // Save a new post
          agent.post('/api/posts')
            .send(post)
            .expect(200)
            .end(function (postSaveErr, postSaveRes) {
              // Handle post save error
              if (postSaveErr) {
                return done(postSaveErr);
              }

              // Set assertions on new post
              (postSaveRes.body.title).should.equal(post.title);
              should.exist(postSaveRes.body.user);
              should.equal(postSaveRes.body.user._id, userId);

              // now signin with the test suite user
              agent.post('/api/auth/signin')
                .send(credentials)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the post
                  agent.get('/api/posts/' + postSaveRes.body._id)
                    .expect(200)
                    .end(function (postInfoErr, postInfoRes) {
                      // Handle post error
                      if (postInfoErr) {
                        return done(postInfoErr);
                      }

                      // Set assertions
                      (postInfoRes.body._id).should.equal(postSaveRes.body._id);
                      (postInfoRes.body.title).should.equal(post.title);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (postInfoRes.body.isCurrentUserOwner).should.equal(false);

                      // Call the assertion callback
                      done();
                    });
                });
            });
        });
    });
  });

  afterEach(function (done) {
    Post.remove().exec()
      .then(User.remove().exec())
      .then(done())
      .catch(done);
  });
});
