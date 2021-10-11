require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

var mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const {Schema} = mongoose;

const urlSchema = new Schema({
  url: String,
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


app.post('/api/shorturl', function(req, res)
{
  const count = Url.estimatedDocumentCount();
  // console.log('there are %d URLS', count);
  Url.find({ shortened: 1}, function (err, docs) 
  {
    console.log(docs);
  });

  Url.create({ url: req.body.url, shortened: 1 }, function (err, small) {
    if (err) return handleError(err);

    console.log(small);
    res.json({"original_url": req.body.url});
    // saved!
  });


  
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
