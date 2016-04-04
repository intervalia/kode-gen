/**
 * $(dialog)Controller is used by the fst-send-message directive
 * It also handles all calls to the $$(dialog) service.
 */
angular.module("$(module)")
       .controller('$(dialog)Controller', $(dialog)Controller );

$(dialog)Controller.$inject = [ '$scope', '$$(dialog)', '$fsDialog' ];
function $(dialog)Controller( $scope, $$(dialog), $fsDialog ) {
  // Scope Variables
  $scope.isShowing = false;
  $scope.isWorking = false;
  $scope.errorStr = "";

  // Scope Functions
  $scope.close = close;
  $scope.doSomething = doSomething;

  // Initialization
  $fsDialog.register($$(dialog).DIALOGS.$(dlgType), open, dismiss);

  // Private functions
  function resetData() {
    $scope.errorStr = "";
    // Clean up other scope variables here.
  }

  function open(params) {
    // Do any other setup here.
    // `params` is the value passed into $fsDialog.open();

    $timeout(function() {
      // $scope.isShowing = true; must happen in a $timeout to allow the
      // proper digest cycle to process.
      $scope.isShowing = true;
    });

    return ({
      dialogElement: $scope.dialogElement
    });
  }

  function dismiss() {
    close('dismiss');
  }

  function doSomething() {
    // Call something in a service, if needed
    $$(dialog).sampleFunction().then(
      function (result) {
        close('ok', result);
      },
      function (error) {
        $scope.errorStr = lang.ERROR_STR;
        // Do something about the error`
      }
    );

    // Or call close
    close('ok');
  }

  function close(button, data) {
    $scope.isShowing = false;
    $scope.isWorking = false;

    var response = {
      "button": button
    };
    if (data) {
      response.data = data;
    }

    $fsDialog.close($$(dialog).DIALOGS.$(dlgType), response);

    // This should happen 300sm after the dialog is told to close to
    // allow time for the close animation to complete.
    $timeout(function() {
      resetData();
    }, 300);
  }
}
