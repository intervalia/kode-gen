#!/usr/bin/env node
(function() {
  var version = "0.2.0";
  var nodeVer = process.versions.node;
  var platform = process.platform;
  var processArgs = require("./lib/args");
  var processParams = require("./lib/params");
  var templates = require("./lib/templates");
  var exclude = require("./lib/exclude");
  var fs = require("fs");
  var path = require("path");
  var AdmZip = require("adm-zip");
  var defaultTemplate = process.env.APPGET_TEMPLATE || "";
  var cwd = process.cwd();
  var defaultArgs = {
    "__dirname": path.basename(cwd)
  };
  var argParams = {
    "t": "template",
    "o": "output"
  };
  var templatePath = path.join(__dirname, "templates");
  var tItem;
  var fileList = fs.readdirSync(templatePath);
  var files = {};
  console.log("\n\nKODEGEN version "+version+"\n");

  fileList.forEach(function(fileName) {
    var stats, item, key, ext, p;

    p = path.join(templatePath, fileName);
    stats = fs.statSync(p);
    if (stats.isDirectory()) {
      key = fileName;
    }
    else {
      ext = path.extname(fileName);
      key = path.basename(fileName, ext);
    }
    item = {
      "name": fileName,
      "isDir": stats.isDirectory(),
      "key": key
    };

    if (!files[key] || (files[key] && !item.isDir)) {
      files[key] = item;
    }
  });

  var args = processArgs(process.argv.slice(2), argParams, defaultArgs);
  var template = args.template || defaultTemplate;
  var outputPath = args.output || cwd;
  var key, indent = 0, title, count = 0;
  //console.log("args:", args);
  //console.log("templates", JSON.stringify(files));

  tItem = files[template];
  if (tItem) {
    var retObj, rootPath;
    if (tItem.isDir) {
      rootPath = path.join(__dirname, "templates", template);
      retObj = templates.read(rootPath, "");
    }
    else {
      rootPath = path.join(__dirname, "templates");
      retObj = templates.readFromZip(rootPath, "test.zip");
    }

    console.log("Creating: " + (retObj.title || template));
    fileList = retObj.fileList;
    if (retObj.config.cmdLine) {
      for (key in retObj.config.cmdLine) {
        if (!argParams[key]) {
          argParams[key] = retObj.config.cmdLine[key];
        }
      }
      args = processArgs(process.argv.slice(2), argParams, defaultArgs);
    }

    if (retObj.config.params && retObj.config.params.length > 0) {
      processParams(args, retObj.config.params, function(args) {
        fileList = exclude(retObj.config.exclude, args, fileList);
        console.log("\nProcessing...");
        count = templates.write(outputPath, fileList, args);
        console.log("\n"+count+" files written.\n");
      });
    }
    else {
      fileList = exclude(retObj.config.exclude, args, fileList);
      console.log("\nProcessing...");
      count = templates.write(outputPath, fileList, args);
      console.log("\n"+count+" files written.\n");
    }
  }
  else {
    console.log("The template '"+template+"' was not found. Please provide a template using -t:template.");
    console.log("Current templates are:", Object.keys(files));
    console.log("");
  }
})();
