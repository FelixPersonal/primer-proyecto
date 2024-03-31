const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/config');

const Productos = sequelize.define('productos', {
  id_producto: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      msg: 'Ya existe un producto con este nombre',
    },
    set(value) {
      this.setDataValue('nombre', value.trim().toLowerCase()); // Normalizar y convertir a minúsculas
    },
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  precioCosto: {
    type: DataTypes.DOUBLE,
    allowNull: true,
    defaultValue: 0,
  },
  precioVenta: {
    type: DataTypes.DOUBLE,
    allowNull: true,
    defaultValue: 0,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  tipoCompra: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'El tipo de compra es requerido',
      },
      notEmpty: {
        msg: 'El tipo de compra no puede estar vacío',
      },
    },
  },
  estado: {
    type: DataTypes.ENUM('Activo', 'Inactivo'),
    defaultValue: 'Activo',
  },
});

module.exports = Productos;
