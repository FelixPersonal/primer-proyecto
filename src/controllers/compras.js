const Compras = require('../models/compras');
const { response } = require('express');
const DetallecomprasP = require('../models/detalleCompras');
const DetallecomprasIn = require('../models/detalleComprasIn');

const getCompras = async (req, res = response) => {
  try {
    const listCompras = await Compras.findAll();
    res.json({ listCompras });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener la lista de compras' });
  }
}

const getCompra = async (req, res = response) => {
  const { id } = req.params;
  try {
    const compra = await Compras.findByPk(id);
    if (compra) {
      res.json(compra);
    } else {
      res.status(404).json({ error: `No se encontró la compra con ID ${id}` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener la compra' });
  }
}

const getDetalleComprasP = async (req, res = response) => {
  const { idCompra } = req.params;
  try {
    const detalles = await DetallecomprasP.findAll({ 
      where: { id_compra: idCompra },
      include: [{ model: Compras, where: { id: idCompra } }] // Incluir datos de la compra asociada filtrando por el idCompra
    });
    res.json(detalles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los detalles de la compra de productos' });
  }
}

const getDetalleComprasIn = async (req, res = response) => {
  const { idCompra } = req.params;
  try {
    const detalles = await DetallecomprasIn.findAll({ 
      where: { id_compra: idCompra },
      include: [{ model: Compras, where: { id: idCompra } }] // Incluir datos de la compra asociada filtrando por el idCompra
    });
    res.json(detalles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los detalles de la compra de insumos' });
  }
}

const putCompra = async (req, res = response) => {
  const { id } = req.params;
  const body = req.body;

  try {
    const compra = await Compras.findByPk(id);

    if (compra) {
      await compra.update(body);
      res.json({ msg: 'La compra fue actualizada exitosamente' });
    } else {
      res.status(404).json({ error: `No se encontró la compra con ID ${id}` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar la compra' });
  }
}

const cambiarEstadoCompra = async (req, res = response) => {
  const { id } = req.params;
  const { estado } = req.body;

  try {
    const compra = await Compras.findByPk(id);

    if (compra) {
      // Verificar si el estado actual es diferente de "Pagado"
      if (compra.estado !== 'Pagado') {
        // Actualizar solo el campo 'estado'
        await compra.update({ estado: estado });

        res.json({ msg: 'El estado de la compra fue actualizado' });
      } else {
        res.status(400).json({ error: 'La compra ya está marcada como Pagada' });
      }
    } else {
      res.status(404).json({ error: `No se encontró la compra con ID ${id}` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el estado de la compra', Estado: error.message });
  }
};

const postCompra = async (req, res = response) => {
  const body = req.body;

  try {
    const newCompra = await Compras.create(body);
    res.json(newCompra);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear la compra' });
  }
}


const deleteCompra = async (req, res = response) => {
  const { id } = req.params;

  try {
    const compra = await Compras.findByPk(id);

    if (compra) {
      await compra.destroy();
      res.json('La compra fue eliminada exitosamente');
    } else {
      res.status(404).json({ error: `No se encontró la compra con ID ${id}` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar la compra' });
  }
}

module.exports = {
  getCompra,
  getCompras,
  getDetalleComprasP,
  getDetalleComprasIn,
  postCompra,
  putCompra,
  deleteCompra,
  cambiarEstadoCompra
};
