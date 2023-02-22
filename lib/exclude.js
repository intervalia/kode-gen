//{
//  "key": "serviceType",
//  "value": "none",
//  "files": [ "$(component).factory.js", "$(component).service.js", "$(component).provider.js" ]
//}
/*
function formatFiles(files) {
  var output = "";
  files.forEach(function (oneFile) {
    output += "*  " + JSON.stringify(oneFile) + "\n";
  });
  return output;
}
*/

function excludeFn(excludeList, args, fileList) {
  var filesLeft = fileList;
  //console.log("Before filelist: "+formatFiles(fileList));

  if (excludeList && excludeList.length > 0) {
    //console.log("Trying to exclude "+excludeList.length+" files");

    excludeList.forEach(function(excludeItem) {
      var val = args[excludeItem.key];
      //console.log("arg: "+val+"  -  val: "+excludeItem.value);
      if (val === excludeItem.value) {
        //console.log("Trying to exclude: "+JSON.stringify(excludeItem));
        excludeItem.files.forEach(function(fileName) {
          var i = filesLeft.length-1;
          // TODO: Need to handle globy filenames
          for (; i >= 0; i--) {
            if (filesLeft[i].fileName === fileName || filesLeft[i].subPath === fileName) {
              //console.log("\nRemoving", fileName, filesLeft[i].fileName);
              filesLeft.splice(i, 1);
            }
          }
        });
      }
    });
  }

  //console.log("After filelist: "+formatFiles(filesLeft));
  return filesLeft;
}

module.exports = excludeFn;
