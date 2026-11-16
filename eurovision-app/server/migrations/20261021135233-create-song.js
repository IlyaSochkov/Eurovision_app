'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Songs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      artist_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Artists',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      country_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Countries',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      genre_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Genres',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      year: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          min: 1956, // первый конкурс Евровидения
        },
      },
      audio_url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      video_url: {
        type: Sequelize.STRING,
      },
      lyrics: {
        type: Sequelize.TEXT,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    // Индексы для фильтрации из ТЗ (по году / стране / жанру)
    await queryInterface.addIndex('Songs', ['year']);
    await queryInterface.addIndex('Songs', ['country_id']);
    await queryInterface.addIndex('Songs', ['genre_id']);
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Songs');
  },
};