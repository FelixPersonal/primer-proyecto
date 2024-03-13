const Producto = require('../models/productos');
const { response } = require('express');
const Proveedores = require('../models/proveedores');


const getProductos = async (req, res = response) => {
    try {
        const productos = await Producto.findAll();
        res.json({ productos });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener elementos de Producto' });
    }
}


const getProductosActivos = async (req, res = response) => {
    try {
        const productos = await Producto.findAll({where: { estado: true}});
        res.json({ productos });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener elementos de productos' });
    }
};

const getProducto = async (req, res = response) => {
    const { id } = req.params;

    try {
        const producto = await Producto.findByPk(id);

        if (producto) {
            res.json(producto);
        } else {
            res.status(404).json({ error: `No se encontró un elemento de Producto con ID ${id}` });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el elemento de Producto' });
    }
}

const putProducto = async (req, res = response) => {
    const { id } = req.params;
    const updatedData = req.body;

    try {
        const producto = await Producto.findByPk(id);

        if (producto) {
            await producto.update(updatedData);
            res.json({
                msg: `El elemento de Producto fue actualizado exitosamente.`
            });
        } else {
            res.status(404).json({ error: `No se encontró un elemento de Producto con ID ${id}` });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el elemento de Producto' });
    }
}

const postProducto = async (req, res = response) => {
    const newEntryData = req.body;

    try {
        const createdProductoItem = await Producto.create(newEntryData);
        res.status(201).json({ message: 'Producto guardado exitosamente', producto: createdProductoItem });
    } catch (error) {
        console.error('Error al crear el producto:', error.message);
        console.error('Stack trace:', error.stack);
        res.status(500).json({ error: 'Error interno al crear el producto' });
    }
}




const deleteProducto = async (req, res = response) => {
    const { id } = req.params;

    try {
        const producto = await Producto.findByPk(id);

        if (producto) {
            await producto.destroy();
            res.json('Elemento de Producto eliminado exitosamente');
        } else {
            res.status(404).json({ error: `No se encontró un elemento de Producto con ID ${id}` });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el elemento de Producto' });
    }
}

const obtenerProveedores = async (req, res = response) => {
    try {
        const proveedores = await Proveedores.findAll();
        res.json({ proveedores });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener elementos de Proveedor' });
    }
}

module.exports = {
    obtenerProveedores,
    getProductosActivos,
    getProducto,
    getProductos,
    postProducto,
    putProducto,
    deleteProducto
};
