
// //https://thinkster.io/angular-rails#angular-services
// //https://omarfouad.com/

require('../vendor/angular.min');
require('../vendor/angular-ui-router');

var mainController = require("./controllers/main-controller").mainController;
var postsController = require("./controllers/posts-controller").postsController;
var postDataServiceImplementation = require("./services/posts-data-service").postDataServiceImplementation;
var stateConfig = require("./states/state-config").stateConfig;

//ui-router is newer and provides more flexibility and features than ngRoute. 
//**** VORSICHT!!!! Note the dependency NAME is 'ui.router' with a DOT not a DASH !!!
angular.module('flapperNews', ['ui.router'])

  .config(['$stateProvider', '$urlRouterProvider', stateConfig])
  // inject the root url for the api.
  // ****!!!!! So THIS is how you inject parameters to named functions !!!****
  .constant('apiBaseUrl', 'http://localhost:3001/api')
  // create the data provider as 'postDataService' so we can inject it downstream
  .factory('postDataService', ['$http', 'apiBaseUrl', postDataServiceImplementation])
  // MainController depends upon the data service (factory) 
  .controller('MainController', ['$scope', 'postDataService', mainController])
  // PostController depends on the data service (factory) 
  // AND the 'post' Promise set up in the state controller to 
  // load the individual post.
  .controller('PostsController', ['$log', '$scope', 'postDataService', 'post', postsController]);


