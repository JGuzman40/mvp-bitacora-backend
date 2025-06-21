require("dotenv").config();
const { Sequelize, DataTypes } = require("sequelize");
const fs = require("fs");
const path = require("path");

const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME } = process.env;

const sequelize = new Sequelize(
  `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`,
  {
    dialect: "postgres",
    logging: false,
  }
);

// Cargar modelos desde la carpeta /models
const modelDefiners = [];

fs.readdirSync(path.join(__dirname, "/models"))
  .filter((file) => file.endsWith(".js") && !file.startsWith("."))
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, "/models", file)));
  });

// Inyectar sequelize en todos los modelos
modelDefiners.forEach((model) => model(sequelize, DataTypes));

// Relacionar modelos
const { User, Reflexion } = sequelize.models;

User.hasMany(Reflexion, { foreignKey: "usuarioId", as: "reflexiones" });
Reflexion.belongsTo(User, { foreignKey: "usuarioId", as: "usuario" });

module.exports = {
  ...sequelize.models, // Exporta User, Reflexion, etc.
  conn: sequelize,     // Exporta la instancia de conexión
};
