const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ChatGroupMember = sequelize.define('ChatGroupMember', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    group_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'chatgroups', key: 'id' } },
    user_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'id' } }
}, { underscored: true });

module.exports = ChatGroupMember;
