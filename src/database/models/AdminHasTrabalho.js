// models/admin_has_trabalho.js
module.exports = (sequelize, DataTypes) => {
    const AdminHasTrabalho = sequelize.define('admin_has_trabalho', {
      admin_id: { type: DataTypes.INTEGER, primaryKey: true },
      trabalho_id: { type: DataTypes.INTEGER, primaryKey: true },
      trabalho_aluno_id: DataTypes.INTEGER,
      trabalho_professor_id: DataTypes.INTEGER
    }, {
        freezeTableName: true,
        timestamps: false  // <- desativa createdAt e updatedAt // <-- adicione esta linha
      });
  
    return AdminHasTrabalho;
  };
  