/**
 * $$(dialog) service
 *
 * Code that handles the send message operation.
 */
angular.module('$(module)')
       .factory('$$(dialog)', $(dialog)Service);

$(dialog)Service.$inject = ['$http', '$q', '$fsDialog'];
function $(dialog)Service($http, $q, $fsDialog) {
  init();

  // Return the public interface of the service
  return {
    "DIALOGS": {
      "$(dlgType)": "$(key)"
    },
    "sampleFunction": sampleFunction
  };

  // Private functions
  function init() {
    $fsDialog.createDialogDom(".$(className)", "<$(directive)></$(directive)>");
  }

  function sampleFunction() {
    var defer = $q.defer();

    // Simulate an ASYC operation
    $timeout(function() {
      var results = {
        "name": "Someone",
        "age": 32,
        "gender": "UNKNOWN"
      };

      defer.resolve(results);
    }, 2000);

    return defer.promise;
  }
}
