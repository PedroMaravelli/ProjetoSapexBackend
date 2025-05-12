
// models/aluno.js
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
            timestamps: false  // <- desativa createdAt e updatedAt // <-- adicione esta linha
          });
    
        Aluno.associate = (models) => {
        Aluno.hasMany(models.Trabalho, { foreignKey: 'aluno_id' });
        };
    
        return Aluno;
    };
        
