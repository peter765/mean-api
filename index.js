const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const config = require('./config');
const path = require('path');

const app = express();


app.get('/', (req, res) => {
  res.json('Hello World');
});

// Put all API endpoints under '/api'
app.get('/api/search/:query', (req, res) => {

  
  // Query mongoDB for titles
  MongoClient.connect(config.mongoURI, function(err, client) {
    console.log("Mongo Connected");
  
    const db = client.db("dev-challenge");

    //var cursor = db.collection('Titles').find({"TitleName" : {$regex: req.params.query, $options: "i"}});

    var cursor = db.collection('Titles').find({"TitleName" : {$regex: req.params.query, $options: "i"}}).toArray(function(err, arr) {
      res.json(arr);
    });
  
    client.close();
  });


});

app.get('/api/details/:titleid', (req, res) => {

  // Query mongoDB for title id
  MongoClient.connect(config.mongoURI, function(err, client) {
    console.log(req.params.titleid);
  
    
    const db = client.db("dev-challenge");

    var collection = db.collection('Titles');

    collection.findOne({"TitleId": req.params.titleid}, function(err, document) {
      if(document == null) {
        res.json(err);
      }
      res.json(document);
    });
    
    client.close();
  });

});


const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Title db listening on ${port}`);
});

