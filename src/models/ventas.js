const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/config');

const DetalleProducto = require('./detalleProducto');
const DetalleServicio = require('./detalleServicio');

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
    allowNull: true,
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

  id_usuario: {
    type: DataTypes.BIGINT,
    allowNull: true,
    references: {
      model: 'usuarios',
      key: 'id_usuario'
    }
  },

  numeroFactura: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },

  precio: {
    type: DataTypes.DOUBLE,
  },

  nombre: {
    type: DataTypes.STRING,
  },

  apellido: {
    type: DataTypes.STRING,
  },

  nombre_empleado: {
    type: DataTypes.STRING,
  },

  documento: {
    type: DataTypes.STRING, 
  },

  estado: {
    type: DataTypes.STRING,
    type: DataTypes.ENUM('Pendiente', 'Pagado'),
    defaultValue: 'Pendiente',
    validate: {
      is: /^[A-Za-z\s]+$/,
    },
  },

  estado_anulado: {
    type: DataTypes.STRING,
    type: DataTypes.ENUM('Activo', 'Inactivo'),
    defaultValue: 'Activo',
    validate: {
      is: /^[A-Za-z\s]+$/,
    },
  },
},{
  timestamps: true
},);

Venta.hasMany(DetalleProducto, {foreignKey: 'id_ventas'});
Venta.hasMany(DetalleServicio, {foreignKey: 'id_ventas'});

Venta.prototype.toggleEstadoAnulado = async function () {
  this.estado_anulado = this.estado_anulado === 'Activo' ? 'Inactivo' : 'Activo';
  await this.save();
};


module.exports = Venta;
