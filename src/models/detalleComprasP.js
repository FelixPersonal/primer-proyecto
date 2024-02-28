const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/config");
const Compras = require("./compras");
const Productos = require("./productos");

const DetalleComprasP = sequelize.define(
  "detalleComprasP",
  {
    id_detalleP: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_compra: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_producto: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    precioUnitario: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    precioVenta: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    total: {
      type: DataTypes.FLOAT,
      allowNull: false,
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

DetalleComprasP.belongsTo(Compras, { foreignKey: "id_compra" });
DetalleComprasP.belongsTo(Productos, { foreignKey: "id_producto" });

module.exports = DetalleComprasP;
