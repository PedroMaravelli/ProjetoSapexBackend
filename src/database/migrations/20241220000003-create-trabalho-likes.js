'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('TrabalhoLikes', {
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
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Índice único para evitar curtidas duplicadas
    await queryInterface.addIndex('TrabalhoLikes', ['trabalho_id', 'usuario_id'], {
      unique: true,
      name: 'unique_trabalho_like'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('TrabalhoLikes');
  }
};