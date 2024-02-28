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
    },
    no_factura: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tipoCompra: {
      type: DataTypes.STRING,
      allowNull: false,
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
