const Compras = require("../models/compras");
const { response } = require("express");
const DetallecomprasP = require("../models/detalleComprasP");
const DetallecomprasIn = require("../models/detalleComprasIn");
const Productos = require("../models/productos");

const getCompras = async (req, res = response) => {
  try {
    const listCompras = await Compras.findAll();
    res.json({ listCompras });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener la lista de compras" });
  }
};

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
    res.status(500).json({ error: "Error al obtener la compra" });
  }
};

const getComprasDetalles = async (req, res = response) => {
  try {
    // Obtener todas las compras
    const compras = await Compras.findAll();

    // Verificar si hay compras
    if (!compras || compras.length === 0) {
      return res.status(404).json({ error: 'No se encontraron compras' });
    }

    // Crear un array para almacenar las compras con sus detalles
    const comprasConDetalles = [];

    // Para cada compra, buscar sus detalles (DetallecomprasP)
    for (const compra of compras) {
      const detallesCompraP = await DetallecomprasP.findAll({
        where: { id_compra: compra.id_compra },
      });

      // Para cada compra, buscar sus detalles (DetallecomprasIn)
      const detallesCompraIn = await DetallecomprasIn.findAll({
        where: { id_compra: compra.id_compra },
      });
      
      // Agregar la compra y sus detalles al array
      comprasConDetalles.push({
        compra,
        detallesCompraP,
        detallesCompraIn,
      });
    }

    // Responder con el array de compras y detalles
    res.json(comprasConDetalles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las compras y sus detalles' });
  }
};



const putCompra = async (req, res = response) => {
  const { id } = req.params;
  const body = req.body;

  try {
    const compra = await Compras.findByPk(id);

    if (compra) {
      await compra.update(body);
      res.json({ msg: "La compra fue actualizada exitosamente" });
    } else {
      res.status(404).json({ error: `No se encontró la compra con ID ${id}` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar la compra" });
  }
};

const cambiarEstadoCompra = async (req, res = response) => {
  const { id } = req.params;
  const { estado } = req.body;

  try {
    const compra = await Compras.findByPk(id);

    if (compra) {
      if (compra.estado !== "Cancelado") {
        // Actualizar solo el campo 'estado'
        await compra.update({ estado: estado });

        // Obtener detalles de compra asociados a esta compra
        const detallesCompra = await DetallecomprasP.findAll({ where: { id_compra: id } });

        // Iterar sobre los detalles de la compra y actualizar productos
        for (const detalle of detallesCompra) {
          const producto = await Productos.findByPk(detalle.id_producto);
          if (producto) {
            // Actualizar precios y stock del producto
            await producto.update({
              precioCosto: producto.precioCosto - detalle.precioUnitario,
              precioVenta: producto.precioVenta - detalle.precioVenta,
              stock: producto.stock - detalle.cantidad
            });
          }
        }

        res.json({ msg: "El estado de la compra fue actualizado" });
      } else {
        res.status(400).json({ error: "La compra ya está marcada como Cancelada" });
      }
    } else {
      res.status(404).json({ error: `No se encontró la compra con ID ${id}` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error al actualizar el estado de la compra",
      Estado: error.message,
    });
  }
};


const postCompra = async (req, res = response) => {
  const body = req.body;

  try {
    const newCompra = await Compras.create(body);
    console.log(newCompra)
    res.json(newCompra);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear la compra" });
  }
};

const deleteCompra = async (req, res = response) => {
  const { id } = req.params;

  try {
    const compra = await Compras.findByPk(id);

    if (compra) {
      await compra.destroy();
      res.json("La compra fue eliminada exitosamente");
    } else {
      res.status(404).json({ error: `No se encontró la compra con ID ${id}` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar la compra" });
  }
};

module.exports = {
  getCompra,
  getCompras,
  getComprasDetalles,
  postCompra,
  putCompra,
  deleteCompra,
  cambiarEstadoCompra,
};
