const express = require ('express')
const path = require('path'); 
const app = express()
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(helmet());
app.use(express.json());
// Import des routes

const routeRole = require('./routes/routeRole');
const routeUser = require('./routes/routeUser');
const routePost = require('./routes/routePost');
const routeComment = require('./routes/routeComment');
const routePostLike = require('./routes/routePostLike');
const routeCommentLike = require('./routes/routeCommentLike');

// Autorisation du CORS

app.use((req, res, next) => { 
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

// Gestion des images:

app.use('/images', express.static(path.join(__dirname, 'images')));

// Utilisation de nos routes

app.use('/roles', routeRole);
app.use('/users', routeUser);
app.use('/posts', routePost);
app.use('/comments', routeComment);
app.use('/postLikes', routePostLike);
app.use('/commentLikes', routeCommentLike);

module.exports = app

