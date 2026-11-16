'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    static associate(models) {
      Review.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      Review.belongsTo(models.Song, {
        foreignKey: 'song_id',
        as: 'song',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }

  Review.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      song_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1, max: 5 },
      },
      comment: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'Review',
      tableName: 'Reviews',
    }
  );

  return Review;
};