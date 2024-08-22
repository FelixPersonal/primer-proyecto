const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/config');
const Usuario = require('./usuarios'); 


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
      is: /^[A-Za-z0-9 ]+$/,
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
      isEmail: true,
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
      is: /^\d{6,10}$/,
    },
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      is: /^\d{10}$/,
    },
  },
  
 
  foto: {
    type: DataTypes.STRING, 
    allowNull: true, 
  },
  
  
  estado: {
    type: DataTypes.ENUM('Activo', 'Inactivo'),
    defaultValue: 'Activo',
  },
});

Empleado.hasOne(Usuario, { foreignKey: 'id_empleado' }); 


Empleado.prototype.toggleEstado = async function () {
  this.estado = this.estado === 'Activo' ? 'Inactivo' : 'Activo';
  await this.save();
};

module.exports = Empleado;
