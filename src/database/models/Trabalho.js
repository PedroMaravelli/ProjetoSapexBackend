module.exports = (sequelize, DataTypes) => {
  const Trabalho = sequelize.define('Trabalho', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    titulo: DataTypes.STRING(100),
    tipo: DataTypes.STRING(45),
    n_poster: DataTypes.INTEGER,
    data: DataTypes.DATE,
    horario: DataTypes.STRING(45),
    likes_count: { type: DataTypes.INTEGER, defaultValue: 0 },
    comentarios_count: { type: DataTypes.INTEGER, defaultValue: 0 }
  }, {
    freezeTableName: true,
    timestamps: false
  });

  Trabalho.associate = (models) => {
    Trabalho.belongsTo(models.Professor, {
      foreignKey: 'professor_id',
      as: 'Professor'
    });

    Trabalho.belongsTo(models.Localizacao, {
      foreignKey: 'localizacao_id',
      as: 'Localizacao'
    });

    Trabalho.belongsToMany(models.Aluno, {
      through: models.AlunoHasTrabalho,
      foreignKey: 'Trabalho_id',
      otherKey: 'Aluno_id',
      as: 'alunos'
    });

    Trabalho.hasMany(models.Comentario, {
      foreignKey: 'trabalho_id',
      as: 'comentarios'
    });

    Trabalho.hasMany(models.TrabalhoLike, {
      foreignKey: 'trabalho_id',
      as: 'likes'
    });

    Trabalho.hasMany(models.TrabalhoSalvo, {
      foreignKey: 'trabalho_id',
      as: 'salvos'
    });
  };

  return Trabalho;
};
