const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');//Import de la config de la database


const Role = require('./Role')(sequelize, Sequelize.DataTypes);
const User = require('./User')(sequelize, Sequelize.DataTypes);
const Post = require('./Post')(sequelize, Sequelize.DataTypes);
const PostLike = require('./PostLike')(sequelize, Sequelize.DataTypes);
const Comment = require('./Comment')(sequelize, Sequelize.DataTypes);
const CommentLike = require('./CommentLike')( sequelize, Sequelize.DataTypes);

// Les relations de Role

Role.hasMany(User, {
    foreignKey: 'role_id',
    as: 'users'
  });

//Les relations de User

User.belongsTo(Role, {
    foreignKey: 'role_id',
    as: 'role'}
  )

User.hasMany(Post, {
  foreignKey: 'user_id',
  as: 'posts'
});

User.hasMany(Comment, {
    foreignKey: 'user_id',
    as: 'comments'
  });


User.hasMany(PostLike, {
    foreignKey: 'user_id',
    as: 'postLikes'
  });
  
User.hasMany(CommentLike, {
      foreignKey: 'user_id',
      as: 'commentLikes'
    });

//Les relations des Post

Post.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
})

Post.hasMany(Comment, {
    foreignKey: 'post_id',
    as: 'comments'
})

Post.hasMany(PostLike, {
  foreignKey: 'post_id',
  as: 'likes'
})

//Les relations des Comments

Comment.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

Comment.belongsTo(Post, {
  foreignKey: 'post_id',
  as: 'post'
});

Comment.hasMany(CommentLike, {
  foreignKey: 'comment_id',
  as: 'likes'
});

//Les relations des Postlikes

PostLike.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

PostLike.belongsTo(Post, {
  foreignKey: 'post_id',
  as: 'post'
});

//Les relations des CommentLikes

CommentLike.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

CommentLike.belongsTo(Comment, {
  foreignKey: 'comment_id',
  as: 'comment'
});


// Synchroniser les modèles avec la base de données
sequelize.sync({ force: false }) // force: true pour forcer la mise à jour des tables (utiliser avec prudence)
  .then(() => {
    console.log('Database & tables created!');
  });

module.exports = { sequelize, Role, User, Post, PostLike, Comment, CommentLike };
