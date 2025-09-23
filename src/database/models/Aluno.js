module.exports = (sequelize, DataTypes) => {
  const Aluno = sequelize.define('Aluno', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nome: DataTypes.STRING(60),
    email: DataTypes.STRING(100),
    turma: {
      type:DataTypes.STRING(300),
      allowNull: true
    }
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

    Aluno.hasMany(models.Comentario, {
      foreignKey: 'usuario_id',
      as: 'comentarios'
    });

    Aluno.hasMany(models.TrabalhoLike, {
      foreignKey: 'usuario_id',
      as: 'trabalhos_curtidos'
    });

    Aluno.hasMany(models.ComentarioLike, {
      foreignKey: 'usuario_id',
      as: 'comentarios_curtidos'
    });

    Aluno.hasMany(models.TrabalhoSalvo, {
      foreignKey: 'usuario_id',
      as: 'trabalhos_salvos'
    });
  };

  return Aluno;
};
