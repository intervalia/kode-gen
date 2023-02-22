var objRegEx = /\$\(([^)]+)\)/g;
const formatStr = (str, options) => str.replace(objRegEx, (repl, key) => options[key] || repl);

module.exports = {
  "format": formatStr
};
