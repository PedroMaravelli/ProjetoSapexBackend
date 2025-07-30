
// models/admin.js
module.exports = (sequelize, DataTypes) => {
    const Admin = sequelize.define('Admin', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        nome: DataTypes.STRING(60),
        email: DataTypes.STRING(100),
        senha: DataTypes.STRING(10),
        matricula: DataTypes.STRING(45)
        }, {
            freezeTableName: true, 
            timestamps: false  // <- desativa createdAt e updatedAt// <-- adicione esta linha
          });
    
        Admin.associate = (models) => {
        Admin.belongsToMany(models.Trabalho, {
            through: models.AdminHasTrabalho,
            foreignKey: 'admin_id'
        });
        Admin.belongsToMany(models.GuiaSapex, {
            through: models.AdminHasGuiaSapex,
            foreignKey: 'admin_id'
        });
        };
    
        return Admin;
    };
    
