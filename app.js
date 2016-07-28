
//https://thinkster.io/angular-rails#angular-services

angular.module('flapperNews', [])
  .controller('MainController', ['$scope', mainController]);


function mainController($scope) {

  // holds all fns and vars that can be used in pages
  $scope.app = {};

  $scope.app.posts = createMockPosts();
  $scope.app.addPost = addMockPost;
  $scope.app.incrementUpvotes = incrementUpvotes;
}

function factory() {

};

function addPost(title) {

}

function incrementUpvotes(post)
{
  post.upvotes++;
}

function addMockPost (title, link, posts) {
  if (title == "") {title = "default title"; };
  posts.push({ title:title, link: link, upvotes: 0 });

  title = "";
  link = "";
}

function createMockPosts() {
  // dummy posts data
  return [
    { title: 'post 1', link: "www.link1.com", upvotes: 5 },
    { title: 'post 2', link: "www.link2.com", upvotes: 2 },
    { title: 'post 3',  link: "www.link3.com", upvotes: 15 },
    { title: 'post 4', link: "www.link4.com", upvotes: 9 },
    { title: 'post 5', link: "www.link5.com", upvotes: 4 }
  ];
}