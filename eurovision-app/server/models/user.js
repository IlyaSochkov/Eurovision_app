'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Пользователь — много плейлистов
      User.hasMany(models.Playlist, {
        foreignKey: 'user_id',
        as: 'playlists',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      // Пользователь — много отзывов
      User.hasMany(models.Review, {
        foreignKey: 'user_id',
        as: 'reviews',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }

  User.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      password_hash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM('user', 'admin'),
        allowNull: false,
        defaultValue: 'user',
      },
      is_blocked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'Users',
      // Скрываем хэш пароля при сериализации в JSON
      defaultScope: {
        attributes: { exclude: ['password_hash'] },
      },
      scopes: {
        // Отдельный скоуп, когда пароль нужен (например, при логине)
        withPassword: { attributes: {} },
      },
    }
  );

  return User;
};