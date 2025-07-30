// models/localizacao.js
module.exports = (sequelize, DataTypes) => {
    const Localizacao = sequelize.define('Localizacao', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        predio: DataTypes.STRING(45),
        sala: DataTypes.STRING(45),
        ponto_referencia: DataTypes.STRING(150)
        }, {
            freezeTableName: true,
            timestamps: false 
          });
    
        Localizacao.associate = (models) => {
        Localizacao.hasMany(models.Trabalho, { foreignKey: 'localizacao_id' });
        };
    
        return Localizacao;
    };
    