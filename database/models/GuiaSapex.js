// models/guia_sapex.js
module.exports = (sequelize, DataTypes) => {
    const GuiaSapex = sequelize.define('GuiaSapex', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      titulo: DataTypes.STRING(60),
      descricao: DataTypes.TEXT('long')
    }, {
        freezeTableName: true,
        timestamps: false  // <- desativa createdAt e updatedAt // <-- adicione esta linha
      });
  
    GuiaSapex.associate = (models) => {
      GuiaSapex.belongsToMany(models.Admin, {
        through: models.AdminHasGuiaSapex,
        foreignKey: 'guia_sapex_id'
      });
    };
  
    return GuiaSapex;
  };
  