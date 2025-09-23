'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Comentarios', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      trabalho_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Trabalho',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Aluno',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      conteudo: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      parent_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Comentarios',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      likes_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Comentarios');
  }
};