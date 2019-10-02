'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  TravelBlog = mongoose.model('TravelBlog'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an travelBlog
 */
exports.create = function (req, res) {
  var travelBlog = new TravelBlog(req.body);
  travelBlog.user = req.user;

  travelBlog.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(travelBlog);
    }
  });
};

/**
 * Show the current travelBlog
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var travelBlog = req.travelBlog ? req.travelBlog.toJSON() : {};

  // Add a custom field to the TravelBlog, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the TravelBlog model.
  travelBlog.isCurrentUserOwner = !!(req.user && travelBlog.user && travelBlog.user._id.toString() === req.user._id.toString());

  res.json(travelBlog);
};

/**
 * Update an travelBlog
 */
exports.update = function (req, res) {
  var travelBlog = req.travelBlog;
  console.error(travelBlog);

  travelBlog.title = req.body.title;
  travelBlog.destination = req.body.destination;
  travelBlog.travel_time_start = req.body.travel_time_start;
  travelBlog.travel_time_end = req.body.travel_time_end;
  travelBlog.description = req.body.description;


  travelBlog.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(travelBlog);
    }
  });
};

/**
 * Delete an travelBlog
 */
exports.delete = function (req, res) {
  var travelBlog = req.travelBlog;

  travelBlog.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(travelBlog);
    }
  });
};

/**
 * List of TravelBlogs
 */
exports.list = function (req, res) {
  TravelBlog.find().sort('-created').populate('user', 'displayName').exec(function (err, travelBlogs) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(travelBlogs);
    }
  });
};

/**
 * TravelBlog middleware
 */
exports.travelBlogByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'TravelBlog is invalid'
    });
  }

  TravelBlog.findById(id).populate('user', 'displayName').exec(function (err, travelBlog) {
    if (err) {
      return next(err);
    } else if (!travelBlog) {
      return res.status(404).send({
        message: 'No travelBlog with that identifier has been found'
      });
    }
    req.travelBlog = travelBlog;
    next();
  });
};
