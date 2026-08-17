import { DataTypes } from "sequelize";
import conexion from "../config/database.js";

const Categoria = conexion.define(
  "Categoria",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    descripcion: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    emoji: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
  },
  {
    tableName: "categorias",
    timestamps: true,
  },
);

export default Categoria;
