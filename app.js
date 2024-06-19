var express = require('express'),
path = require('path'),
bodyParser = require('body-parser'),
cors = require('cors'),
mongoose = require('mongoose');
require('dotenv').config();
const jwt = require('jsonwebtoken');

mongoose.Promise = global.Promise;
mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@shareheart.ym2hd9m.mongodb.net/?retryWrites=true&w=majority&appName=ShareHeart`, { useNewUrlParser: true, useUnifiedTopology: true }).then(
  () => {console.log('Database is connected') },
  err => { console.log('Can not connect to the database'+ err)});

const donorRoute = require('./routes/donor.route');
const institutionRoutes = require('./routes/institution.route');
const Donor = require('./model/Donor');
var app = express();
app.use(bodyParser.json());
app.use(cors());

const verifyToken = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) return res.status(401).json({ msg: 'Acesso negado: Cabeçalho de autorização ausente' });

  const token = authHeader.replace('Bearer ', '');
  if (!token) return res.status(401).json({ msg: 'Acesso negado: Token não encontrado' });

  try {
    const secret = process.env.SECRET
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ msg: 'Token inválido', error: err.message });
  }
};

app.get('/user', verifyToken, async (req, res) => {
  try {
    const user = await Donor.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'Usuário não encontrado' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao buscar usuário', error: err.message });
  }
});

app.use('/donor', donorRoute);
app.use('/institution', institutionRoutes);
app.get('/', function(req, res){
   res.send("Hello World!");
});

app.listen(3000,function(){
    console.log('Listening on port 3000!');
});