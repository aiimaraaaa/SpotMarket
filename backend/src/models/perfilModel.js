import { DataTypes } from "sequelize";
import conexion from "../config/database.js";

const Perfil = conexion.define(
  "Perfil",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    dni: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: true,
    },
    telefono: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    direccion: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    fecha_nacimiento: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
  },
  {
    tableName: "perfiles",
    timestamps: true,
  },
);

export default Perfil;
