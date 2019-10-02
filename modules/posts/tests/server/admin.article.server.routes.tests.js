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
describe('Post Admin CRUD tests', function () {
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

  it('should be able to save an post if logged in', function (done) {
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

        // Save a new post
        agent.post('/api/posts')
          .send(post)
          .expect(200)
          .end(function (postSaveErr, postSaveRes) {
            // Handle post save error
            if (postSaveErr) {
              return done(postSaveErr);
            }

            // Get a list of posts
            agent.get('/api/posts')
              .end(function (postsGetErr, postsGetRes) {
                // Handle post save error
                if (postsGetErr) {
                  return done(postsGetErr);
                }

                // Get posts list
                var posts = postsGetRes.body;

                // Set assertions
                (posts[0].user._id).should.equal(userId);
                (posts[0].title).should.match('Post Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to update an post if signed in', function (done) {
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

        // Save a new post
        agent.post('/api/posts')
          .send(post)
          .expect(200)
          .end(function (postSaveErr, postSaveRes) {
            // Handle post save error
            if (postSaveErr) {
              return done(postSaveErr);
            }

            // Update post title
            post.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing post
            agent.put('/api/posts/' + postSaveRes.body._id)
              .send(post)
              .expect(200)
              .end(function (postUpdateErr, postUpdateRes) {
                // Handle post update error
                if (postUpdateErr) {
                  return done(postUpdateErr);
                }

                // Set assertions
                (postUpdateRes.body._id).should.equal(postSaveRes.body._id);
                (postUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an post if no title is provided', function (done) {
    // Invalidate title field
    post.title = '';

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

        // Save a new post
        agent.post('/api/posts')
          .send(post)
          .expect(422)
          .end(function (postSaveErr, postSaveRes) {
            // Set message assertion
            (postSaveRes.body.message).should.match('Title cannot be blank');

            // Handle post save error
            done(postSaveErr);
          });
      });
  });

  it('should be able to delete an post if signed in', function (done) {
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

        // Save a new post
        agent.post('/api/posts')
          .send(post)
          .expect(200)
          .end(function (postSaveErr, postSaveRes) {
            // Handle post save error
            if (postSaveErr) {
              return done(postSaveErr);
            }

            // Delete an existing post
            agent.delete('/api/posts/' + postSaveRes.body._id)
              .send(post)
              .expect(200)
              .end(function (postDeleteErr, postDeleteRes) {
                // Handle post error error
                if (postDeleteErr) {
                  return done(postDeleteErr);
                }

                // Set assertions
                (postDeleteRes.body._id).should.equal(postSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a single post if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new post model instance
    post.user = user;
    var postObj = new Post(post);

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

        // Save a new post
        agent.post('/api/posts')
          .send(post)
          .expect(200)
          .end(function (postSaveErr, postSaveRes) {
            // Handle post save error
            if (postSaveErr) {
              return done(postSaveErr);
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

                // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                (postInfoRes.body.isCurrentUserOwner).should.equal(true);

                // Call the assertion callback
                done();
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
