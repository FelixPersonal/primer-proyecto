const { DataTypes } = require ('sequelize');
const { sequelize } = require('../database/config');

const DetalleProducto = sequelize.define('detalleproducto', {
    id_detalleproducto: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    }, 
    id_ventas: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model: 'ventas',
            key: 'id_ventas'
        }
    },
    id_producto: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model: 'productos',
            key: 'id_producto'
        }
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
    tableName: 'detalleproducto',
    Timestamps: true,
    indexes: [
        {
            name: "detalleproducto_pkey",
            unique: true,
            fields: [
                {name: "id_detalleproducto"},
            ]
        },
    ]
});

module.exports = DetalleProducto;