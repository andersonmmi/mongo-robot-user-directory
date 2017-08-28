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
app.use(parser.urlencoded({extended : true}));
app.use(express.static(__dirname+'/public'));
app.use(session({
  secret : 'admin',
  resave : false,
  saveUnitialized : true
  })
);

app.get('/', function(req,res){
  MongoClient.connect(mongoURL, function(err,db){
    const robots = db.collection('robots');
    robots.find({}).toArray(function (err, docs){
      res.render("index", {robots: docs})
    })
  })
});

app.get('/:id', function(req,res){
  let id = parseInt(req.params.id);
  console.log(req.params);
  console.log(req.params.id);
  if (Number.isInteger(id)){
    MongoClient.connect(mongoURL, function(err, db){
      const robots = db.collection('robots');
      robots.find({"id": id}).toArray(function(err, docs){
        res.render('id', {robots: docs})
      })
    })
  } else if (req.params.id === 'employed'){
    console.log('employed');
    MongoClient.connect(mongoURL, function(err, db){
      const robots = db.collection('robots');
      robots.find({job: {$not: {$in: [null]}}}).toArray(function(err, docs){
        res.render('employed', {robots: docs})
      })
    })
  } else if (req.params.id === 'available'){
    console.log('available');
    MongoClient.connect(mongoURL, function(err, db){
      const robots = db.collection('robots');
      robots.find({job: {$in: [null]}}).toArray(function(err, docs){
        res.render('available', {robots: docs})
      })
    })
  }
});

app.get('/skills/:skills', function(req,res){
    let searchTearm = req.params.skills;
    console.log('skills');
    console.log("searchTearm = "+searchTearm);
    if (searchTearm === 'available'){
      console.log('available');
      MongoClient.connect(mongoURL, function(err, db){
        const robots = db.collection('robots');
        robots.find({job: {$in: [null]}}).toArray(function(err, docs){
          res.render('available', {robots: docs})
        })
      })  
    } else if (searchTearm === 'employed'){
      console.log('employed');
      MongoClient.connect(mongoURL, function(err, db){
        const robots = db.collection('robots');
        robots.find({job: {$not: {$in: [null]}}}).toArray(function(err, docs){
          res.render('employed', {robots: docs})
        })
      })
    } else
      MongoClient.connect(mongoURL, function(err, db){
        const robots = db.collection('robots');
        // robots.createIndex({skills : "text"});
        robots.find({"skills":searchTearm}).toArray(function(err, docs){
          // robots.find({$text: {$search: searchTearm}}).toArray(function(err, docs){
          res.render('skills', {robots: docs})
        })
      })

});

app.get('/country/:country', function(req,res){
    let searchTearm = req.params.country;
    console.log('country');
    console.log("searchTearm = "+searchTearm);
    MongoClient.connect(mongoURL, function(err, db){
      const robots = db.collection('robots');
      // robots.createIndex({'address.country' : "text"});
      robots.find({'address.country': searchTearm}).toArray(function(err, docs){
        res.render('country', {robots: docs})
      })
    })
});


app.listen(app.get('port'), function(){
  console.log('listening on 3000');
  console.log(session);
});
