const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Post = sequelize.define(
    'Post', {
        id: { type: DataTypes.INTEGER, allowNull: false,  primaryKey: true, autoIncrement: true},
        content: {type: DataTypes.STRING, allowNull: false},
        image_url: {type: DataTypes.STRING, allowNull: true},
        user_id: {type: DataTypes.INTEGER, references: {model: 'users', key: 'id'}},
        created_at: { type: DataTypes.DATE, allowNull: false },
        updated_at: { type: DataTypes.DATE, allowNull: false},
        deleted_at: { type: DataTypes.DATE, allowNull: false}        
    },
    {underscored: true}
);

module.exports = Post;
