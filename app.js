/*jshint node:true, strict:false */
'use strict';

var express = require('express');
var compress = require('compression');

var app = express();

app.set('port', (process.env.PORT || 5000));
app.use(compress());
app.use(express.static(__dirname + '/public'));
app.use('/data/blocks.json', express.static(__dirname + '/data/blocks.json'));

app.listen(app.get('port'), function() {
  console.log("✔ Express server listening on port %d in %s mode", app.get('port'), app.settings.env);
})
