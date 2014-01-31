angular.module('home', [], ['$routeProvider', function($routeProvider){

  $routeProvider.when('/home', {
    templateUrl:'home/list.tpl.html',
    controller:'ExhibitionListCtrl',
    resolve:{
      projects:['Projects', function(Projects){
        return Projects.all();
      }]
    }
  });
}]);

angular.module('home').controller('ExhibitionListCtrl', ['$scope', 'projects', function($scope, projects){
  $scope.projects = projects;
}]);