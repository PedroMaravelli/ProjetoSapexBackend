// models/admin_has_guia_sapex.js
module.exports = (sequelize, DataTypes) => {
    const AdminHasGuiaSapex = sequelize.define('AdminHasGuiaSapex', {
        admin_id: { type: DataTypes.INTEGER, primaryKey: true },
        guia_sapex_id: { type: DataTypes.INTEGER, primaryKey: true }
        });
    
        return AdminHasGuiaSapex;
    };
    