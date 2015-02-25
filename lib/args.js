function processArgs(argv, params) {
  var parts, arg, ret = {}, i, l = argv.length;
  params = params || {};

  for( i = 0; i < l; i++ ) {
    arg = argv[i];
    if (arg[0] === "-") {
      // TODO: Only parse two sections
      parts = arg.substr(1).split(":");
      if (parts.length === 1) {
        parts[1] = true;
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