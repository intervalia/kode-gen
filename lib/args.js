function processArgs(argv, params, defaultArgs) {
  var parts, arg, ret = defaultArgs || {}, i, l = argv.length;
  params = params || {};

  for( i = 0; i < l; i++ ) {
    arg = argv[i];
    if (arg[0] === "-") {
      // TODO: Only parse two sections
      parts = arg.substr(1).split(":");
      if (parts.length === 1 || parts[1] === "true") {
        parts[1] = true;
      }
      else if (parts[1] === "false") {
        parts[1] = false;
      }

      if (params[parts[0]]) {
        ret[params[parts[0]]] = parts[1];
      }
      else {
        ret[parts[0]] = parts[1];
      }
    }
    else {
      ret[arg] = true;
    }
  }
  return ret;
}

module.exports = processArgs;
