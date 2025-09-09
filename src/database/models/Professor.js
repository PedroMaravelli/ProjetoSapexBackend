// models/professor.js
module.exports = (sequelize, DataTypes) => {
    const Professor = sequelize.define('Professor', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        nome: DataTypes.STRING(60),
        email: DataTypes.STRING(100),
    }, {
        freezeTableName: true,
        timestamps: false 
      });

    Professor.associate = (models) => {
        Professor.hasMany(models.Trabalho, { foreignKey: 'professor_id' });
    };
    
        return Professor;
    };
    