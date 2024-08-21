const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define(
    'User', {
        id: { type: DataTypes.INTEGER, allowNull: false,  primaryKey: true, autoIncrement: true},
        role_id: {type: DataTypes.INTEGER, references: {model: 'roles', key: 'id'}},
        firstName : { type: DataTypes.STRING, allowNull: false },
        lastName : { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false },
        password: { type: DataTypes.STRING, allowNull: false }
    } 
);

module.exports = User;
