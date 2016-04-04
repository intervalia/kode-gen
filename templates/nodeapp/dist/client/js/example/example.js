// Assembly: example

(function(window,document,undefined) {
/*
 * Included File: example.controller.js
 */
angular.module('test')
       .controller('exampleController', exampleController );

exampleController.$inject = ["$scope", "$example"];
function exampleController($scope, $example) {
  $scope.name = $example.getData("name");
}

/*
 * Included File: example.directive.js
 */
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
/*
 * Included File: example.service.js
 */
angular.module('test')
       .factory('$example', exampleFactory );

exampleFactory.$inject = ['$http', '$q'];
function exampleFactory($http, $q) {
  var data = {
    "name": "sample data",
    "example": true,
    "size": 1
  };

  //*****************************
  // Public interface
  return {
    getData: getData
  };

  //*****************************
  // Private functions
  function getData(param) {
    if (param === undefined) {
      return data;
    }

    return data[param];
  }
}


var templateList = {
 // Included template file: example.html
 "example": '<div class="example"> <h1>{KEY}</h1> <p>{{name}}</p> </div>'
};

function getTemplateStr(key) {
 return templateList[key]||"";
}

function getTemplate(key) {
 var snip = document.createElement("div");
 $(snip).html(getTemplateStr(key));
 return snip;
}

})(window,document);
