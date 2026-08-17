import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const conexion = new Sequelize(
  process.env.DB_NOMBRE || "spotmarket",
  process.env.DB_USUARIO || "root",
  process.env.DB_CONTRASENA || "",
  {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PUERTO || 3306,
    dialect: "mysql",
    logging: false,
    define: {
      timestamps: true,
      underscored: true,
    },
  },
);

export default conexion;
