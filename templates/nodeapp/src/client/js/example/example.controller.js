angular.module('test')
       .controller('exampleController', exampleController );

exampleController.$inject = ["$scope", "$example"];
function exampleController($scope, $example) {
  $scope.name = $example.getData("name");
}
