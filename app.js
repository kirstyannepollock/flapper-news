
//https://thinkster.io/angular-rails#angular-services

angular.module('flapperNews', [])
  .controller('MainController', ['$scope', mainController]);


function mainController($scope) {

  // holds all fns and vars that can be used in pages
  $scope.app = {};

  $scope.app.posts = createMockPosts();
  $scope.app.addPost = addMockPost;
}

function factory() {

};

function addPost(title) {

}


function addMockPost (title, posts) {
  if (title == "") {title = "default title"; };
  posts.push({ title:title, upvotes: 0 });
  title = '';
}

function createMockPosts() {
  // dummy posts data
  return [
    { title: 'post 1', upvotes: 5 },
    { title: 'post 2', upvotes: 2 },
    { title: 'post 3', upvotes: 15 },
    { title: 'post 4', upvotes: 9 },
    { title: 'post 5', upvotes: 4 }
  ];
}