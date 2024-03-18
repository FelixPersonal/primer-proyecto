const { response } = require('express');
const Cliente = require('../models/clientes');

const getClientesActivos = async (req, res = response) => {
    try {
        const clientes = await Cliente.findAll({where: { estado: true}});
        res.json({ clientes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener elementos de clientes' });
    }
};

const getClientes = async (req, res = response) => {
    try {
        const listClientes = await Cliente.findAll();
        res.json({ listClientes });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            msg: 'Error al obtener la lista de clientes.',
        });
    }
};

const getCliente = async (req, res = response) => {
    try {
        const { id } = req.params;
        const cliente = await Cliente.findByPk(id);

        if (cliente) {
            res.json(cliente);
        } else {
            res.status(404).json({ msg: `No se encontró el cliente con ID ${id}` });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            msg: 'Error al obtener el cliente.',
        });
    }
};

const putCliente = async (req, res = response) => {
    const { id } = req.params;
    const body = req.body; // Corregido: req en lugar de req.body

    try {
        const cliente = await Cliente.findByPk(id);

        if (cliente) {
            await cliente.update(body);
            res.json({
                msg: 'El cliente fue actualizado exitosamente.',
            });
        } else {
            res.status(404).json({ msg: `No se encontró el cliente con ID ${id}` });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            msg: 'Error al actualizar el cliente.',
        });
    }
};

const postCliente = async (req, res = response) => {
    try {
        const { body } = req;

        const nuevoCliente = await Cliente.create(body);

        res.json({
            msg: 'Se ha creado un nuevo cliente',
            cliente: nuevoCliente,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            msg: 'Error al crear un nuevo cliente.',
        });
    }
};

const deleteCliente = async (req, res = response) => {
    const { id } = req.params;

    try {
        const cliente = await Cliente.findByPk(id);

        if (cliente) {
            await cliente.destroy();
            res.json({ msg: 'El cliente fue eliminado exitosamente.' });
        } else {
            res.status(404).json({ msg: `No se encontró el cliente con ID ${id}` });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            msg: 'Error al eliminar el cliente.',
        });
    }
};

module.exports = {
    getCliente,
    getClientesActivos,
    getClientes,
    postCliente,
    putCliente,
    deleteCliente,
};
