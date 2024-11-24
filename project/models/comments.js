"use strict";
const { Model } = require("sequelize"); // Import Sequelize

module.exports = (sequelize, DataTypes) => {
  class comments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define associations here

      // `FROM_USER` liên kết đến `User` (người theo dõi)
      comments.belongsTo(models.user, {
        foreignKey: "from_user"
      });


      comments.belongsTo(models.posts, {
        foreignKey: "to_post"
      })
    }
  }

  comments.init(
    {
      _id: {
        type: DataTypes.BIGINT, // BIGSERIAL tương đương với BIGINT trong Sequelize
        primaryKey: true,
        autoIncrement: true,
      },
      from_user: {
        type: DataTypes.INTEGER,
      },
      to_post: {
        type: DataTypes.INTEGER,
      },
      text_content: {
        type: DataTypes.TEXT,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      }
    },
    {
      sequelize,
      modelName: "comments", // Tên model
      timestamps: false, // Không sử dụng các trường `createdAt` và `updatedAt`
    }
  );

  return comments;
};
