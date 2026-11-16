'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Playlist extends Model {
    static associate(models) {
      // Плейлист принадлежит пользователю
      Playlist.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      // Плейлист — много песен (многие-ко-многим)
      Playlist.belongsToMany(models.Song, {
        through: models.PlaylistSong,
        foreignKey: 'playlist_id',
        otherKey: 'song_id',
        as: 'songs',
      });
    }
  }

  Playlist.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Playlist',
      tableName: 'Playlists',
    }
  );

  return Playlist;
};