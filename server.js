require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

const dns = require('dns');

var mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const {Schema} = mongoose;

const urlSchema = new Schema({
  original_url: String,
  shortened: Number
});

let Url = mongoose.model("Url", urlSchema);

// shortURL should increment in database

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.get('/api/shorturl/:url', function(req, res)
{
  var daUrl = req.params.url;
  console.log(daUrl);
  Url.findOne({shortened: daUrl}, function (err, data)
  {
    if (err) console.log(err);

    console.log(data);
    res.redirect(data.original_url);
  });
});

app.post('/api/shorturl', function(req, res)
{
  let funnyNum = 0;

  dns.lookup(req.body.url, (err, address, family) => {
    console.log('address: %j family: IPv%s', address, family);
  });

  Url.count({}, function( err, count){
    funnyNum = count + 1;
    // console.log( "Number of users:", count );

    Url.create({ original_url: req.body.url, shortened: funnyNum }, function (err, small) {
      if (err) return handleError(err);
  
      // console.log(small);
      res.json({"original_url": req.body.url, "short_url": funnyNum});

      Url.find({}, function (err, docs) 
    {
      // console.log(docs);
    });
      // saved!
    });
  
    
  });
  // console.log('there are %d URLS', count);
  

 
  
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
