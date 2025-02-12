const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ChatGroupMessage = sequelize.define('ChatGroupMessage', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    group_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'chatgroups', key: 'id' } },
    sender_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'id' } },
    content: { type: DataTypes.TEXT, allowNull: false }
}, { underscored: true });

module.exports = ChatGroupMessage;
