

angular.module('myApp', ['reusableThings',]).controller('MainCtrl', function($scope, $attrs, $http) { 
    $scope.image = undefined;
    $scope.imageFileName = '';
    $scope.message = "Hello Angular!";
});