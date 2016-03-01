Package.describe({
  name: 'atoy40:polymor',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.registerBuildPlugin({
  name: "polymor",
  use: ['ecmascript', 'templating-tools'],
  sources: ['plugin/polymor.js'],
  npmDependencies: {'vulcanize': '1.14.0', 'temp': '0.8.3'}
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('ecmascript');
  api.use('isobuild:compiler-plugin@1.0.0');
  //api.addFiles('components/bower_components/webcomponentsjs/webcomponents.min.js', 'client');

  api.addFiles([
    "components/meteor-call.html",
    "components/meteor-collection.html",
    "components/meteor-connection.html",
    "components/meteor-query.html",
    "components/meteor-session.html",
    "components/meteor-subscribe.html",
    "components/meteor-user.html",
  ]);
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('atoy40:polymor');
  api.addFiles('polymor-tests.js');
});
