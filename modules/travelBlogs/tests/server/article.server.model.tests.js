'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  TravelBlog = mongoose.model('TravelBlog');

/**
 * Globals
 */
var user,
  travelBlog;

/**
 * Unit tests
 */
describe('TravelBlog Model Unit Tests:', function () {

  beforeEach(function (done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3',
      provider: 'local'
    });

    user.save()
      .then(function () {
        travelBlog = new TravelBlog({
          title: 'TravelBlog Title',
          content: 'TravelBlog Content',
          user: user
        });

        done();
      })
      .catch(done);
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(10000);
      travelBlog.save(function (err) {
        should.not.exist(err);
        return done();
      });
    });

    it('should be able to show an error when try to save without title', function (done) {
      travelBlog.title = '';

      travelBlog.save(function (err) {
        should.exist(err);
        return done();
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
