// models/admin_has_guia_sapex.js
module.exports = (sequelize, DataTypes) => {
    const AdminHasGuiaSapex = sequelize.define('admin_has_guia_sapex', {
        admin_id: { type: DataTypes.INTEGER, primaryKey: true },
        guia_sapex_id: { type: DataTypes.INTEGER, primaryKey: true }
        }, {
            freezeTableName: true, 
            timestamps: false  // <- desativa createdAt e updatedAt// <-- adicione esta linha
          });
    
        return AdminHasGuiaSapex;
    };
    