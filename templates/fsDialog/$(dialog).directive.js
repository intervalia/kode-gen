angular.module('$(module)')
       .directive('$(dialog)', $(dialog)Directive );

$(dialog)Directive.$inject = ['$timeout'];
function $(dialog)Directive($timeout) {
  return {
    'restrict': 'E',
    'replace': true,
    'template': getTemplateStr('$(dialog)'),
    'controller': '$(dialog)Controller',
    'scope': {}, // scope must be at least {}
    'link': function ($scope, $element, attrs) {
      $scope.dialogElement = $element;
    }
  };
}
