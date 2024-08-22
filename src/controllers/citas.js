const Citas = require('../models/citas');
const { response } = require('express');
const Citas_Servicios = require('../models/citas_servicios');
const Empleado = require('../models/empleados');
const Usuario = require('../models/usuarios');
const Agenda = require('../models/agenda');
const { Op } = require('sequelize');
const { enviarCorreo } = require('../controllers/resetPassword');
const moment = require('moment-timezone');




const getEmpleadoConCitas = async (req, res) => {
  const id_empleado = req.params.id;

  try {
    const empleado = await Empleado.findByPk(id_empleado);

    if (!empleado) {
      return res.status(404).json({ error: `Empleado no encontrado con ID ${id_empleado}` });
    }

    const citas = await Citas.findAll({ where: { id_empleado } });

    res.json({ empleado, citas });
  } catch (error) {
    console.error('Error al obtener el empleado y sus citas:', error);
    res.status(500).json({ error: 'Error al obtener el empleado y sus citas' });
  }
};


const getHorariosDisponibles = async (req, res = response) => {
  const { id_empleado } = req.params;

  try {
    // Obtener la agenda del empleado
    const agenda = await Agenda.findOne({ where: { id_empleado } });
    if (!agenda) {
      return res.status(404).json({ error: 'No se encontró la agenda del empleado' });
    }

    // Obtener el nombre del empleado
    const empleado = await Empleado.findByPk(id_empleado);
    if (!empleado) {
      return res.status(404).json({ error: 'No se encontró al empleado' });
    }

    // Obtener todas las citas futuras agendadas para el empleado a partir de hoy
    const hoy = moment().tz('America/Bogota').startOf('day').toDate();
    const citas = await Citas.findAll({ where: { id_empleado } });

    console.log('Citas:', citas);

    // Calcular los horarios ocupados
    const horariosOcupados = new Set();
    citas.forEach(cita => {
      const fechaAtencion = moment(cita.Fecha_Atencion).tz('America/Bogota').format('YYYY-MM-DD');
      const horaAtencion = moment.tz(cita.Hora_Atencion, 'HH:mm:ss', 'America/Bogota');
      const horaFin = moment.tz(cita.Hora_Fin, 'HH:mm:ss', 'America/Bogota');

      while (horaAtencion.isBefore(horaFin)) {
        const tiempoActual = `${fechaAtencion} ${horaAtencion.format('HH:mm')}`;
        horariosOcupados.add(tiempoActual);

        // Incrementar el tiempo en 30 minutos
        horaAtencion.add(30, 'minutes');
      }

      // Asegurarse de marcar también el final de la cita como ocupado
      const tiempoFin = `${fechaAtencion} ${horaFin.format('HH:mm')}`;
      horariosOcupados.add(tiempoFin);
    });

    console.log('Horarios Ocupados:', Array.from(horariosOcupados));

    // Ajustar los horarios libres a partir del día de hoy
    const horariosDisponibles = [];
    let fechaActual = moment(hoy).tz('America/Bogota'); // Iniciar desde hoy
    const fechaFin = moment(agenda.fechaFin).tz('America/Bogota');

    while (fechaActual.isSameOrBefore(fechaFin)) {
      let hora = parseInt(agenda.horaInicio.split(':')[0], 10);
      let minuto = parseInt(agenda.horaInicio.split(':')[1], 10);
      const horaFinAgenda = parseInt(agenda.horaFin.split(':')[0], 10);
      const minutoFinAgenda = parseInt(agenda.horaFin.split(':')[1], 10);

      while (hora < horaFinAgenda || (hora === horaFinAgenda && minuto <= minutoFinAgenda)) {
        const fecha = fechaActual.format('YYYY-MM-DD');
        const tiempo = `${hora}:${minuto.toString().padStart(2, '0')}`;
        const ocupado = horariosOcupados.has(`${fecha} ${tiempo}`);
        horariosDisponibles.push({ fecha, tiempo, ocupado });

        // Incrementar el tiempo en 30 minutos
        minuto += 30;
        if (minuto >= 60) {
          hora++;
          minuto -= 60;
        }
      }

      // Avanzar al siguiente día
      fechaActual.add(1, 'day');
    }

    // Ordenar los horariosDisponibles por fecha y tiempo
    horariosDisponibles.sort((a, b) => {
      const fechaHoraA = new Date(`${a.fecha}T${a.tiempo}`);
      const fechaHoraB = new Date(`${b.fecha}T${b.tiempo}`);
      return fechaHoraA - fechaHoraB;
    });

    console.log('Horarios Disponibles:', horariosDisponibles);

    // Incluir el nombre del empleado y los nombres de los clientes en la respuesta
    res.json({ Nombre_Empleado: empleado.nombre, citas, horariosDisponibles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los horarios disponibles' });
  }
};




















const getCitas = async (req, res = response) => {
  try {
    const citas = await Citas.findAll({
      attributes: { exclude: [] }, // No excluye ningún campo
    });

    const formattedCitas = citas.map(cita => {

      // Mantener la Fecha_Atencion en su formato original
      const fechaAtencion = moment.utc(cita.Fecha_Atencion).format('YYYY-MM-DD');

      // Convertir Hora_Atencion y Hora_Fin de UTC a 'America/Bogota'
      const horaAtencion = moment.utc(`${fechaAtencion}T${cita.Hora_Atencion}`).tz('America/Bogota').format('HH:mm:ss');
      const horaFin = moment.utc(`${fechaAtencion}T${cita.Hora_Fin}`).tz('America/Bogota').format('HH:mm:ss');

      return {
        id_cita: cita.id_cita,
        id_empleado: cita.id_empleado,
        id_usuario: cita.id_usuario,
        Fecha_Atencion: fechaAtencion,
        Hora_Atencion: horaAtencion,
        Hora_Fin: horaFin,
        estado: cita.estado,
        createdAt: cita.createdAt,
        updatedAt: cita.updatedAt
      };
    });

    res.json({ citas: formattedCitas });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener la lista de citas' });
  }
};









const getCitasAgendadas = async (req, res = response) => {
  try {
    const citas = await Citas.findAll({
      where: { estado: 'Agendada' },
    });
    res.json({ citas });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener la lista de citas' });
  }

}


const getCitasUsuario = async (req, res = response) => {
  const { id_usuario } = req.params;

  try {
    // Verificar si el usuario existe
    const usuario = await Usuario.findByPk(id_usuario);
    if (!usuario) {
      return res.status(404).json({ error: `Usuario no encontrado con ID ${id_usuario}` });
    }

    // Si el usuario es admin, obtener todas las citas
    if (usuario.id_rol === 1) { // Reemplaza id_rol_del_usuario_admin con el ID del rol de administrador
      const citas = await Citas.findAll();
      return res.json({ citas });
    }

    // Obtener todas las citas para el usuario especificado, ya sea como solicitante o como usuario asignado
    const citas = await Citas.findAll({
      where: {
        [Op.or]: [
          { id_usuario: id_usuario }, // Citas asignadas al usuario
          { id_empleado: usuario.id_empleado }, // Citas donde el usuario es el empleado asignado
        ]
      }
    });

    // Verificar si hay citas para el usuario
    if (!citas || citas.length === 0) {
      return res.status(404).json({ error: `No se encontraron citas para el usuario con ID ${id_usuario}` });
    }

    // Responder con las citas encontradas
    res.json({ citas });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las citas del usuario' });
  }
}

const getCitasServcios = async (req, res = response) => {
  try {
    const id_usuario = req.params.id; // Suponiendo que el id_usuario se pasa como parámetro en la solicitud

    // Obtener todas las citas para el id_usuario proporcionado
    const citas = await Citas.findAll({
      where: { id_usuario: id_usuario },
    });

    // Verificar si hay citas para el id_usuario
    if (!citas || citas.length === 0) {
      return res.status(404).json({ error: 'No se encontraron citas para el usuario proporcionado' });
    }

    const citasServicios = [];

    // Iterar sobre cada cita para obtener los servicios asociados
    for (const cita of citas) {
      const citaServicio = await Citas_Servicios.findAll({
        where: { id_cita: cita.id_cita },
      });

      citasServicios.push({
        cita,
        citaServicio,
      });
    }

    res.json(citasServicios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las citas y sus servicios' });
  }
}

const getUsuario = async (req, res = response) => {
  const { id_usuario } = req.params;

  try {
    const usuario = await Usuario.findByPk(id_usuario);

    if (!usuario) {
      return res.status(404).json({ error: `Usuario no encontrado con ID ${id_usuario}` });
    }

    res.json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el usuario' });
  }
}

const getCitasHoy = async (req, res = response) => {
  const { id_usuario } = req.body;
  console.log(id_usuario)
  try {
    const usuario = await Usuario.findOne({
      where: { id_usuario: id_usuario }
    });
    if (!usuario) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    const ultimaCita = await Citas.findOne({
      where: { id_usuario: usuario.id_usuario },
      order: [['Fecha_Atencion', 'DESC']],
    });

    if (!ultimaCita) {
      return res.status(404).json({ error: 'No se encontraron citas para el cliente' });
    }
    res.json(ultimaCita);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener la lista de citas' });
  }
}

const getCita = async (req, res = response) => {
  const { id } = req.params;
  try {
    const cita = await Citas.findByPk(id);
    if (cita) {
      res.json(cita);
    } else {
      res.status(404).json({ error: `No se encontró la cita con ID ${id}` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener la cita' });
  }
}

const putCita = async (req, res = response) => {
  const { id } = req.params;
  const body = req.body;

  try {
    const cita = await Citas.findByPk(id);

    if (cita) {
      await cita.update(body);
      res.json({ msg: 'La cita fue actualizada exitosamente' });
    } else {
      res.status(404).json({ error: `No se encontró la cita con ID ${id}` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar la cita' });
  }
}

const putCitaEstado = async (req, res = response) => {
  const { id } = req.params;
  const body = req.body;

  try {
    const cita = await Citas.findByPk(id);

    if (cita) {
      await cita.update(body);
      res.json({ msg: 'La cita fue actualizada exitosamente' });
    } else {
      res.status(404).json({ error: `No se encontró la cita con ID ${id}` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar la cita' });
  }
}

const CancelarCita = async (req, res) => {
  const { id_cita } = req.params;

  try {
    // Obtener la cita que se va a cancelar
    const cita = await Citas.findByPk(id_cita);
    if (!cita) {
      console.log('No se encontró la cita con el ID proporcionado');
      return res.status(404).json({ error: 'Cita no encontrada' });
    }

    // Actualizar el estado de la cita a "Cancelada"
    await cita.update({ estado: 'Cancelada' });

    // Obtener el usuario correspondiente a la cita
    const usuario = await Usuario.findByPk(cita.id_usuario);
    if (!usuario) {
      console.log('No se encontró el usuario asociado a la cita');
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Obtener el empleado correspondiente a la cita
    const empleado = await Empleado.findByPk(cita.id_empleado);
    if (!empleado) {
      console.log('No se encontró el empleado asociado a la cita');
      return res.status(404).json({ error: 'Empleado no encontrado' });
    }

    // Construir el contenido del correo de cancelación
    const mensajeCorreo = `¡Hola ${usuario.nombre_usuario}!,

Lamentablemente, tu cita con ${empleado.nombre} ha sido cancelada. Te invitamos a que te pongas en contacto con él para reprogramar tu cita. Puedes comunicarte con él llamando al número ${empleado.telefono}.

¡Gracias por tu comprensión!

Atentamente,
El equipo de Sion Barber Shop`;

    // Configurar credenciales para el envío del correo
    const credencialesGmail = {
      usuario: 'sionbarbershop5@gmail.com',
      contrasena: 'rhvs lodh xrbl hoon',
    };

    // Enviar correo electrónico de cancelación al usuario
    await enviarCorreo(usuario.correo, 'Cancelación de Cita', mensajeCorreo, credencialesGmail);

    console.log('Correo de cancelación enviado correctamente al usuario');
    res.status(200).json({ message: 'Cita cancelada y correo enviado correctamente' });
  } catch (error) {
    console.error('Error al cancelar la cita:', error);
    res.status(500).json({ error: 'No se pudo cancelar la cita' });
  }
};




const TomarCita = async (req, res) => {
  const { id_cita } = req.params;
  console.log('ID de la cita a tomar:', id_cita);

  try {
    // Obtener la cita que se va a tomar
    const cita = await Citas.findByPk(id_cita);
    if (!cita) {
      console.log('No se encontró la cita con el ID proporcionado');
      return res.status(404).json({ error: 'Cita no encontrada' });
    }

    // Obtener el usuario correspondiente a la cita
    const usuario = await Usuario.findByPk(cita.id_usuario);
    if (!usuario) {
      console.log('No se encontró el usuario asociado a la cita');
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Obtener el empleado correspondiente a la cita
    const empleado = await Empleado.findByPk(cita.id_empleado);
    if (!empleado) {
      console.log('No se encontró el empleado asociado a la cita');
      return res.status(404).json({ error: 'Empleado no encontrado' });
    }

    // Formatear fecha y hora
    const fechaFormateada = moment(cita.Fecha_Atencion).format('DD [de] MMMM [de] YYYY');
    const horaFormateada = moment(cita.Hora_Atencion, 'HH:mm:ss').format('hh:mm A');

    // Construir el contenido del correo de confirmación de toma de cita
    const mensajeCorreo = `¡Hola ${usuario.nombre_usuario}!,

Tu cita con ${empleado.nombre} ha sido confirmada. Por favor, asegúrate de llegar a tiempo. Tu cita está programada para el ${fechaFormateada} a las ${horaFormateada}.

¡Gracias por tu preferencia!

Atentamente,
El equipo de Sion Barber Shop`;

    // Configurar credenciales para el envío del correo
    const credencialesGmail = {
      usuario: 'sionbarbershop5@gmail.com',
      contrasena: 'rhvs lodh xrbl hoon',
    };

    // Enviar correo electrónico de confirmación al usuario
    await enviarCorreo(usuario.correo, 'Confirmación de Cita', mensajeCorreo, credencialesGmail);

    // Actualizar el estado de la cita a "Tomada"
    await cita.update({ estado: 'Confirmada' });

    console.log('Correo de confirmación enviado correctamente al usuario');
    res.status(200).json({ message: 'Cita confirmada y correo enviado correctamente' });
  } catch (error) {
    console.error('Error al confirmar la cita:', error);
    res.status(500).json({ error: 'No se pudo confirmar la cita' });
  }
};













const postCita = async (req, res = response) => {
  console.log('Entrando en la función postCita');
  // Establecer el encabezado Content-Type


  const body = req.body;

  try {
    console.log('Creando la nueva cita...');
    // Crear la nueva cita
    const newCita = await Citas.create(body);

    console.log('Cita creada exitosamente');

    // Obtener el usuario correspondiente al id_usuario proporcionado en la cita
    const usuario = await Usuario.findByPk(body.id_usuario);
    if (!usuario) {
      console.log('No se encontró el usuario con el ID proporcionado');
      return res.status(404).json({ error: 'No se encontró el usuario con el ID proporcionado' });
    }

    // Obtener el nombre del usuario, su correo y su número de teléfono
    const nombreUsuario = usuario.nombre_usuario;
    const correoUsuario = usuario.correo;
    const telefonoUsuario = usuario.telefono; // Suponiendo que el usuario tiene un campo de número de teléfono

    console.log('Obteniendo información del empleado...');
    // Obtener el empleado asociado a la cita para obtener su nombre, correo y otros detalles
    const empleado = await Empleado.findByPk(body.id_empleado);
    if (!empleado) {
      console.log('No se encontró el empleado asociado a la cita');
      return res.status(404).json({ error: 'No se encontró el empleado asociado a la cita' });
    }

    // Obtener los detalles del empleado
    const nombreEmpleado = empleado.nombre;
    const correoEmpleado = empleado.correo; // Asumiendo que el empleado tiene un campo de correo electrónico
    const telefonoEmpleado = empleado.telefono;

    console.log('Construyendo contenido del correo...');
    // Construir el contenido del correo con los detalles de la cita y los detalles del empleado
    const mensajeCorreoUsuario = `¡Hola ${nombreUsuario}!,

Estos son los detalles de tu cita:
- Barbero Elegido: ${nombreEmpleado}
- Fecha de Atención: ${body.Fecha_Atencion}
- Hora de Atención: ${body.Hora_Atencion}
- Hora Fin: ${body.Hora_Fin}

NOTA: Recuerda llegar 15 min antes. Si deseas cancelar tu cita debe ser con 1 hora de anticipación para que otro cliente pueda usar el turno que tú ya no necesitas. El número de cancelación es: ${telefonoEmpleado}.
¡Muchas gracias! 👋
`;

    const mensajeCorreoEmpleado = `¡Hola ${nombreEmpleado}!,

Has sido asignado como barbero para una nueva cita. Aquí están los detalles:
- Cliente: ${nombreUsuario}
- Fecha de Atención: ${body.Fecha_Atencion}
- Hora de Atención: ${body.Hora_Atencion}
- Hora Fin: ${body.Hora_Fin}
- Nota: Si por alguna urgencia necesitas cancelar la cita con ${nombreUsuario}, nos gustaría que se lo hagas saber con tiempo llamando al ${telefonoUsuario}.
¡Muchas gracias! 👋
`;

    console.log('Configurando credenciales para el envío del correo...');
    // Configurar credenciales para el envío del correo
    const credencialesGmail = {
      usuario: 'sionbarbershop5@gmail.com',
      contrasena: 'rhvs lodh xrbl hoon',
    };

    console.log('Enviando correo electrónico al usuario y al empleado...');
    // Enviar correo electrónico al usuario y al empleado
    await enviarCorreo(correoUsuario, 'Detalles de la cita', mensajeCorreoUsuario, credencialesGmail);
    await enviarCorreo(correoEmpleado, 'Detalles de la cita', mensajeCorreoEmpleado, credencialesGmail);




    `;

`;


    console.log('Respondiendo con la nueva cita...');
    // Responder con la nueva cita
    res.json(newCita);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear la cita' });
  }
};






















const deleteCita = async (req, res = response) => {
  const { id } = req.params;

  try {
    const cita = await Citas.findByPk(id);

    if (cita) {
      await cita.destroy();
      res.json('La cita fue eliminada exitosamente');
    } else {
      res.status(404).json({ error: `No se encontró la cita con ID ${id}` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar la cita' });
  }
}

module.exports = {
  getCita,
  getCitas,
  getCitasAgendadas,
  getCitasServcios,
  getCitasHoy,
  CancelarCita,
  postCita,
  putCita,
  putCitaEstado,
  deleteCita,
  getEmpleadoConCitas,
  getCitasUsuario,
  TomarCita,
  getHorariosDisponibles,
  getUsuario,

};
