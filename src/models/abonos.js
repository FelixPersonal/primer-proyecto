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

    id_cliente: {
        type: DataTypes.INTEGER, // O el tipo de datos correspondiente para id_cliente
        allowNull: false,
        references:{
            model: 'clientes',
            key: 'id_cliente'
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

    fecha_abono: {
        type: DataTypes.DATE,
        allowNull: true,
    }
},{
    sequelize,
    tableName: 'abonos',
    timestamps: true, // Cambio aquí
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
