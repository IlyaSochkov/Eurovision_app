'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Artist extends Model {
    static associate(models) {
      // Исполнитель принадлежит стране
      Artist.belongsTo(models.Country, {
        foreignKey: 'country_id',
        as: 'country',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      });

      // Исполнитель — много песен
      Artist.hasMany(models.Song, {
        foreignKey: 'artist_id',
        as: 'songs',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      });
    }
  }

  Artist.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      bio: DataTypes.TEXT,
      country_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Artist',
      tableName: 'Artists',
    }
  );

  return Artist;
};