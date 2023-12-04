const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/config');

const DetalleProducto = require('./detalleProducto');

const Venta = sequelize.define('ventas', {
  id_ventas: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  id_cita: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Citas',
      key: 'id_cita'
    }
  },

  id_cliente: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
        model: 'clientes',
        key: 'id_cliente'
    }
  },

  id_empleado: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'empleados',
      key: 'id_empleado'
    }
  },

  numeroFactura: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },

  precio: {
    type: DataTypes.DECIMAL(10, 2),
  },

  nombre: {
    type: DataTypes.STRING,
  },

  apellido: {
    type: DataTypes.STRING,
  },

  documento: {
    type: DataTypes.STRING, 
  },

  estado: {
    type: DataTypes.STRING,
    type: DataTypes.ENUM('Pendiente', 'Cancelado'),
    defaultValue: 'Pendiente',
    validate: {
      is: /^[A-Za-z\s]+$/,
    },
  },
},{
  timestamps: true
});

Venta.hasMany(DetalleProducto, {foreignKey: 'id_ventas'});


module.exports = Venta;
