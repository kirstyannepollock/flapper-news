
//https://thinkster.io/angular-rails#angular-services

//ui-router is newer and provides more flexibility and features than ngRoute. 
angular.module('flapperNews', ['ui.router'])
  .factory('posts', postFactory)
  .controller('MainController', ['$scope', 'posts', mainController]);


function mainController($scope, postFactory) {

  // holds all fns and vars that can be used in pages
  $scope.app = {};

  $scope.app.posts = postFactory.posts; 
  $scope.app.posts = createMockPosts();
  $scope.app.addPost = addMockPost;
  $scope.app.incrementUpvotes = incrementUpvotes;
}

function stateConfig($stateProvider, $urlRouterProvider){
  
  $stateProvider
    .state('home', 
      {
        url: '/home',
        templateUrl: '/home.html',
        controller: 'MainController'
      });

  $urlRouterProvider.otherwise('home');
}

function postFactory() {
// What we're doing here is creating a new object that has an array
// property called 'posts'. We then return that variable so that our
// o object essentially becomes exposed to any other Angular module 
// that cares to inject it. You'll note that we could have simply 
// exported the posts array directly, however, by exporting an object
// that contains the posts array we can add new objects and methods 
// to our services in the future.
  var o = { posts: [] };
  return o;
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