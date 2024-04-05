const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/config');

const Clientes = sequelize.define('clientes', {

  id_cliente: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  apellido:{
    type:DataTypes.STRING,
    allowNull: false
  },
  documento:{
    type:DataTypes.STRING,
    allowNull: false
  },
  correo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  telefono: {
    type: DataTypes.INTEGER,
    allowNull: false 
  },
  estado: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});


module.exports = Clientes;