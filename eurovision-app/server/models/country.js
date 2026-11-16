'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Country extends Model {
    static associate(models) {
      // Одна страна — много исполнителей
      Country.hasMany(models.Artist, {
        foreignKey: 'country_id',
        as: 'artists',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      });

      // Одна страна — много песен (страна-участница)
      Country.hasMany(models.Song, {
        foreignKey: 'country_id',
        as: 'songs',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      });
    }
  }

  Country.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      flag_url: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Country',
      tableName: 'Countries',
    }
  );

  return Country;
};