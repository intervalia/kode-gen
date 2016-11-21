angular.module('$(module)')
       .directive('$(directive)', $(component)Directive );

$(component)Directive.$inject = [];
function $(component)Directive() {
  return {
    'restrict': 'E',
    'replace': true,
    'template': getTemplateStr('$(component)'),
    'controller': '$(component)Controller',
    'scope': {},
    'link': function ($scope, $element, $attrs) {

    }
  };
}
