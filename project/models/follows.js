"use strict";
const { Model } = require("sequelize"); // Import Sequelize

module.exports = (sequelize, DataTypes) => {
  class follows extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define associations here

      // `FROM_USER` liên kết đến `User` (người theo dõi)
      follows.belongsTo(models.user, {
        foreignKey: "from_user", 
      });

      // `TO_USER` liên kết đến `User` (người được theo dõi)
      follows.belongsTo(models.user, {
        foreignKey: "to_user", 
      });
    }
  }

  follows.init(
    {
      _id: {
        type: DataTypes.BIGINT, // BIGSERIAL tương đương với BIGINT trong Sequelize
        primaryKey: true,
        autoIncrement: true,
      },
      from_user: {
        type: DataTypes.INTEGER,
      },
      to_user: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "follows", // Tên model
      timestamps: false, // Không sử dụng các trường `createdAt` và `updatedAt`
    }
  );

  return follows;
};
