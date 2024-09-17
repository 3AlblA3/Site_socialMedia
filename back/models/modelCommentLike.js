const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CommentLike = sequelize.define(
    'CommentLike', {
        id: { type: DataTypes.INTEGER, allowNull: false,  primaryKey: true, autoIncrement: true},
        user_id: {type: DataTypes.INTEGER, references: {model: 'users', key: 'id'}},
        comment_id: {type: DataTypes.INTEGER, references: {model: 'comments', key: 'id'}},
        created_at: { type: DataTypes.DATE, allowNull: false },
        updated_at: { type: DataTypes.DATE, allowNull: false},
        deleted_at: { type: DataTypes.DATE, allowNull: false}        
    },
    {underscored: true}
);

module.exports = CommentLike;
