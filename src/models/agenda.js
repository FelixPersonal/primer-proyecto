const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/config');

const Empleado = require('./empleados');

const Agenda = sequelize.define('Agendas', {
    id_agenda: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_empleado: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    motivo: {
        type: DataTypes.TEXT,
    },
    fechaInicio: {
        type: DataTypes.DATE,
    },
    fechaFin: {
        type: DataTypes.DATE,
    },
    horaInicio: {
        type: DataTypes.TIME,
    },
    horaFin: {
        type: DataTypes.TIME,
    },
    estado: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    indexes: [
        {
            unique: true,
            fields: ['fechaInicio', 'fechaFin', 'horaInicio', 'horaFin', 'id_empleado'],
            where: {
                estado: true // Only consider active events
            }
        }
    ],
    validate: {
        fechaHoraUnica() {
            // Validar solo si el evento está habilitado
            if (this.estado) {
                return Agenda.findOne({
                    where: {
                        id_empleado: this.id_empleado,
                        fechaInicio: this.fechaInicio,
                        fechaFin: this.fechaFin,
                        horaInicio: this.horaInicio,
                        horaFin: this.horaFin,
                        estado: true
                    }
                }).then(eventoExistente => {
                    if (eventoExistente) {
                        throw new Error('Ya existe un evento con las mismas fechas y horas para este empleado.');
                    }
                });
            }
        }
    }
});

Agenda.belongsTo(Empleado, { foreignKey: 'id_empleado' });

module.exports = Agenda;
