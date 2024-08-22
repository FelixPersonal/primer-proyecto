const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/config');

const Usuario = require('./usuarios');
const Empleados = require('./empleados');

const Citas = sequelize.define('Citas', {
  id_cita: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  id_empleado: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Empleados,
      key: 'id_empleado'
    },
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE'
  },
  id_usuario: {
    type: DataTypes.INTEGER,  // Asegúrate de que este tipo coincida con el tipo de la llave primaria en Usuario
    allowNull: false,
    references: {
      model: Usuario,
      key: 'id_usuario'
    },
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE'
  },
  Fecha_Atencion: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  Hora_Atencion: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  Hora_Fin: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  estado: {
    type: DataTypes.ENUM('Agendada', 'Confirmada', 'Cancelada'),
    allowNull: false,
    defaultValue: 'Agendada'
  },
});

// Vincular las llaves foráneas
Citas.belongsTo(Empleados, { foreignKey: 'id_empleado', as: 'empleados' });
Citas.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });

module.exports = Citas;
