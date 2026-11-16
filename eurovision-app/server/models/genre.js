'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Genre extends Model {
    static associate(models) {
      Genre.hasMany(models.Song, {
        foreignKey: 'genre_id',
        as: 'songs',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      });
    }
  }

  Genre.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: 'Genre',
      tableName: 'Genres',
    }
  );

  return Genre;
};