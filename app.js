
//https://thinkster.io/angular-rails#angular-services

angular.module('flapperNews', [])
  .controller('MainCtrl', ['$scope', mainController]);


function mainController($scope)
{
  createMockPosts($scope);
}

function factory()
{

};



function createMockPosts($scope)
{
  // dummy posts data
  $scope.posts = [
    'post 1',
    'post 2',
    'post 3',
    'post 4',
    'post 5'
  ];
}