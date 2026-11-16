'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PlaylistSong extends Model {
    static associate(models) {
      // Связи через belongsTo нужны, чтобы можно было делать include с промежуточной таблицей
      PlaylistSong.belongsTo(models.Playlist, {
        foreignKey: 'playlist_id',
        as: 'playlist',
      });
      PlaylistSong.belongsTo(models.Song, {
        foreignKey: 'song_id',
        as: 'song',
      });
    }
  }

  PlaylistSong.init(
    {
      playlist_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      song_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
    },
    {
      sequelize,
      modelName: 'PlaylistSong',
      tableName: 'PlaylistSongs',
    }
  );

  return PlaylistSong;
};