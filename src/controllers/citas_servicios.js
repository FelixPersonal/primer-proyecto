const CitasServicios = require('../models/citas_servicios');
const { response } = require('express');

const getCitasServicios = async (req, res = response) => {
  try {
    const listCitasServicios = await CitasServicios.findAll();
    res.json(listCitasServicios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener la lista de citas de servicios' });
  }
}

const getCitaServicio = async (req, res = response) => {
  const { id } = req.params;
  try {
    const citaServicio = await CitasServicios.findAll({
      where: { id_cita: id }
    });
    if (citaServicio) {
      res.json(citaServicio);
    } else {
      res.status(404).json({ error: `No se encontró la cita de servicio con ID ${id}` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener la cita de servicio' });
  }
}

const putCitaServicio = async (req, res = response) => {
  const { id } = req.params;
  const body = req.body;

  try {
    const citaServicio = await CitasServicios.findByPk(id);

    if (citaServicio) {
      await citaServicio.update(body);
      res.json({ msg: 'La cita de servicio fue actualizada exitosamente' });
    } else {
      res.status(404).json({ error: `No se encontró la cita de servicio con ID ${id}` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar la cita de servicio' });
  }
}

const postCitaServicio = async (req, res = response) => {
  const body = req.body;

  try {
    const newCitaServicio = await CitasServicios.create(body);
    res.json(newCitaServicio);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear la cita de servicio' });
  }
}

const deleteCitaServicio = async (req, res = response) => {
  const { id } = req.params;

  try {
    const citaServicio = await CitasServicios.findByPk(id);

    if (citaServicio) {
      await citaServicio.destroy();
      res.json('La cita de servicio fue eliminada exitosamente');
    } else {
      res.status(404).json({ error: `No se encontró la cita de servicio con ID ${id}` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar la cita de servicio' });
  }
}

module.exports = {
  getCitaServicio,
  getCitasServicios,
  postCitaServicio,
  putCitaServicio,
  deleteCitaServicio
};
