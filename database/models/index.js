const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

// Conexão com o banco de dados
const sequelize = new Sequelize('mydb', 'root', 'Peixe123!', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Importando os modelos
db.Aluno = require('./Aluno')(sequelize, DataTypes);
db.Professor = require('./Professor')(sequelize, DataTypes);
db.Localizacao = require('./Localizacao')(sequelize, DataTypes);
db.Trabalho = require('./Trabalho')(sequelize, DataTypes);
db.Admin = require('./Admin')(sequelize, DataTypes);
db.GuiaSapex = require('./GuiaSapex')(sequelize, DataTypes);
db.AdminHasTrabalho = require('./AdminHasTrabalho')(sequelize, DataTypes);
db.AdminHasGuiaSapex = require('./AdminHasGuiaSapex')(sequelize, DataTypes);
db.AlunoHasTrabalho = require('./AlunoHasTrabalho')(sequelize, DataTypes);



// Criando as associações
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Exporte somente o objeto db, que contém tudo que precisa
module.exports = db;