const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Comment = sequelize.define(
    'Comment', {
        id: { type: DataTypes.INTEGER, allowNull: false,  primaryKey: true, autoIncrement: true},
        content : { type: DataTypes.STRING, allowNull: false },
        user_id: {type: DataTypes.INTEGER, references: {model: 'users', key: 'id'}},
        post_id: {type: DataTypes.INTEGER, references: {model: 'posts', key: 'id'}}
    } 
);

module.exports = Comment;
