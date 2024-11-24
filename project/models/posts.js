"use strict";
const { Model } = require("sequelize"); // Import Sequelize

module.exports = (sequelize, DataTypes) => {
  class posts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define associations here

      // `AUTHOR` liên kết đến `User` (tác giả của bài viết)
      posts.belongsTo(models.user, {
        foreignKey: "author", 
      });
    }
  }

  posts.init(
    {
      _id: {
        type: DataTypes.BIGINT, // BIGSERIAL tương đương với BIGINT trong Sequelize
        primaryKey: true,
        autoIncrement: true,
      },
      author: {
        type: DataTypes.INTEGER,
      },
      text_content: {
        type: DataTypes.TEXT,
      },
      picture_url: {
        type: DataTypes.TEXT,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "posts", // Tên model
      timestamps: false, // Không sử dụng các trường `createdAt` và `updatedAt`
    }
  );

  return posts;
};
