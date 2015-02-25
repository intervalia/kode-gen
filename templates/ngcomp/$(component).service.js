angular.module('$(module)')
       .service('$$(serviceName)', $(serviceName)Service );

$(serviceName)Service.$inject = ['$http', '$q'];
function $(serviceName)Service($http, $q) {
  // Fill this in
}
