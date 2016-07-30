'use strict';
//**********************************************************
// Controller knows about $scope and the data service and
// functions as the link between them.
//**********************************************************

function mainController($scope, postDataService) {

  // holds all fns and vars that can be used in pages
  $scope.app = {};
  $scope.app.posts = postDataService.posts;

  $scope.app.addPost = function (title, link) {
    addPost(title, link, postDataService);

    // blank these off so the UI is cleared
    $scope.title = '';
    $scope.link = '';
  };

  $scope.app.incrementPostUpVotes = function (post) {
    postDataService.upVote(post);
  };

}

function addPost(title, link, postDataService) {

  if (!title || title === '') { return; }

  postDataService.create({
    title: title,
    link: link,
  });
}

module.exports.mainController = mainController;