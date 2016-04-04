String.prototype.format = function() {
 var text = this;

 var replaceTokens = function(text, key, value) {
  return text.replace(new RegExp('\{' + key + '\}', 'gm'), value);
 };

 var iterateTokens = function(obj, prefix) {
  for(var p in obj) {
   if(typeof(obj[p]) === 'object') {
    iterateTokens(obj[p], prefix + p + '.');
   } else {
    text = replaceTokens(text, prefix + p, obj[p]);
   }
  }
 }

 if ((arguments.length > 0) && (typeof arguments[0] === 'object')) { //process name value pairs
  iterateTokens(arguments[0], '');
 }
 else {
  // replacement by argument indexes
  var i = arguments.length;
  while (i--) {
   text = replaceTokens(text, i, arguments[i]);
  }
 }

 return text;
};

window.__getLangObj = function(locale, langKeys, validLocales, langs) {
 var temp, i, len = langKeys.length, lang = {};
 locale = (typeof(locale) === 'string' ? locale : locale[0]).split('-')[0];
 if (validLocales.indexOf(locale)<0) {
  locale = 'en';
 }
 switch (locale) {
  case 'ke':
  case 'zz':
   for(i = 0; i < len; i++) {
    temp = (locale==='ke'?'['+langKeys[i]+']':'[sub2.'+langKeys[i]+']');
    lang[langKeys[i]] = temp;
   };
   break;
  default:
   for(i = 0; i < len; i++) {
    lang[langKeys[i]] = langs[locale][i];
   };
   break;
 }
 return lang;
}
