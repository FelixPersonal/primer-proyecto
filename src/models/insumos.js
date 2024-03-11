const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/config');

const Insumo = sequelize.define('Insumo', {
    id_insumo: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    precio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
    },
    estado: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },

});

module.exports = Insumo;
