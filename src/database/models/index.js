const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config(); // Para ler o .env

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Importando modelos
db.Aluno = require('./Aluno')(sequelize, DataTypes);
db.Professor = require('./Professor')(sequelize, DataTypes);
db.Localizacao = require('./Localizacao')(sequelize, DataTypes);
db.Trabalho = require('./Trabalho')(sequelize, DataTypes);
db.Admin = require('./Admin')(sequelize, DataTypes);
db.GuiaSapex = require('./GuiaSapex')(sequelize, DataTypes);
db.AdminHasTrabalho = require('./AdminHasTrabalho')(sequelize, DataTypes);
db.AdminHasGuiaSapex = require('./AdminHasGuiaSapex')(sequelize, DataTypes);
db.AlunoHasTrabalho = require('./AlunoHasTrabalho')(sequelize, DataTypes);
db.Comentario = require('./Comentario')(sequelize, DataTypes);
db.ComentarioLike = require('./ComentarioLike')(sequelize, DataTypes);
db.TrabalhoLike = require('./TrabalhoLike')(sequelize, DataTypes);
db.TrabalhoSalvo = require('./TrabalhoSalvo')(sequelize, DataTypes);

// Executando associações
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
