const Proveedores = require('../models/proveedores');
const Producto = require('../models/productos');
const { response } = require('express');

const getProveedores = async (req, res = response) => {
  try {
    const listProveedores = await Proveedores.findAll();
    res.json({ listProveedores });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener la lista de proveedores' });
  }
}

const getProveedoresActivos = async (req, res = response) => {
  try {
    const listProveedores = await Proveedores.findAll({ where: { estado: Activo } });
    res.json({ listProveedores });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener la lista de proveedores' });
  }

}

const getProveedor = async (req, res = response) => {
  const { id } = req.params;
  try {
    const proveedor = await Proveedores.findByPk(id);
    if (proveedor) {
      res.json(proveedor);
    } else {
      res.status(404).json({ error: `No se encontró el proveedor con ID ${id}` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el proveedor' });
  }
}

const getProveedorProductos = async (req, res) => {
  const { id } = req.params;

  try {
      // Obtener el proveedor por su ID
      const proveedor = await Proveedores.findByPk(id);

      if (!proveedor) {
          return res.status(404).json({ error: `No se encontró un proveedor con ID ${id}` });
      }

      // Obtener los productos asociados al proveedor
      const productos = await Producto.findAll({
          where: { id_proveedor: id }, // Ajusta según la estructura de tu modelo
      });

      // Devolver la información del proveedor y sus productos
      res.json({
          proveedor,
          productos,
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener el proveedor y sus productos' });
  }
};


const putProveedor = async (req, res = response) => {
  const { id } = req.params;
  const body = req.body;

  try {
    const proveedor = await Proveedores.findByPk(id);

    if (proveedor) {
      await proveedor.update(body);
      res.json({ msg: 'El proveedor fue actualizado exitosamente' });
    } else {
      res.status(404).json({ error: `No se encontró el proveedor con ID ${id}` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el proveedor' });
  }
}

const cambiarEstadoProveedor = async (req, res = response) => {
  const { id } = req.params;
  const { estado } = req.body;

  try {
    const proveedor = await Proveedores.findByPk(id);

    if (proveedor) {
      // Actualiza solo el campo 'estado'
      await proveedor.update({ estado: estado });
      res.json({ msg: 'El estado de la compra fue actualizado exitosamente' });
    } else {
      res.status(404).json({ error: `No se encontró la compra con ID ${id}` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el estado de la compra', detalle: error.message });
  }
}

const postProveedor = async (req, res = response) => {
  const body = req.body;

  try {
    const newProveedor = await Proveedores.create(body);
    res.json(newProveedor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el proveedor' });
  }
}

const deleteProveedor = async (req, res = response) => {
  const { id } = req.params;

  try {
    const proveedor = await Proveedores.findByPk(id);

    if (proveedor) {
      await proveedor.destroy();
      res.json('El proveedor fue eliminado exitosamente');
    } else {
      res.status(404).json({ error: `No se encontró el proveedor con ID ${id}` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el proveedor' });
  }
}

module.exports = {
  getProveedor,
  getProveedores,
  getProveedoresActivos,
  getProveedorProductos,
  postProveedor,
  putProveedor,
  cambiarEstadoProveedor,
  deleteProveedor
};
