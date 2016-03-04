var fs = Npm.require("fs");
var url = Npm.require("url");
var path = Npm.require("path");

if (process.env.NODE_ENV === "development" && process.env.POLYMER_PATH) {
  WebApp.connectHandlers.use("/bower_components", function(req, res, next) {
    var fileurl = url.parse(req.url);

    fs.readFile(process.env.POLYMER_PATH+fileurl.pathname, {encoding: "utf-8"}, function(err, data) {
      if (err) {
        res.writeHead(404);
        res.write("file not found in POLYMER_HOME ("+process.env.POLYMER_PATH+")\n");
        res.write(err.toString());
        return res.end();
      }
      var ext = path.extname(fileurl.pathname).slice(1);
      res.writeHead(200, {'Content-Type': ext == 'js' ? 'application/javascript' : 'text/' + ext});
      res.write(data);
      res.end();
    });
  });
}
