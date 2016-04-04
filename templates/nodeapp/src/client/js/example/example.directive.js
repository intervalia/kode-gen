angular.module('test')
       .directive('kgExample', exampleDirective );

exampleDirective.$inject = [];
function exampleDirective() {
  return {
    'restrict': 'E',
    'replace': true,
    'template': getTemplateStr('example'),
    'controller': 'exampleController',
    'scope': true,
    'link': function ($scope, $element, attrs) {
      
    }
  };
}