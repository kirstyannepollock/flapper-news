
//https://thinkster.io/angular-rails#angular-services

//ui-router is newer and provides more flexibility and features than ngRoute. 
angular.module('flapperNews', ['ui.router'])
  .config(['$stateProvider', '$urlRouterProvider', stateConfig])
  .factory('posts', postFactory)
  .controller('MainController', ['$scope', 'posts', mainController])
  .controller('PostsController', ['$scope', '$stateParams', 'posts', postsController]);

function postsController($scope, $stateParams, postFactory) {
   // holds all fns and vars that can be used in pages
  $scope.app = {};

  // set the id route parameter to grab the post and associated information
  // *** VORSICHT!! Looks like index is zero-based on the front end...
  // So we need to subtract 1
  $scope.app.post = postFactory.posts[$stateParams.id-1];
  $scope.app.addComment = function(post,body) 
  { 
    addComment(post,body);

    //persist changes back out
    $scope.body = body;
  };

function mainController($scope, postFactory) {

  // holds all fns and vars that can be used in pages
  $scope.app = {};

  postFactory.posts = createMockPosts();
  $scope.app.posts = postFactory.posts;

  $scope.app.addPost = function (title,link,posts) 
  {
    addMockPost (title,link,posts);

    //persist changes back out
    $scope.title = title;
    $scope.link = link;
  };

  $scope.app.incrementUpvotes = incrementUpvotes;
}

function stateConfig($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home',
    {
      url: '/home',
      templateUrl: '/home.html',
      controller: 'MainController'
     })
    .state('posts',
    {
      url: '/posts/{id}',
      templateUrl: '/posts.html',
      controller: 'PostsController'
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

function addComment(post,body) {
  if (body === '') { return; }
  post.comments.push({
    body: body,
    author: 'user',
    upvotes: 0
  });

  body = '';
}

function incrementUpvotes(item) {
  item.upvotes++;
}

function addMockPost(title, link, posts) {
  if (title == "") { title = "default title"; };
  var id = posts.length; //temps!!
  posts.push({ id: id, title: title, link: link, upvotes: 0, comments:[] });

  title = "";
  link = "";
}

function createMockPosts() {
  // dummy posts data
  return [
    {
      id: 1, title: 'post 1', link: "www.link1.com", upvotes: 5,
      comments: [
        { author: 'Joe', body: 'Cool post!', upvotes: 0 },
        { author: 'Bob', body: 'Great idea but everything is wrong!', upvotes: 0 }
      ]
    },
    { id:2, title: 'post 2', link: "www.link2.com", upvotes: 2,
      comments: [] },
    { id:3, title: 'post 3', link: "www.link3.com", upvotes: 15,
    comments: [] },
    {
      id:4, title: 'post 4', link: "www.link4.com", upvotes: 9,
      comments: [
        { author: 'Tina', body: 'Yeah, it is like that!', upvotes: 0 },
        { author: 'Alice', body: 'What are you on girl? That is so 1997!', upvotes: 0 }
      ]
    },
    { id: 5, title: 'post 5', link: "www.link5.com", upvotes: 4,
    comments: [] }
  ];
}