const { DataTypes } = require ('sequelize');
const { sequelize } = require ('../database/config');

const Abonos = sequelize.define('abonos', {
    id_abonos: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },

    id_ventas: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references:{
            model: 'ventas',
            key: 'id_ventas'
        }
    },

    precio_agregar: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0,
    },

    precio_pendiente: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0,
    },

    nombre: {
        type: DataTypes.STRING,
        allowNull:true
    },

    documento: {
        type: DataTypes.STRING,
        allowNull:true
    }
},{
    sequelize,
    tableName: 'abonos',
    Timestamps: true,
    indexes: [
        {
            name: "abonos_pkey",
            unique: true,
            fields: [
                {name: "id_abonos"},
            ]
        },
    ]
});

module.exports = Abonos;