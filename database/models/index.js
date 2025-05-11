// models/index.js

const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

// Conexão com o banco de dados
const sequelize = new Sequelize('nome_do_banco', 'root', 'Peixe123!', {
  host: 'localhost',
  dialect: 'mysql', // ou 'postgres', 'sqlite', 'mariadb'
  logging: false,   // tira os logs no console
});

// Carregar todos os modelos
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Importando os modelos
db.Aluno = require('./aluno')(sequelize, DataTypes);
db.Professor = require('./professor')(sequelize, DataTypes);
db.Localizacao = require('./localizacao')(sequelize, DataTypes);
db.Trabalho = require('./trabalho')(sequelize, DataTypes);
db.Admin = require('./admin')(sequelize, DataTypes);
db.GuiaSapex = require('./guia_sapex')(sequelize, DataTypes);
db.AdminHasTrabalho = require('./admin_has_trabalho')(sequelize, DataTypes);
db.AdminHasGuiaSapex = require('./admin_has_guia_sapex')(sequelize, DataTypes);

// Criando as associações (chamando a função associate de cada modelo)
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Exportar para usar nos controllers, services, etc.
module.exports = db;
