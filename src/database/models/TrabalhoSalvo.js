module.exports = (sequelize, DataTypes) => {
  const TrabalhoSalvo = sequelize.define('TrabalhoSalvo', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    trabalho_id: { type: DataTypes.INTEGER, allowNull: false },
    usuario_id: { type: DataTypes.INTEGER, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    tableName: 'TrabalhosSalvos',
    timestamps: false
  });

  TrabalhoSalvo.associate = (models) => {
    TrabalhoSalvo.belongsTo(models.Trabalho, {
      foreignKey: 'trabalho_id',
      as: 'trabalho'
    });

    TrabalhoSalvo.belongsTo(models.Aluno, {
      foreignKey: 'usuario_id',
      as: 'usuario'
    });
  };

  return TrabalhoSalvo;
};