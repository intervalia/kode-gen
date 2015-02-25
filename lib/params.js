var prompt = require("./prompt");
var str = require("./str");


function processParams(args, params, cb) {
  var i = 0, l = params.length;
  function processInput() {
    var hasOptions = false;
    var param = params[i];
    var key = param.key;
    var question = param.desc;
    var def = args[key] || param.default;
    var p;

    if (param.cond) {
      p = args[param.cond] || "none";
      if (p === "none") {
        i++;
        if (i < l) {
          processInput();
        }
        else {
          cb(args);
        }
        return;
      }
    }

    if (param.required) {
      question = "*" + question;
    }
    if (param.options && param.options.length > 0) {
      hasOptions = true;
      param.optionVals = param.optionVals || {};
      var options = " (Options:";
      param.options.forEach(function(opt, idx) {
        if (opt !== null) {
          if (!param.optionVals.hasOwnProperty(opt)) {
            param.optionVals[opt] = opt;
          }

          if (param.defaultOption === opt) {
            options += " ["+opt+"],";
          }
          else {
            options += " "+opt+",";
          }
        }
      });
      options = options.slice(0,-1)+")";
      question += options;
    }
    else if (def) {
      def = str.format(def, args);
      question += " (default: '"+def+"')";
    }


    question = str.format(question, args); // Convert $(var) to var content

    prompt(question, function(text) {
      var val = text.trim() || def || param.defaultOption || "";

      if (param.required && (!val || val === "none")) {
        // Stay on this entry
        process.stdout.write("This field is required.\n");
        processInput();
      }
      else {
        if (hasOptions && !param.optionVals.hasOwnProperty(val)) {
          // Stay on this entry
          process.stdout.write("Please enter one of the valid options.\n");
          processInput();
        }
        else {
          if (hasOptions && param.optionVals.hasOwnProperty(val)) {
            val = param.optionVals[val];
          }

          args[key] = val;
          i++;
          if (i < l) {
            processInput();
          }
          else {
            cb(args);
          }
        }
      }
    });
  }

  processInput();
}

module.exports = processParams;
