import conexion from '../config/database.js';
import Usuario from './usuarioModel.js';
import Perfil from './perfilModel.js';
import Tienda from './tiendaModel.js';
import Producto from './productoModel.js';
import Categoria from './categoriaModel.js';

// Usuario  Perfil (uno a uno)
Usuario.hasOne(Perfil, { foreignKey: 'usuarioId', onDelete: 'CASCADE' });
Perfil.belongsTo(Usuario, { foreignKey: 'usuarioId' });

// Usuario  Tienda (uno a uno)
Usuario.hasOne(Tienda, { foreignKey: 'usuarioId', onDelete: 'CASCADE' });
Tienda.belongsTo(Usuario, { foreignKey: 'usuarioId' });

// Tienda  Producto (uno a muchos)
Tienda.hasMany(Producto, { foreignKey: 'tiendaId', onDelete: 'CASCADE' });
Producto.belongsTo(Tienda, { foreignKey: 'tiendaId' });

// Producto  Categoria (muchos a muchos)
Producto.belongsToMany(Categoria, {
    through: 'ProductoCategorias',
    foreignKey: 'productoId',
    otherKey: 'categoriaId',
    timestamps: false,
});
Categoria.belongsToMany(Producto, {
    through: 'ProductoCategorias',
    foreignKey: 'categoriaId',
    otherKey: 'productoId',
    timestamps: false,
});


export {
    conexion,
    Usuario,
    Perfil,
    Tienda,
    Producto,
    Categoria,
};