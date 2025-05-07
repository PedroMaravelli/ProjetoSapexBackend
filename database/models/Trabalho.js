// models/trabalho.js
module.exports = (sequelize, DataTypes) => {
    const Trabalho = sequelize.define('Trabalho', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        titulo: DataTypes.STRING(100),
        tipo: DataTypes.STRING(45),
        n_poster: DataTypes.INTEGER,
        data: DataTypes.DATE,
        horario: DataTypes.STRING(45)
        });
    
        Trabalho.associate = (models) => {
        Trabalho.belongsTo(models.Aluno, { foreignKey: 'aluno_id' });
        Trabalho.belongsTo(models.Professor, { foreignKey: 'professor_id' });
        Trabalho.belongsTo(models.Localizacao, { foreignKey: 'localizacao_id' });
    
        Trabalho.belongsToMany(models.Admin, {
            through: models.AdminHasTrabalho,
            foreignKey: 'trabalho_id'
        });
        };
    
        return Trabalho;
    };
    