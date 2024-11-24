"use strict";
const { Model } = require("sequelize"); // Import Sequelize

module.exports = (sequelize, DataTypes) => {
  class likes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define associations here

      // `FROM_USER` liên kết đến `User` (người theo dõi)
      likes.belongsTo(models.user, {
        foreignKey: "from_user", 
      });


      likes.belongsTo(models.posts, {
        foreignKey: "to_post",
      })
      
      likes.belongsTo(models.comments, {
        foreignKey: "to_cmt",
      });
    }
  }

  likes.init(
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
        defaultValue: 1
      },
      to_cmt: {
        type: DataTypes.INTEGER,
        defaultValue: 1
      }
    },
    {
      sequelize,
      modelName: "likes", // Tên model
      timestamps: false, // Không sử dụng các trường `createdAt` và `updatedAt`
    }
  );

  return likes;
};
