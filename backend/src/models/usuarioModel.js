import { DataTypes } from 'sequelize';
import conexion from '../config/database.js';


const Usuario = conexion.define('Usuario', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true, 
        validate: {
            isEmail: true, 
        },
    },
    contrasena: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    rol: {
        type: DataTypes.ENUM('cliente', 'comercio'),
        defaultValue: 'cliente',
    },
}, {
    tableName: 'usuarios',
    timestamps: true,
});


export default Usuario;