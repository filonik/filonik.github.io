
function getOrDefault(obj, key, d) {
  return key in obj? obj[key]: d;
}

angular.module('myApp', ['medley', 'treeControl', 'reusableThings',]).controller('MainCtrl', function($scope, $attrs, $http) { 
  $scope.dataFile = undefined;
  $scope.dataFileName = '';
  
  $scope.dataModel = undefined;
  
  $scope.loadFromFile = function(file) {
    var response = JSON.parse(file.trim());
    
    var model = medley.load(response);
    
    $scope.$apply(function() {
      $scope.dataModel = model;
    });
  }
  
  $scope.loadFromUrl = function(url) {
    function handleSuccess(response) {
      var model = medley.load(response.data);
      
      //$scope.$apply(function() {
      $scope.dataModel = model;
      //});
      
      return response.data;
    }
    
    function handleError(response) {
      console.log(response);
    }
    
    $http.get(url).then(handleSuccess).catch(handleError);
  }
  
  //$scope.loadFromUrl("data.json");
});