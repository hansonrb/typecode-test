const express = require('express');
const app = express();
const compression = require('compression');
const Sequelize = require('sequelize');
const bodyParser = require('body-parser');
const logger = require('morgan');
const errorHandler = require('errorhandler');
const path = require('path');

const db = require('./models');
const Article = require('./models/article');

app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.use(compression());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(errorHandler());

app.get('/', (req, res) => {
  db.Article.findAll({ limit: 1, order: db.sequelize.random() }).then(res =>
    console.log(res),
  );
  res.render('index.ejs', { title: 'example' });
});

app.get('/availability', (req, res) => {
  console.log(req);
  res.send('Hello World!');
});

app.post('/title', (req, res) => res.send('Hello World!'));

app.listen(3000, () => console.log('Example app listening on port 3000!'));
