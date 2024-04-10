const CitasServicios = require('../models/citas_servicios');
const Citas = require('../models/citas');
const Servicios = require('../models/servicios');
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

const getCitaServicioInfo = async () => {
  try {
    // Obtener todas las relaciones entre citas y servicios
    const listCitasServicios = await CitasServicios.findAll();

    // Crear un array para almacenar la información completa de cada cita y servicio
    const citasServiciosInfo = [];

    // Recorrer cada relación entre cita y servicio
    for (const citaServicio of listCitasServicios) {
      // Obtener el ID de la cita y el ID del servicio
      const { id_cita, id_servicio } = citaServicio;

      // Buscar la información completa de la cita utilizando su ID
      const cita = await Citas.findByPk(id_cita);

      // Buscar la información completa del servicio utilizando su ID
      const servicio = await Servicios.findByPk(id_servicio);

      // Si tanto la cita como el servicio existen, agregar la información al array de resultados
      if (cita && servicio) {
        citasServiciosInfo.push({
          cita: cita,
          servicio: servicio
        });
      }
    }

    // Devolver el array con la información completa de todas las citas y servicios relacionados
    return citasServiciosInfo;
    
  } catch (error) {
    console.error(error);
    return { error: 'Error al obtener la lista de citas de servicios' };
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
  getCitaServicioInfo,
  postCitaServicio,
  putCitaServicio,
  deleteCitaServicio
};
