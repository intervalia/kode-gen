angular.module('$(module)')
       .provider('$$(serviceName)', $(serviceName)Provider );

$(serviceName)Provider.$inject = ['$http', '$q'];
function $(serviceName)Provider($http, $q) {
  // Fill this in
}
