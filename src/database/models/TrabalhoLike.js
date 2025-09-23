module.exports = (sequelize, DataTypes) => {
  const TrabalhoLike = sequelize.define('TrabalhoLike', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    trabalho_id: { type: DataTypes.INTEGER, allowNull: false },
    usuario_id: { type: DataTypes.INTEGER, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    tableName: 'TrabalhoLikes',
    timestamps: false
  });

  TrabalhoLike.associate = (models) => {
    TrabalhoLike.belongsTo(models.Trabalho, {
      foreignKey: 'trabalho_id',
      as: 'trabalho'
    });

    TrabalhoLike.belongsTo(models.Aluno, {
      foreignKey: 'usuario_id',
      as: 'usuario'
    });
  };

  return TrabalhoLike;
};