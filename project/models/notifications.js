"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class notifications extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // `USER` liên kết đến `User` (người nhận thông báo)
      notifications.belongsTo(models.user, {
        foreignKey: "of_user", 
      });
    }
  }

  notifications.init(
    {
      _id: {
        type: DataTypes.BIGINT, // BIGSERIAL tương đương với BIGINT trong Sequelize
        primaryKey: true,
        autoIncrement: true,
      },
      of_user: {
        type: DataTypes.INTEGER
      },
      read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false, // Mặc định thông báo chưa được đọc
      },
      type: {
        type: DataTypes.INTEGER,
      },
      text_content: {
        type: DataTypes.TEXT,
      },
      link_to: {
        type: DataTypes.TEXT,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
    },
    {
      sequelize,
      modelName: "notifications", // Tên model
      timestamps: false, // Không sử dụng các trường `createdAt` và `updatedAt`
    }
  );

  return notifications;
};
