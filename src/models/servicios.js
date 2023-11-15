const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/config');

const Servicios = sequelize.define('servicios', {

    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    valor: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    
});

module.exports = Servicios;
