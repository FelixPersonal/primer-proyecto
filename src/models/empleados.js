const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/config');

const Empleado = sequelize.define('empleados', {
  id_empleado: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nombre: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      is: /^[A-Za-z ]+$/,
    },
  },
  apellido: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      is: /^[A-Za-z ]+$/,
    },  
  },
  correo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      is: /^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/,
    },
  },
  documento: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: {
      args: true,
      msg: 'Este documento ya ha sido registrado en otro empleado.'
    },
    validate: {
      is: /^\d{7,10}$/,
    },
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: false,
    required: true,
    validate: {
      is: /^\d{10}$/,
    },
  },
  estado: {
    type: DataTypes.STRING,
    enum: ['Activo', 'Inactivo'],
    defaultValue: 'Activo',
    validate: {
      is: /^[A-Za-z\s]+$/,
    },
  },
});

Empleado.prototype.toggleEstado = async function () {
  this.estado = this.estado === 'Activo' ? 'Inactivo' : 'Activo';
  await this.save();
};

module.exports = Empleado;
