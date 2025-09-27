module.exports = (sequelize, DataTypes) => {
  const ComentarioLike = sequelize.define('ComentarioLike', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    comentario_id: { type: DataTypes.INTEGER, allowNull: false },
    usuario_id: { type: DataTypes.INTEGER, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    tableName: 'ComentarioLikes',
    timestamps: false
  });

  ComentarioLike.associate = (models) => {
    ComentarioLike.belongsTo(models.Comentario, {
      foreignKey: 'comentario_id',
      as: 'comentario'
    });

    ComentarioLike.belongsTo(models.Aluno, {
      foreignKey: 'usuario_id',
      as: 'usuario'
    });
  };

  return ComentarioLike;
};