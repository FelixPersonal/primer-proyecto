const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/config');
const { Op } = require('sequelize');


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
        async fechaHoraUnica() {
            // Validar solo si el evento está habilitado
            if (this.estado) {
                const eventos = await Agenda.findAll({
                    where: {
                        id_empleado: this.id_empleado,
                        estado: true,
                        id_agenda: { [Op.ne]: this.id_agenda } // Excluir el evento actual
                    }
                });
    
                for (const evento of eventos) {
                    if (
                        // Verificar si las fechas se superponen
                        (this.fechaInicio >= evento.fechaInicio && this.fechaInicio < evento.fechaFin) ||
                        (this.fechaFin > evento.fechaInicio && this.fechaFin <= evento.fechaFin) ||
                        (this.fechaInicio <= evento.fechaInicio && this.fechaFin >= evento.fechaFin)
                    ) {
                        // Verificar si las horas se superponen
                        if (
                            (this.horaInicio >= evento.horaInicio && this.horaInicio < evento.horaFin) ||
                            (this.horaFin > evento.horaInicio && this.horaFin <= evento.horaFin) ||
                            (this.horaInicio <= evento.horaInicio && this.horaFin >= evento.horaFin)
                        ) {
                            throw new Error('Ya existe un evento que se superpone en fechas y horas para este empleado.');
                        }
                    }
                }
            }
        }
    }
    

});

Agenda.belongsTo(Empleado, { foreignKey: 'id_empleado' });

module.exports = Agenda;
