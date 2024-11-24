"use strict";
const { Model } = require("sequelize"); // Import Sequelize

module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define associations here if applicable
      // For example:
      // user.hasMany(models.Comment, { foreignKey: "userId" });


      // user.hasMany(models.likes);
      // user.hasMany(models.follows);
      // user.hasMany(models.comments);
      // user.hasMany(models.posts);
      // user.hasMany(models.notifications);

    }
  }

  user.init(
    {
      _id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_name: {
        type: DataTypes.STRING(50),
      },
      pass: {
        type: DataTypes.STRING(50),
      },
      gmail: {
        type: DataTypes.STRING(50)
      },
      display_name: {
        type: DataTypes.STRING(50),
      },
      profile_picture: {
        type: DataTypes.TEXT,
      },
      quote: {
        type: DataTypes.STRING(50),
      }
    },
    {
      sequelize,
      modelName: "user", // Correct model name
      timestamps: false, // Disable Sequelize's automatic timestamp fields
    }
  );

  return user;
};
