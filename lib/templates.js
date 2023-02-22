var KONFIG_FILE = "konfig.json";
var fs = require("fs");
var path = require("path");
var AdmZip = require("adm-zip");
var str = require("./str");
var fileReadOptions = {"encoding": "utf-8"};

class fileInfo {
  constructor(rootPath, subPath, fileName) {
    this.sourcePath = rootPath;
    this.subPath = subPath || "";
    this.fileName = fileName;
    //console.log("fileInfo", this);
  }

  load() {
    this.setContent(fs.readFileSync(path.join(this.sourcePath, this.subPath, this.fileName), fileReadOptions));
  }

  setContent(content) {
    this.content = content;
  }

  parse(options) {
    this.newFileName = str.format(this.fileName, options);
    this.newContent = str.format(this.content, options);
  }
}

function parseConfig(content) {
  let config = {};
  try {
    config = JSON.parse(content);
  }
  catch(ex) {
    // Nothing to do here
  }

  return config;
}

function readTemplates(rootPath, subPath) {
  const returnObj = {
    "config": {},
    "fileList": []
  };
  const folders = [];
  subPath = subPath || "";
  const fileList = fs.readdirSync(path.join(rootPath, subPath));
  fileList.forEach(file => {
    if (file === KONFIG_FILE) {
      returnObj.config = parseConfig(fs.readFileSync(path.join(rootPath, subPath, file), fileReadOptions));
    }
    else {
      const stats = fs.statSync(path.join(rootPath, subPath, file));
      if (stats.isDirectory()) {
        folders.push(file);
      }
      else {
        const newFileInfo = new fileInfo(rootPath, subPath, file);
        newFileInfo.load();
        returnObj.fileList.push(newFileInfo);
      }
    }
  });

  folders.forEach(function(folder) {
    const newFileList = readTemplates(rootPath, path.join(subPath, folder)).fileList;
    newFileList.forEach(function(newFile) {
      returnObj.fileList.push(newFile);
    });
  });

  return returnObj;
}

function readFromZip(rootPath, zipFile) {
  const zip = new AdmZip(path.join(rootPath, zipFile));
  const returnObj = {
    "config": {},
    "fileList": []
  };
  zip.getEntries().forEach(item => {
    if (!item.isDirectory) {
      const temp = item.entryName.replace(/\\/g, "/");
      const i = temp.lastIndexOf("/");
      let file;
      let subPath;

      if (i !== -1) {
        subPath = temp.substring(0,i);
        file = temp.substring(i+1);
      }
      else {
        subPath = "";
        file = temp;
      }

      const content = item.getData().toString("utf-8");
      if (file === KONFIG_FILE) {
        returnObj.config = parseConfig(content);
      }
      else {
        const newFileInfo = new fileInfo(rootPath, subPath, file);
        newFileInfo.setContent(content);
        returnObj.fileList.push(newFileInfo);
      }
    }
  });

  return returnObj;
}

function makePathIfNeeded(destPath) {
  if (!fs.existsSync(destPath)) {
    fs.mkdirSync(destPath, { recursive: true });
    /*
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
    */
  }
}

function writeTemplates(destPath, fileList, options) {
  let fileCount = 0;

  makePathIfNeeded(destPath);
  fileList.forEach(file => {
    file.parse(options);
    const tempPath = path.join(destPath, file.subPath);
    makePathIfNeeded(tempPath);
    const destFileName = path.join(destPath, file.subPath, file.newFileName);
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
