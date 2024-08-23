const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Role = sequelize.define(
    'Role', {
        id: { type: DataTypes.INTEGER, allowNull: false,  primaryKey: true, autoIncrement: true},
        status : { type: DataTypes.STRING, allowNull: false }
    },
    { timestamps: false,
        tableName: 'roles'}
);

module.exports = Role;
