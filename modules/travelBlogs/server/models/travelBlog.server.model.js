'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  path = require('path'),
  config = require(path.resolve('./config/config')),
  chalk = require('chalk');

/**
 * TravelBlog Schema
 */
var TravelBlogSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
  },
  destination: {
    type: String,
    default: '',
    trim: true,
    required: 'Destination cannot be blank'
  },
  travel_time_start: {
    type: Date,
    default: '',
    trim: true,
    required: 'Start Date cannot be blank'
  },
  travel_time_end: {
    type: Date,
    default: '',
    trim: true,
    required: 'End Date cannot be blank'
  },
  description: {
    type: String,
    default: '',
    trim: true,
    required: 'Description cannot be blank'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

TravelBlogSchema.statics.seed = seed;

mongoose.model('TravelBlog', TravelBlogSchema);

/**
* Seeds the User collection with document (TravelBlog)
* and provided options.
*/
function seed(doc, options) {
  var TravelBlog = mongoose.model('TravelBlog');

  return new Promise(function (resolve, reject) {

    skipDocument()
      .then(findAdminUser)
      .then(add)
      .then(function (response) {
        return resolve(response);
      })
      .catch(function (err) {
        return reject(err);
      });

    function findAdminUser(skip) {
      var User = mongoose.model('User');

      return new Promise(function (resolve, reject) {
        if (skip) {
          return resolve(true);
        }

        User
          .findOne({
            roles: { $in: ['admin'] }
          })
          .exec(function (err, admin) {
            if (err) {
              return reject(err);
            }

            doc.user = admin;

            return resolve();
          });
      });
    }

    function skipDocument() {
      return new Promise(function (resolve, reject) {
        TravelBlog
          .findOne({
            title: doc.title
          })
          .exec(function (err, existing) {
            if (err) {
              return reject(err);
            }

            if (!existing) {
              return resolve(false);
            }

            if (existing && !options.overwrite) {
              return resolve(true);
            }

            // Remove TravelBlog (overwrite)

            existing.remove(function (err) {
              if (err) {
                return reject(err);
              }

              return resolve(false);
            });
          });
      });
    }

    function add(skip) {
      return new Promise(function (resolve, reject) {
        if (skip) {
          return resolve({
            message: chalk.yellow('Database Seeding: TravelBlog\t' + doc.title + ' skipped')
          });
        }

        var travelBlog = new TravelBlog(doc);

        travelBlog.save(function (err) {
          if (err) {
            return reject(err);
          }

          return resolve({
            message: 'Database Seeding: TravelBlog\t' + travelBlog.title + ' added'
          });
        });
      });
    }
  });
}
