'use strict';

//**********************************************************
// Data service purely deals with data and is self-contained.
// It doesn't know about scope, not should it. Purely makes
// REST calls, and exposes simple friendly methods to enable
// controllers to use them.
//**********************************************************

function postDataServiceImplementation($http, apiBaseUrl) {
  // What we're doing here is creating a new object that has an array
  // property called 'posts'. We then return that variable so that our
  // o object essentially becomes exposed to any other Angular module 
  // that cares to inject it. You'll note that we could have simply 
  // exported the posts array directly, however, by exporting an object
  // that contains the posts array we can add new objects and methods 
  // to our services.
  var o = { posts: [] };

  createPostsMethods($http, apiBaseUrl, o);
  createCommentMethods($http, apiBaseUrl, o);

  return o;
};

function createCommentMethods($http, apiBaseUrl, o) {
  // Add
  o.addComment = function (postId, comment) {
    return $http.post(apiBaseUrl + '/posts/' + postId + "/comments", comment);
  };

  // Upvote (Comment)
  o.upVoteComment = function (postId, comment) {
    return $http.post(apiBaseUrl + '/posts/' + postId + "/comments/" + comment._id + '/vote-up')
      .success(function (data) {
        comment.upvotes += 1;
      });
  };
}

function createPostsMethods($http, apiBaseUrl, o) {
  // Get All Posts
  o.getAll = function () {
    return $http.get(apiBaseUrl + '/posts')
      .success(function (data) {
        angular.copy(data, o.posts);
      });
  };

  // Get single post
  o.get = function (id) {
    return $http.get(apiBaseUrl + '/posts/' + id)
      //.then because we are going to do a Promise
      .then(function (response) {
        return response.data;
      });
  };

  // Create
  o.create = function (post) {
    return $http.post(apiBaseUrl + '/posts', post)
      .success(function (data) {
        // again, saves a fetch, same issues as below
        o.posts.push(data);
      });
  };

  // Upvote (Post)
  o.upVote = function (post) {
    // The auto MongoDb property is "_id" not "id"
    // up-vote/down-vote is a POST rather than a PUT (JSON)
    return $http.post(apiBaseUrl + '/posts/' + post._id + '/vote-up')
      .success(function (data) {
        // this is duplicative, but saves a db fetch, I suppose.
        // not very multi-user scalable - at least not with consistency..
        post.upvotes += 1;
      });
  };

}

module.exports.postDataServiceImplementation = postDataServiceImplementation;
