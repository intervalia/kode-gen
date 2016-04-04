angular.module('$(module)')
       .factory('$$(serviceName)', $(serviceName)Factory );

//*****************************
// Singleton Variables

$(serviceName)Factory.$inject = ['$http', '$q'];
function $(serviceName)Factory($http, $q) {
  //*****************************
  // Private Variables

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
