const express = require ('express')
const app = express()
app.use(express.json());

const routeRole = require('./routes/routeRole');
const routeUser = require('./routes/routeUser');
const routePost = require('./routes/routePost');
const routeComment = require('./routes/routeComment');
const routePostLike = require('./routes/routePostLike');
const routeCommentLike = require('./routes/routeCommentLike');

app.use('/roles', routeRole);
app.use('/users', routeUser);
app.use('/posts', routePost);
app.use('/comments', routeComment);
app.use('/postLikes', routePostLike);
app.use('/commentLikes', routeCommentLike);


module.exports = app