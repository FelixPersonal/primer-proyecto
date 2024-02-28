const { response } = require('express');
const Insumo = require('../models/insumos'); // Cambiado desde 'clientes'

const getInsumos = async (req, res = response) => { // Cambiado desde 'getClientes'
    try {
        const listInsumos = await Insumo.findAll(); // Cambiado desde 'Cliente'
        res.json({ listInsumos });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            msg: 'Error al obtener la lista de insumos.', // Cambiado desde 'clientes'
        });
    }
};

const getInsumo = async (req, res = response) => { // Cambiado desde 'getCliente'
    try {
        const { id } = req.params;
        const insumo = await Insumo.findByPk(id); // Cambiado desde 'Cliente'

        if (insumo) {
            res.json(insumo);
        } else {
            res.status(404).json({ msg: `No se encontró el insumo con ID ${id}` }); // Cambiado desde 'clientes'
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            msg: 'Error al obtener el insumo.', // Cambiado desde 'clientes'
        });
    }
};

const putInsumo = async (req, res = response) => { // Cambiado desde 'putCliente'
    const { id } = req.params;
    const body = req.body;

    try {
        const insumo = await Insumo.findByPk(id); // Cambiado desde 'Cliente'

        if (insumo) {
            await insumo.update(body);
            res.json({
                msg: 'El insumo fue actualizado exitosamente.', // Cambiado desde 'clientes'
            });
        } else {
            res.status(404).json({ msg: `No se encontró el insumo con ID ${id}` }); // Cambiado desde 'clientes'
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            msg: 'Error al actualizar el insumo.', // Cambiado desde 'clientes'
        });
    }
};

const postInsumo = async (req, res = response) => { // Cambiado desde 'postCliente'
    try {
        const { body } = req;

        const nuevoInsumo = await Insumo.create(body); // Cambiado desde 'Cliente'

        res.json({
            msg: 'Se ha creado un nuevo insumo', // Cambiado desde 'clientes'
            insumo: nuevoInsumo,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            msg: 'Error al crear un nuevo insumo.', // Cambiado desde 'clientes'
        });
    }
};

const deleteInsumo = async (req, res = response) => { // Cambiado desde 'deleteCliente'
    const { id } = req.params;

    try {
        const insumo = await Insumo.findByPk(id); // Cambiado desde 'Cliente'

        if (insumo) {
            await insumo.destroy();
            res.json({ msg: 'El insumo fue eliminado exitosamente.' }); // Cambiado desde 'clientes'
        } else {
            res.status(404).json({ msg: `No se encontró el insumo con ID ${id}` }); // Cambiado desde 'clientes'
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            msg: 'Error al eliminar el insumo.', // Cambiado desde 'clientes'
        });
    }
};

module.exports = {
    getInsumo,
    getInsumos,
    postInsumo,
    putInsumo,
    deleteInsumo,
};
