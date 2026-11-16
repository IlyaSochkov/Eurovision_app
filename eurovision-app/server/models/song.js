'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Song extends Model {
    static associate(models) {
      // Песня принадлежит исполнителю
      Song.belongsTo(models.Artist, {
        foreignKey: 'artist_id',
        as: 'artist',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      });

      // Песня принадлежит стране-участнице
      Song.belongsTo(models.Country, {
        foreignKey: 'country_id',
        as: 'country',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      });

      // Песня принадлежит жанру
      Song.belongsTo(models.Genre, {
        foreignKey: 'genre_id',
        as: 'genre',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      });

      // Песня — много отзывов
      Song.hasMany(models.Review, {
        foreignKey: 'song_id',
        as: 'reviews',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      // Песня — много плейлистов (многие-ко-многим)
      Song.belongsToMany(models.Playlist, {
        through: models.PlaylistSong,
        foreignKey: 'song_id',
        otherKey: 'playlist_id',
        as: 'playlists',
      });
    }
  }

  Song.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      artist_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      country_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      genre_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1956 },
      },
      audio_url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      video_url: DataTypes.STRING,
      lyrics: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'Song',
      tableName: 'Songs',
    }
  );

  return Song;
};