'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ComentarioLikes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      comentario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Comentarios',
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
    await queryInterface.addIndex('ComentarioLikes', ['comentario_id', 'usuario_id'], {
      unique: true,
      name: 'unique_comentario_like'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ComentarioLikes');
  }
};