
//https://thinkster.io/angular-rails#angular-services

//ui-router is newer and provides more flexibility and features than ngRoute. 
angular.module('flapperNews', ['ui.router'])
  .config(['$stateProvider', '$urlRouterProvider', stateConfig])
  .factory('posts', ['$http', postFactory])
  .controller('MainController', ['$scope', 'posts', mainController])
  .controller('PostsController', ['$scope', '$stateParams', 'posts', postsController]);

function postsController($scope, $stateParams, postFactory) {
  // holds all fns and vars that can be used in pages
  $scope.app = {};

  // set the id route parameter to grab the post and associated information
  $scope.app.post = postFactory.posts[$stateParams.id];
  $scope.app.addComment = function (post, body) {
    addComment(post, body);

    //persist changes back out
    $scope.body = body;
  };
}

  function mainController($scope, postFactory) {

    // holds all fns and vars that can be used in pages
    $scope.app = {};
    $scope.app.posts = postFactory.posts;

    $scope.app.addPost = function (title, link, posts) {
      addMockPost(title, link, posts);

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
        // Ensure that anytime our home state is entered, we will automatically 
        // query all posts from our backend before the state actually finishes loading.
        resolve: {
          postPromise: ['posts', function (posts) {
            return posts.getAll();
          }]
        },
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

  function postFactory($http) {
    // What we're doing here is creating a new object that has an array
    // property called 'posts'. We then return that variable so that our
    // o object essentially becomes exposed to any other Angular module 
    // that cares to inject it. You'll note that we could have simply 
    // exported the posts array directly, however, by exporting an object
    // that contains the posts array we can add new objects and methods 
    // to our services in the future.
    var o = { posts: [] };

    // **TODO: work out how to inject this
    var apiBaseUrl = 'http://localhost:3001';

    o.getAll = function () 
    {
      return $http.get(apiBaseUrl + '/posts')
        .success(function (data) 
        {
          angular.copy(data, o.posts);
        });
    };

    return o;
  };


  function addComment(post, body) {
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
    posts.push({ id: id, title: title, link: link, upvotes: 0, comments: [] });

    title = "";
    link = "";
  }

