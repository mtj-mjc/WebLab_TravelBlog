/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  TravelBlog = require(path.resolve('./modules/travelBlogs/server/controllers/travelBlogs.server.controller')),
  Post = mongoose.model('Post'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

'use strict';

/**
 * Create an post
 */
exports.create = function (req, res) {
  var post = new Post(req.body);
  post.user = req.user;

  post.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(post);
    }
  });
};

/**
 * Show the current post
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var post = req.post ? req.post.toJSON() : {};

  // Add a custom field to the Post, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Post model.
  post.isCurrentUserOwner = !!(req.user && post.user && post.user._id.toString() === req.user._id.toString());

  res.json(post);
};

/**
 * Update an post
 */
exports.update = function (req, res) {
  var post = req.post;
  console.error(post);

  post.title = req.body.title;
  post.location = req.body.location;
  post.dateTime = req.body.dateTime;
  post.imgLink = req.body.imgLink;
  post.description = req.body.description;


  post.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(post);
    }
  });
};

/**
 * Delete an post
 */
exports.delete = function (req, res) {
  var post = req.post;

  post.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(post);
    }
  });
};

/**
 * List of Posts
 */
exports.list = function (req, res) {
  if (req.query.travelBlogId) {
    exports.query(req, res);
  }
  else {
    Post.find().sort('-created').populate('travelBlog').populate('user', 'displayName').exec(function (err, posts) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(posts);
      }
    });
  }
};

/**
 * Post middleware
 */
exports.postByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Post is invalid'
    });
  }

  Post.findById(id).populate('travelBlog').populate('user', 'displayName').exec(function (err, post) {
    if (err) {
      return next(err);
    } else if (!post) {
      return res.status(404).send({
        message: 'No post with that identifier has been found'
      });
    }
    req.post = post;
    next();
  });
};

exports.query = function (req, res) {
  Post.find({ travelBlog: req.query.travelBlogId }).populate('travelBlog').populate('user', 'displayName').exec(function (err, posts) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(posts);
    }
  });
};
