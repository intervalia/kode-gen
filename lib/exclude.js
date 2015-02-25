//{
//  "key": "serviceType",
//  "value": "none",
//  "files": [ "$(component).factory.js", "$(component).service.js", "$(component).provider.js" ]
//}
function excludeFn(excludeList, args, fileList) {
  var filesLeft = fileList;

  if (excludeList && excludeList.length > 0) {
    excludeList.forEach(function(excludeItem) {
      var val = args[excludeItem.key];
      if (val === excludeItem.value) {
        excludeItem.files.forEach(function(fileName) {
          var i = filesLeft.length-1;
          // TODO: Need to handle folders and globs
          for (; i >= 0; i--) {
            if (filesLeft[i].fileName === fileName) {
              console.log("\nRemoving", fileName, filesLeft[i].fileName);
              filesLeft.splice(i, 1);
            }
          }
        });
      }
    });
  }

  return filesLeft;
}

module.exports = excludeFn;
