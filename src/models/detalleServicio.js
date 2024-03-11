const { DataTypes } = require ('sequelize');
const { sequelize } = require('../database/config');

const DetalleServicio = sequelize.define('detalleservicio', {
    id_detalleservicio: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    }, 
    id_servicio: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references:{
            model: 'servicios',
            key: 'id'
        }
    },
    id_ventas: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references:{
            model: 'ventas',
            key: 'id_ventas'
        }
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    valor_venta: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    valor_total: {
        type: DataTypes.DOUBLE,
        allowNull: false
    }
},{
    sequelize,
    tableName: 'detalleservicio',
    Timestamps: true,
    indexes: [
        {
            name: "detalleservicio_pkey",
            unique: true,
            fields: [
                {name: "id_detalleservicio"},
            ]
        },
    ]
});

module.exports = DetalleServicio;