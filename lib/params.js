const REQUIRED = '* ';
const prompt = require('./prompt');
const str = require('./str');


function processParams(args, params, cb) {
  let i = 0
  const l = params.length;

  // eslint-disable-next-line complexity
  async function processInput() {
    let hasOptions = false;
    const param = params[i];
    const key = param.key;
    let question = param.desc;
    let def = args[key] || param.default;

    if (param.cond) {
      const p = args[param.cond] || 'none';
      if (p === 'none') {
        i++;
        if (i < l) {
          await processInput();
        }
        else {
          cb(args);
        }
        return;
      }
    }

    if (param.required) {
      question = REQUIRED + question;
    }

    if (param.options && param.options.length > 0) {
      hasOptions = true;
      param.optionVals = param.optionVals || {};
      var options = ' (Options:';
      param.options.forEach(opt => {
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
      def = str.format(String(def), args);
      question += " (default: '"+def+"')";
    }


    question = str.format(question, args); // Convert $(var) to var content

    const text = await prompt(question);
    var val = text || def || param.defaultOption || "";

    if (param.required && (!val || val === "none")) {
      // Stay on this entry
      process.stdout.write("This field is required.\n");
      await processInput();
    }
    else {
      if (hasOptions && !param.optionVals.hasOwnProperty(val)) {
        // Stay on this entry
        process.stdout.write("Please enter one of the valid options.\n");
        await processInput();
      }
      else {
        if (hasOptions && param.optionVals.hasOwnProperty(val)) {
          val = param.optionVals[val];
        }

        args[key] = val;
        i++;
        if (i < l) {
          await processInput();
        }
        else {
          cb(args);
        }
      }
    }
  }

  processInput();
}

module.exports = processParams;
