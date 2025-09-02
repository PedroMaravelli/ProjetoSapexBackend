param(
  # ajuste se seu repo estiver em outro caminho
  [string]$Repo = "C:\Users\USER\Downloads\ProjetoSapexBackend"
)

# 1) Ir para a pasta do projeto
if (-not (Test-Path $Repo)) {
  Write-Error "Caminho não existe: $Repo"
  exit 1
}
Set-Location $Repo

# 2) Garantir a pasta src/database/models
$modelsDir = Join-Path $Repo "src\database\models"
New-Item -ItemType Directory -Force -Path $modelsDir | Out-Null

# 3) Criar (ou substituir) o index.js agregador no padrão sequelize-cli
#    - Varre todos os .js de models (exceto o próprio index.js),
#    - Inicializa com Sequelize e DataTypes,
#    - Exporta db + sequelize.
$indexJs = @'
"use strict";

const fs = require("fs");
const path = require("path");
const { Sequelize, DataTypes } = require("sequelize");

// Credenciais vindas do ambiente (compose)
const DB_NAME = process.env.DB_NAME || "sapex";
const DB_USER = process.env.DB_USER || "sapex";
const DB_PASS = process.env.DB_PASS || "sapex";
const DB_HOST = process.env.DB_HOST || "db";
const DB_PORT = process.env.DB_PORT || "3306";

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: "mysql",
  logging: false,
});

const db = {};
const basename = path.basename(__filename);

// Para cada arquivo .js em src/database/models (menos este), carrega e registra
fs.readdirSync(__dirname)
  .filter((file) => file.endsWith(".js") && file !== basename)
  .forEach((file) => {
    const defineModel = require(path.join(__dirname, file));

    // Suporta 2 formatos:
    // (A) module.exports = (sequelize, DataTypes) => Model
    // (B) module.exports = Model (já definido)
    const model =
      typeof defineModel === "function"
        ? defineModel(sequelize, DataTypes)
        : defineModel;

    if (!model || !model.name) {
      console.warn(`[models/index] Arquivo ${file} não exporta um Model válido.`);
      return;
    }
    db[model.name] = model;
  });

// Chama associate(db) se existir
Object.keys(db).forEach((name) => {
  if (typeof db[name].associate === "function") {
    db[name].associate(db);
  }
});

// Exporta tudo
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
'@

$indexPath = Join-Path $modelsDir "index.js"
Set-Content -Path $indexPath -Value $indexJs -Encoding UTF8
Write-Host "Escrito: $indexPath"

# 4) Sanity check: mostrar o que há em src/database/models
Write-Host "`nConteúdo de src/database/models:"
Get-ChildItem -Path $modelsDir -File | Select-Object Name,Length | Format-Table

# 5) Reconstruir e subir containers (Compose v2)
#    - Usa 'docker compose' (com espaço)
#    - Se já estiverem rodando, derruba antes
Write-Host "`nSubindo containers..."
docker compose down | Out-Null
docker compose build --no-cache
docker compose up -d

# 6) Log do app: deve iniciar sem 'MODULE_NOT_FOUND' agora
Write-Host
::contentReference[oaicite:1]{index=1}
