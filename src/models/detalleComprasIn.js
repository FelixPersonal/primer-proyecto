const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/config");
const Compras = require("./compras");
const Insumos = require("./insumos");

const DetalleComprasIn = sequelize.define(
  "detalleComprasIn",
  {
    id_detalleIn: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_compra: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_insumo: {
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

DetalleComprasIn.belongsTo(Compras, { foreignKey: "id_compra" });
DetalleComprasIn.belongsTo(Insumos, { foreignKey: "id_insumo" });

module.exports = DetalleComprasIn;
