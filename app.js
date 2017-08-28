const express = require('express');
const app = express();
const mustache = require('mustache-express');
const parser = require('body-parser');
const session = require('express-session');
const fs = require('fs');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const mongoURL = 'mongodb://localhost:27017/newdb';

app.set('port', process.env.PORT || 3000);
app.engine('mustache',mustache());
app.set('view engine', 'mustache');
app.set('views','./views');

app.use(parser.json());
app.use(parser.urlencoded({extended : false}));
app.use(express.static(__dirname+'/public'));
app.use(session({
  secret : 'admin',
  resave : false,
  saveUnitialized : true
  })
);
app.use('/', function(req,res){
  MongoClient.connect(mongoURL, function(err,db){
    const robots = db.collection('robots');
    robots.find({}).toArray(function (err, docs){
      res.render("index", {robots: docs})
    })
  })
});

app.listen(app.get('port'), function(){
  console.log('listening on 3000');
  console.log(session);
});
