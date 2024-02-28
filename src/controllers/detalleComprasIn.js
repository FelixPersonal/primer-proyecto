const DetalleComprasIn = require('../models/detalleComprasIn');
const Insumos = require('../models/insumos');
const { response } = require('express');

const getDetalleComprasIn = async (req, res = response) => {
  try {
    const listDetalleComprasIn = await DetalleComprasIn.findAll();
    res.json({ listDetalleComprasIn });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener la lista de detalles de compras' });
  }
};

const getDetalleCompraIn = async (req, res = response) => {
  const { id } = req.params;
  try {
    const detalleCompraIn = await DetalleComprasIn.findByPk(id);
    if (detalleCompraIn) {
      res.json(detalleCompraIn);
    } else {
      res.status(404).json({ error: `No se encontró el detalle de compra con ID ${id}` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el detalle de compra' });
  }
};

const putDetalleCompraIn = async (req, res = response) => {
  const { id } = req.params;
  const body = req.body;

  try {
    const detalleCompraIn = await DetalleComprasIn.findByPk(id);

    if (detalleCompraIn) {
      await detalleCompraIn.update(body);
      res.json({ msg: 'El detalle de compra fue actualizado exitosamente' });
    } else {
      res.status(404).json({ error: `No se encontró el detalle de compra con ID ${id}` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el detalle de compra' });
  }
};

const postDetalleCompraIn = async (req, res = response) => {
  const body = req.body;

  try {
    const newDetalleCompraIn = await DetalleComprasIn.create(body);

    const insumo = await Insumos.findByPk(body.id_insumo);

    if (insumo) {
      await insumo.update({
        precio: body.precioUnitario,
        stock: insumo.stock + body.cantidad,
      });
    }
    res.json(newDetalleCompraIn);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el detalle de compra' });
  }
};

const deleteDetalleCompraIn = async (req, res = response) => {
  const { id } = req.params;

  try {
    const detalleCompraIn = await DetalleComprasIn.findByPk(id);

    if (detalleCompraIn) {
      await detalleCompraIn.destroy();
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
  getDetalleCompraIn,
  getDetalleComprasIn,
  postDetalleCompraIn,
  putDetalleCompraIn,
  deleteDetalleCompraIn
};
