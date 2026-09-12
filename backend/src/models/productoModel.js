import { DataTypes } from "sequelize";
import conexion from "../config/database.js";

const Producto = conexion.define(
  "Producto",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    categoria: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    imagen: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    me_gusta: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    no_me_gusta: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    en_oferta: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    es_saludable: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "productos",
    timestamps: true,
  },
);

export default Producto;
