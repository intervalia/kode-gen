var objRegEx = /\$\(([^)]+)\)/g;
function formatStr(str, options) {
  return str.replace(objRegEx, function(repl, key) {
    return options[key] || repl;
  });
}

module.exports = {
  "format": formatStr
};
