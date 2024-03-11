const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/config");
const Proveedor = require("./proveedores");

const Compras = sequelize.define(
  "Compras",
  {
    id_compra: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_proveedor: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "El ID del proveedor es requerido",
        },
        isInt: {
          msg: "El ID del proveedor debe ser un número entero",
        },
      },
    },
    no_factura: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "El número de factura es requerido",
        },
        notEmpty: {
          msg: "El número de factura no puede estar vacío",
        },
      },
    },
    tipoCompra: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "El tipo de compra es requerido",
        },
        notEmpty: {
          msg: "El tipo de compra no puede estar vacío",
        },
      },
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Pendiente"
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: true,
    updatedAt: "updated_at",
    createdAt: "created_at",
  }
);

Compras.belongsTo(Proveedor, { foreignKey: "id_proveedor" });

module.exports = Compras;
