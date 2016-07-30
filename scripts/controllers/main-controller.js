'use strict';

//*****************
// My idea right now is that controller know about scope, but not 
// data services or their access functions. It's a foreboding of
// decoupling concerns, I guess.
//*****************

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