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
