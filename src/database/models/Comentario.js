module.exports = (sequelize, DataTypes) => {
  const Comentario = sequelize.define('Comentario', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    trabalho_id: { type: DataTypes.INTEGER, allowNull: false },
    usuario_id: { type: DataTypes.INTEGER, allowNull: false },
    conteudo: { type: DataTypes.TEXT, allowNull: false },
    parent_id: { type: DataTypes.INTEGER, allowNull: true },
    likes_count: { type: DataTypes.INTEGER, defaultValue: 0 },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    tableName: 'Comentarios',
    timestamps: false
  });

  Comentario.associate = (models) => {
    Comentario.belongsTo(models.Trabalho, {
      foreignKey: 'trabalho_id',
      as: 'trabalho'
    });

    Comentario.belongsTo(models.Aluno, {
      foreignKey: 'usuario_id',
      as: 'usuario'
    });

    Comentario.belongsTo(models.Comentario, {
      foreignKey: 'parent_id',
      as: 'parent'
    });

    Comentario.hasMany(models.Comentario, {
      foreignKey: 'parent_id',
      as: 'replies'
    });

    Comentario.hasMany(models.ComentarioLike, {
      foreignKey: 'comentario_id',
      as: 'likes'
    });
  };

  return Comentario;
};