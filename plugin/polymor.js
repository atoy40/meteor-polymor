var fs = Npm.require("fs");
var temp = Npm.require("temp");
var Future = Npm.require('fibers/future');
var Vulcanize = Npm.require("vulcanize");

PolymorCompiler = class PolymorCompiler {
  constructor() {}

  processFilesForTarget(inputFiles) {

    if (inputFiles.length < 1)
      return;

    var importsFile = temp.openSync({prefix: 'polymer-imports-', suffix: '.html'});
    console.log(importsFile);

    inputFiles.forEach((inputFile) => {
      console.log(inputFile.getBasename()+" - "+inputFile.getPackageName()+" - "+inputFile.getDirname());
      fs.writeSync(importsFile.fd, inputFile.getContentsAsString());
    });

    fs.closeSync(importsFile.fd);

    var vulcan = new Vulcanize({
      redirects: [ '/bower_components|'+process.env.POLYMER_PATH]
    });

    var future = new Future();

    vulcan.process(importsFile.path, (err, html) => {
      if (err)
        throw err;

      inputFiles[0].addHtml({
        section: 'body',
        data: html,
      });

      inputFiles[0].addHtml({
        section: 'body',
        data: "<polymor-entry></polymor-entry>",
      });

      future.return(true);
    });

    future.wait();
  }
}

Plugin.registerCompiler({
  extensions: ["html"],
  archMatching: 'web',
  isTemplate: true
}, function() {
  return new PolymorCompiler();
});
