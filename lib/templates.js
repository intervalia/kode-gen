var KONFIG_FILE = "konfig.json";
var fs = require("fs");
var path = require("path");
var AdmZip = require("adm-zip");
var str = require("./str");
var fileReadOptions = {"encoding": "utf-8"};

function fileInfo(rootPath, subPath, fileName) {
  this.sourcePath = rootPath;
  this.subPath = subPath || "";
  this.fileName = fileName;
  //console.log("fileInfo", this);
}

fileInfo.prototype.load = function() {
  this.content = fs.readFileSync(path.join(this.sourcePath, this.subPath, this.fileName), fileReadOptions);
};

fileInfo.prototype.setContent = function(content) {
  this.content = content;
};

fileInfo.prototype.parse = function(options) {
  this.newFileName = str.format(this.fileName, options);
  this.newContent = str.format(this.content, options);
};

function parseConfig(content) {
  var config = {};
  try {
    config = JSON.parse(content);
  }
  catch(ex) {}

  return config;
}

function readTemplates(rootPath, subPath) {
  var returnObj = {
    "config": {},
    "fileList": []
  };
  var folders = [];
  var stats, newFileInfo, newFileList;
  subPath = subPath || "";
  var fileList = fs.readdirSync(path.join(rootPath, subPath));
  fileList.forEach(function(file, idx) {
    if (file === KONFIG_FILE) {
      returnObj.config = parseConfig(fs.readFileSync(path.join(rootPath, subPath, file), fileReadOptions));
    }
    else {
      stats = fs.statSync(path.join(rootPath, subPath, file));
      if (stats.isDirectory()) {
        folders.push(file);
      }
      else {
        newFileInfo = new fileInfo(rootPath, subPath, file);
        newFileInfo.load();
        returnObj.fileList.push(newFileInfo);
      }
    }
  });

  folders.forEach(function(folder) {
    newFileList = readTemplates(rootPath, path.join(subPath, folder)).fileList;
    newFileList.forEach(function(newFile) {
      returnObj.fileList.push(newFile);
    });
  });

  return returnObj;
}

function readFromZip(rootPath, zipFile) {
  var file, subPath, i, temp, content, newFileInfo;
  var zip = new AdmZip(path.join(rootPath, zipFile));
  var returnObj = {
    "config": {},
    "fileList": []
  };
  zip.getEntries().forEach(function(item) {
    if (!item.isDirectory) {
      temp = item.entryName.replace(/\\/g, "/");
      i = temp.lastIndexOf("/");
      if (i !== -1) {
        subPath = temp.substring(0,i);
        file = temp.substring(i+1);
      }
      else {
        subPath = "";
        file = temp;
      }

      content = item.getData().toString("utf-8");
      if (file === KONFIG_FILE) {
        returnObj.config = parseConfig(content);
      }
      else {
        newFileInfo = new fileInfo(rootPath, subPath, file);
        newFileInfo.setContent(content);
        returnObj.fileList.push(newFileInfo);
      }
    }
  });

  return returnObj;
}

function makePathIfNeeded(destPath) {
  var parts, tempPath = "";

  if (!fs.existsSync(destPath)) {
    if (destPath[0] === '/' || destPath[0] === '\\') {
      tempPath = "/";
    }
    parts = destPath.split(/[\/\\]/);
    //console.log("Folders:", parts);
    if (parts[0] === '') {
      destPath = "/";
      parts = parts.slice(1);
      //console.log("Folders:", parts);
    }
    parts.forEach(function(part) {
      tempPath = path.join(tempPath, part);
      if (!fs.existsSync(tempPath)) {
        //console.log("Creating folder:", tempPath);
        fs.mkdirSync(tempPath);
      }
    });
  }
}

function writeTemplates(destPath, fileList, options) {
  var fileCount = 0;

  makePathIfNeeded(destPath);
  fileList.forEach(function(file) {
    var destFileName, tempPath;
    file.parse(options);
    tempPath = path.join(destPath, file.subPath);
    makePathIfNeeded(tempPath);
    destFileName = path.join(destPath, file.subPath, file.newFileName);
    //console.log("Writing file:", destFileName);
    fs.writeFileSync(destFileName, file.newContent);
    fileCount++;
  });

  return fileCount;
}

module.exports = {
  "read": readTemplates,
  "readFromZip": readFromZip,
  "write": writeTemplates
};
