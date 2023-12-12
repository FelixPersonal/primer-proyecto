const Citas = require('../models/citas');
const { response } = require('express');
const Citas_Servicios = require('../models/citas_servicios');

const getCitas = async (req, res = response) => {
  try {
    const listCitas = await Citas.findAll();
    res.json({ listCitas });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener la lista de citas' });
  }
}

const getCitasServcios = async (req, res = response) => {
  try {
    // Obtener todas las compras
    const citas = await Citas.findAll();

    // Verificar si hay compras
    if (!citas || citas.length === 0) {
      return res.status(404).json({ error: 'No se encontraron citas' });
    }

    const citasServicios = [];

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
};

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
  getCitasServcios,
  postCita,
  putCita,
  putCitaEstado,
  deleteCita
};
