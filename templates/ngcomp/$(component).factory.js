angular.module('$(module)')
       .factory('$$(serviceName)', $(serviceName)Factory );

$(serviceName)Factory.$inject = ['$http', '$q'];
function $(serviceName)Factory($http, $q) {
  //*****************************
  // Public interface
  return {
    functionName: functionName
  };

  //*****************************
  // Private functions
  function functionName(params) {

  }
}
