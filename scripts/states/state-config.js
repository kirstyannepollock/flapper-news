'use strict';
//**********************************************************
// We are using ui-router. This state machine controls
// which views are loaded based upon the app state
//**********************************************************#
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
      templateUrl: '/templates/home.html',
      controller: 'MainController'
    })
    .state('posts',
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
      templateUrl: '/templates/posts.html',
      controller: 'PostsController'
    });

  $urlRouterProvider.otherwise('home');
}

module.exports.stateConfig = stateConfig;