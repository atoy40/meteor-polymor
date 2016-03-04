var fs = Npm.require("fs");
var temp = Npm.require("temp");
var crypto = Npm.require('crypto');
var Future = Npm.require('fibers/future');
var Vulcanize = Npm.require("vulcanize");

PolymorCompiler = class PolymorCompiler {
  constructor() {}

  genFilePath(file) {
    return  file.getPathInPackage()+"?"+file.getSourceHash();
  }

  genPackagePath(file) {
    if (file.getPackageName() === null) {
      return this.genFilePath(file);
    } else {
      return "packages/"+file.getPackageName().replace(/\:/g, "_")+"/"+this.genFilePath(file);
    }
  }

  processFilesForTarget(inputFiles, options) {

    if (inputFiles.length < 1)
      return;

    // in this mode (no vulcanization) the /bower_components path is webhandled by hander.js
    if (!process.env.VULCANIZE) {
      // add polyfill and polymer
      inputFiles[0].addHtml({
        section: 'head',
        data: '<script src="/bower_components/webcomponentsjs/webcomponents.min.js"></script>',
      });
      inputFiles[0].addHtml({
        section: 'head',
        data: '<link rel="import" href="/bower_components/polymer/polymer.html">',
      });

      // define assets and import them.
      inputFiles.forEach((inputFile) => {
        inputFile.addAsset({
          path: this.genFilePath(inputFile),
          data: inputFile.getContentsAsString()
        });
        inputFile.addHtml({
          section: 'head',
          data: '<link rel="import" href="'+this.genPackagePath(inputFile)+'">',
        });
        //fs.writeSync(importsFile.fd, inputFile.getContentsAsString());
      });

      // instanciate the main element
      inputFiles[inputFiles.length-1].addHtml({
        section: 'body',
        data: "<polymor-entry></polymor-entry>",
      });

      return;
    }

    var importsFile = temp.openSync({prefix: 'polymer-imports-', suffix: '.html'});

    fs.writeSync(importsFile.fd, '<link rel="import" href="/bower_components/polymer/polymer.html">');
    inputFiles.forEach((inputFile) => {
      fs.writeSync(importsFile.fd, inputFile.getContentsAsString());
    });
    fs.closeSync(importsFile.fd);

    var vulcan = new Vulcanize({
      implicitStrip: true,
      inlineScripts: true,
      inlineCss: true,
      stripComments: true,
      redirects: [ '/bower_components|'+process.env.POLYMER_PATH]
    });

    var future = new Future();

    var lastfile = inputFiles[inputFiles.length-1];

    vulcan.process(importsFile.path, (err, html) => {
      if (err) {
        future.return(false);
        console.log(err);
        throw err;
      }

      lastfile.addJavaScript({
        path: "webcomponents.js",
        data: fs.readFileSync(process.env.POLYMER_PATH+"/webcomponentsjs/webcomponents.min.js", { encoding: "utf8" }),
        bare: 1
      });

      lastfile.addAsset({path: "vulcanized.html", data: html});
      lastfile.addHtml({section: 'head', data: '<link rel="import" href="vulcanized.html">' });

      lastfile.addHtml({
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
