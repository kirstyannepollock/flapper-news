
//https://thinkster.io/angular-rails#angular-services

//ui-router is newer and provides more flexibility and features than ngRoute. 
angular.module('flapperNews', ['ui.router'])

  .config(['$stateProvider', '$urlRouterProvider', stateConfig])  
  // inject the root url for the api.
  // ****!!!!! So THIS is how you inject parameters to named functions !!!****
  .constant('apiBaseUrl','http://localhost:3001')
  // create the data provider as 'postDataService' so we can inject it downstream
  .factory('postDataService', ['$http', 'apiBaseUrl', postDataServiceImplementation])
  // MainController depends upon the data service (factory) 
  .controller('MainController', ['$scope', 'postDataService', mainController])
  // PostController depends on the data service (factory) 
  // AND the 'post' Promise set up in the state controller to 
  // load the individual post.
  .controller('PostsController', ['$scope', 'postDataService', 'post', postsController]);


//*****************
// My idea right now is that controller know about scope, but not 
// data services or their access functions. It's a foreboding of
// decoupling concerns, I guess.
//*****************

function postsController($scope, postDataService, post) {
  // holds all fns and vars that can be used in pages
  $scope.app = {};

  // use the injected Promise to grab the post and associated information
  $scope.app.post = post;

  // I find this a tad hinky (the success part), but I'll sort it out
  // when I have more experience
  $scope.app.addComment = function (postId, body) {
    addComment(postId, body, postDataService)
      .success(function (comment) {
        $scope.app.post.comments.push(comment);
      });

    //blank these off so the UI is cleared
    $scope.body = '';
  };
}

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

function stateConfig($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home',
    {
      // Ensure that anytime our home state is entered, we will automatically 
      // query all posts from our backend before the state actually finishes loading.
      // 'postDataService' refers to the postDataService dependency we injected in the 
      // app setup.
      resolve: {
        posts: ['postDataService', function (posts) {
          return posts.getAll();
        }]
      },
      url: '/home',
      templateUrl: '/home.html',
      controller: 'MainController'
    })
    .state('postDataService',
    {
      resolve: {
        // use the id from the url and the posts factory we injected
        // at the start to get the single post by id every time
        // we enter the 'postDataService' state.
        post: ['$stateParams', 'postDataService', function ($stateParams, posts) {
          return posts.get($stateParams.id);
        }]
      },
      url: '/posts/{id}',
      templateUrl: '/posts.html',
      controller: 'PostsController'
    });

  $urlRouterProvider.otherwise('home');
}

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
  createCommentMethods($http,apiBaseUrl,  o);

  return o;
};

function createCommentMethods($http, apiBaseUrl, o) {
  // Add
  o.addComment = function (postId, comment) {
    return $http.post(apiBaseUrl + "/" + postId + "/comments");
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

//**** these deal purely with the service, however it is implemented
function addPost(title, link, postDataService) {

  if (!title || title === '') { return; }

  postDataService.create({
    title: title,
    link: link,
  });
}

function addComment(postId, body, postDataService) {
  if (body === '') { return; }
  postDataService.addComment({
    body: body,
    author: 'user',
    upvotes: 0
  });
}


