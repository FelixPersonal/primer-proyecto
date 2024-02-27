const DetalleComprasP = require('../models/detalleComprasP');
const { response } = require('express');

const getDetalleComprasP = async (req, res = response) => {
  try {
    const listDetalleComprasP = await DetalleComprasP.findAll();
    res.json({ listDetalleComprasP });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener la lista de detalles de compras' });
  }
};

const getDetalleCompraP = async (req, res = response) => {
  const { id } = req.params;
  try {
    const detalleCompraP = await DetalleComprasP.findByPk(id);
    if (detalleCompraP) {
      res.json(detalleCompraP);
    } else {
      res.status(404).json({ error: `No se encontró el detalle de compra con ID ${id}` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el detalle de compra' });
  }
};

const putDetalleCompraP = async (req, res = response) => {
  const { id } = req.params;
  const body = req.body;

  try {
    const detalleCompraP = await DetalleComprasP.findByPk(id);

    if (detalleCompraP) {
      await detalleCompraP.update(body);
      res.json({ msg: 'El detalle de compra fue actualizado exitosamente' });
    } else {
      res.status(404).json({ error: `No se encontró el detalle de compra con ID ${id}` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el detalle de compra' });
  }
};

const postDetalleCompraP = async (req, res = response) => {
  const body = req.body;

  try {
    const newDetalleCompraP = await DetalleComprasP.create(body);
    res.json(newDetalleCompraP);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el detalle de compra' });
  }
};

const deleteDetalleCompraP = async (req, res = response) => {
  const { id } = req.params;

  try {
    const detalleCompraP = await DetalleComprasP.findByPk(id);

    if (detalleCompraP) {
      await detalleCompraP.destroy();
      res.json('El detalle de compra fue eliminado exitosamente');
    } else {
      res.status(404).json({ error: `No se encontró el detalle de compra con ID ${id}` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el detalle de compra' });
  }
};

module.exports = {
  getDetalleCompraP,
  getDetalleComprasP,
  postDetalleCompraP,
  putDetalleCompraP,
  deleteDetalleCompraP
};
