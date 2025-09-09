module.exports = (sequelize, DataTypes) => {
  const AlunoHasTrabalho = sequelize.define('aluno_has_trabalho', {
    alunoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'Aluno_id',
      primaryKey: true
    },
    trabalhoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'Trabalho_id',
      primaryKey: true
    },
    nota: {
      type: DataTypes.DECIMAL(3, 1),
      allowNull: true,
      validate: {
        min: 0,
        max: 10
      }
    },
    justificativa_nota: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'aluno_has_trabalho',
    timestamps: false
  });

  AlunoHasTrabalho.associate = (models) => {
    AlunoHasTrabalho.belongsTo(models.Aluno, {
      foreignKey: 'Aluno_id',
      as: 'aluno'
    });

    AlunoHasTrabalho.belongsTo(models.Trabalho, {
      foreignKey: 'Trabalho_id',
      as: 'trabalho'
    });
  };

  return AlunoHasTrabalho;
};
