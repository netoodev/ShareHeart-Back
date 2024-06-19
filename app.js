var express = require('express'),
path = require('path'),
bodyParser = require('body-parser'),
cors = require('cors'),
mongoose = require('mongoose');
require('dotenv').config();

mongoose.Promise = global.Promise;
mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@shareheart.ym2hd9m.mongodb.net/?retryWrites=true&w=majority&appName=ShareHeart`, { useNewUrlParser: true, useUnifiedTopology: true }).then(
  () => {console.log('Database is connected') },
  err => { console.log('Can not connect to the database'+ err)});

const donorRoute = require('./routes/donor.route');
const institutionRoutes = require('./routes/institution.route');
var app = express();
app.use(bodyParser.json());
app.use(cors());

app.use('/donor', donorRoute);
app.use('/institution', institutionRoutes);
app.get('/', function(req, res){
   res.send("Hello World!");
});

app.listen(3000,function(){
    console.log('Listening on port 3000!');
});