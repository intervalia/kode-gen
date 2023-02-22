#!/usr/bin/env node
var version = "1.0.0";
const fs = require("fs");
const path = require("path");
const processArgs = require("./lib/args");
const processParams = require("./lib/params");
const templates = require("./lib/templates");
const exclude = require("./lib/exclude");
const defaultTemplate = process.env.APPGET_TEMPLATE || "";
const cwd = process.cwd();
const defaultArgs = {
  "__dirname": path.basename(cwd)
};
const ARG_PARAMS = {
  "t": "template",
  "o": "output"
};

const templatePath = path.join(__dirname, "templates");
let fileList = fs.readdirSync(templatePath);
const files = {};
console.info("\n\nKODEGEN version "+version+"\n");

fileList.forEach(function(fileName) {
  const p = path.join(templatePath, fileName);
  const stats = fs.statSync(p);
  let key;
  if (stats.isDirectory()) {
    key = fileName;
  }
  else {
    const ext = path.extname(fileName);
    key = path.basename(fileName, ext);
  }
  const item = {
    "name": fileName,
    "isDir": stats.isDirectory(),
    "key": key
  };

  if (!files[key] || (files[key] && !item.isDir)) {
    files[key] = item;
  }
});

let args = processArgs(process.argv.slice(2), ARG_PARAMS, defaultArgs);
const template = args.template || defaultTemplate;
const outputPath = args.output || cwd;
let count = 0;
//console.log("args:", args);
//console.log("templates", JSON.stringify(files));

const tItem = files[template];
if (tItem) {
  let retObj;
  let rootPath;
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
    for (let key in retObj.config.cmdLine) {
      if (!ARG_PARAMS[key]) {
        ARG_PARAMS[key] = retObj.config.cmdLine[key];
      }
    }
    args = processArgs(process.argv.slice(2), ARG_PARAMS, defaultArgs);
  }

  if (retObj.config.params && retObj.config.params.length > 0) {
    processParams(args, retObj.config.params, (args2) => {
      fileList = exclude(retObj.config.exclude, args2, fileList);
      console.log("\nProcessing...");
      count = templates.write(outputPath, fileList, args2);
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
  console.log(`The template '${template}' was not found. Please provide a template using -t:template.`);
  console.log(`Current templates are: ${Object.keys(files).map(a => `"\x1B[33m${a}\x1B[0m"`).join(', ')}`);
  console.log("");
}
