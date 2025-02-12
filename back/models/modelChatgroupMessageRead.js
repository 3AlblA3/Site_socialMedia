const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ChatGroupMessageRead = sequelize.define('ChatGroupMessageRead', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    message_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'chatgroup_messages', key: 'id' } },
    user_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'id' } },
    read_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
}, { underscored: true });

module.exports = ChatGroupMessageRead;
