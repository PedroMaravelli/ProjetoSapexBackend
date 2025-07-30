// models/professor.js
module.exports = (sequelize, DataTypes) => {
    const Professor = sequelize.define('Professor', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        nome: DataTypes.STRING(60),
        email: DataTypes.STRING(100),
        re: DataTypes.INTEGER,
        senha: DataTypes.STRING(10)
    }, {
        freezeTableName: true,
        timestamps: false  // <- desativa createdAt e updatedAt // <-- adicione esta linha
      });

    Professor.associate = (models) => {
        Professor.hasMany(models.Trabalho, { foreignKey: 'professor_id' });
    };
    
        return Professor;
    };
    