const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PostLike = sequelize.define(
    'PostLike', {
        id: { type: DataTypes.INTEGER, allowNull: false,  primaryKey: true, autoIncrement: true},
        user_id: {type: DataTypes.INTEGER, references: {model: 'users', key: 'id'}},
        post_id: {type: DataTypes.INTEGER, references: {model: 'posts', key: 'id'}}
    } 
);

module.exports = PostLike;
