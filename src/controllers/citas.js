const Citas = require('../models/citas');
const Clientes = require('../models/clientes');
const { response } = require('express');
const Citas_Servicios = require('../models/citas_servicios');
const Usuario = require('../models/usuarios');

const getCitas = async (req, res = response) => {
  try {
    const listCitas = await Citas.findAll();
    res.json({ listCitas });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener la lista de citas' });
  }
}

const getCitasAgendadas = async (req, res = response) => {
  try {
    const listCitas = await Citas.findAll({
      where: { estado: 'Agendada' },
    });
    res.json({ listCitas });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener la lista de citas' });
  }

}

const getCitasServcios = async (req, res = response) => {
  try {
    const id_usuario  = req.params.id; // Suponiendo que el id_usuario se pasa como parámetro en la solicitud

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
  
const getCitasHoy = async (req, res = response) => {
  const { id_usuario } = req.body;
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

const postCita = async (req, res = response) => {
  const body = req.body;

  try {
    const newCita = await Citas.create(body);
    res.json(newCita);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear la cita' });
  }
}

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
  postCita,
  putCita,
  putCitaEstado,
  deleteCita,
};
