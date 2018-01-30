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
const getSlug = require('speakingurl');

app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.use(compression());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(errorHandler());

app.get('/', (req, res) => {
  db.Article.findAll({ limit: 1, order: db.sequelize.random() }).then(
    result => {
      res.render('index.ejs', {
        title: result.length > 0 ? result[0].title : 'Please seed db',
        slug: result[0].slug,
      });
    },
  );
});

app.get('/slug', (req, res) => {
  let slug = getSlug(req.query.title);
  res.setHeader('Content-Type', 'application/json');

  db.Article.findAll({ limit: 1, where: { slug: slug } }).then(
    results => {
      if (results.length > 0) {
        slug = slug + '-' + getRandom(5);
      }
      res.send(JSON.stringify({ dup: results.length, slug: slug, error: 0 }));
    },
    err => {
      res.send(JSON.stringify({ msg: err.toString(), error: 1 }));
    },
  );
});

app.post('/title', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  console.log(req.body);

  db.Article.create({
    title: req.body.title,
    slug: req.body.slug,
    createdAt: new Date(),
    updatedAt: new Date(),
  }).then(
    () => {
      res.send(JSON.stringify({ msg: 'added', error: 0 }));
    },
    err => {
      res.send(JSON.stringify({ msg: err.message, error: 1 }));
    },
  );
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));

const getRandom = length => {
  return Math.random()
    .toString(36)
    .substr(2, length);
};
