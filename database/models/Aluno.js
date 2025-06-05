module.exports = (sequelize, DataTypes) => {
  const Aluno = sequelize.define('Aluno', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nome: DataTypes.STRING(60),
    email: DataTypes.STRING(100),
    ra: DataTypes.INTEGER,
    senha: DataTypes.STRING(10),
    turma: DataTypes.STRING(300)
  }, {
    freezeTableName: true,
    timestamps: false
  });

  Aluno.associate = (models) => {
    Aluno.belongsToMany(models.Trabalho, {
      through: models.AlunoHasTrabalho,
      foreignKey: 'Aluno_id',
      otherKey: 'Trabalho_id',
      as: 'trabalhos'
    });
  };

  return Aluno;
};
