'use strict';


function postsController($log, $scope, postDataService, post) {
  // holds all fns and vars that can be used in pages
  $scope.app = {};

  // use the injected Promise to grab the post and associated information
  $scope.app.post = post;

  // add comment function
  $scope.app.addComment = function (postId, body){
    // on success, update our local data
    addComment(postId, body, postDataService, function (comment) {
      $scope.app.post.comments.push(comment);
      //blank these off so the UI is cleared
      $scope.body = '';
    });
  };

  $scope.app.incrementCommentUpVotes = function (postId, comment) {
    postDataService.upVoteComment(postId, comment);
  };
}


function addComment(postId, body, postDataService, success) {
  if (body === '') { return; }

  var comment = {
    body: body,
    author: 'user',
    upvotes: 0
  };

  postDataService.addComment(postId, comment)
    .success( function (comment) {success(comment); } );
}

module.exports.postsController = postsController;