
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

  $scope.app.addPost = function (title, link) {
    addPost(title, link, postFactory);

    // blank these off so the UI is cleared
    $scope.title = '';
    $scope.link = '';
  };

  $scope.app.incrementPostUpVotes = function (post) {
    postFactory.upVote(post);
  };

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

  // Get All
  o.getAll = function () {
    return $http.get(apiBaseUrl + '/posts')
      .success(function (data) {
        angular.copy(data, o.posts);
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
    // For some reason up-vote/down-vote is a POST rather than a PUT
    return $http.post(apiBaseUrl + '/posts/' + post._id + '/vote-up')
      .success(function (data) {
        // this is duplicative, but saves a db fetch, I suppose.
        // not very multi-user scalable - at least not with consistency..
        post.upvotes += 1;
      });
  };

  return o;
};

function addPost(title, link, postFactory) {

  if (!title || title === '') { return; }

  postFactory.create({
    title: title,
    link: link,
  });
}

function addComment(post, body) {
  if (body === '') { return; }
  post.comments.push({
    body: body,
    author: 'user',
    upvotes: 0
  });

  body = '';
}


