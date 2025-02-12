const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ChatGroup = sequelize.define('ChatGroup', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    name: { type: DataTypes.STRING(255), allowNull: false },
    created_by: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'id' } }
}, { underscored: true });

module.exports = ChatGroup;
