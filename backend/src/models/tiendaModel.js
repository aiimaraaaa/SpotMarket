import { DataTypes } from 'sequelize';
import conexion from '../config/database.js';

const Tienda = conexion.define('Tienda', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    categoria: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            isIn: [['carniceria', 'verduleria', 'fruteria', 'lacteos', 'panaderia', 'bebidas', 'infusiones', 'almacen']]
        }
    },
    direccion: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    whatsapp: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    latitud: {
        type: DataTypes.DOUBLE,
        allowNull: true,
    },
    longitud: {
        type: DataTypes.DOUBLE,
        allowNull: true,
    },
    logo: {
        type: DataTypes.TEXT('long'),
        allowNull: true,
    },
}, {
    tableName: 'tiendas',
    timestamps: true,
});

export default Tienda;