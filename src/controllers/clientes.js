const { response } = require('express');
const Cliente = require('../models/clientes');
const Usuario = require('../models/usuarios');
const { enviarCorreo } = require('../controllers/resetPassword');

const enviarAgendaSemana = async (req, res = response) => {
    try {
        // Obtener el cliente por su ID
        const id_cliente = req.params.id;
        const cliente = await Cliente.findByPk(id_cliente);

        if (!cliente) {
            return res.status(404).json({ error: `No se encontró el cliente con ID ${id_cliente}` });
        }

        // Obtener el correo electrónico del cliente
        const correoCliente = cliente.correo;

        console.log('Correo electrónico del cliente:', correoCliente);

        // Construir el mensaje
        const mensaje = `¡Hola ${cliente.nombre}, la agenda de esta semana está habilitada. ¡Ve rápido y separa tu cita!`;

        console.log('Mensaje:', mensaje);

        // Configurar credenciales para el envío del correo
        const credencialesGmail = {
            usuario: 'sionbarbershop5@gmail.com', // Cambiar a tu dirección de correo electrónico
            contrasena: 'rhvs lodh xrbl hoon', // Cambiar a tu contraseña de correo electrónico
        };

        // Enviar correo electrónico al cliente
        await enviarCorreo(correoCliente, 'Agenda de la semana', mensaje, credencialesGmail);

        res.json({ message: 'Correo electrónico enviado correctamente' });
    } catch (error) {
        console.error('Error en enviarAgendaSemana:', error);
        res.status(500).json({ error: error.message || 'Error al enviar el correo electrónico' });
    }
};







//-------------------------------------------------------------

const getAgendaSemanaCliente = async (req, res = response) => {
    try {
        // Obtener el cliente por su ID
        const id_cliente = req.params.id;
        const cliente = await Cliente.findByPk(id_cliente);

        if (!cliente) {
            return res.status(404).json({ error: `No se encontró el cliente con ID ${id_cliente}` });
        }

        // Aquí obtendrías la agenda de la semana del cliente desde algún lugar
        const agendaSemana = obtenerAgendaSemanaCliente(id_cliente);

        res.json({ agendaSemana: agendaSemana });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener la agenda de la semana' });
    }
};



const getClientesActivos = async (req, res = response) => {
    try {
        const clientes = await Cliente.findAll({ where: { estado: true } });
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
        const { nombre, apellido, documento, correo, telefono } = req.body;

        // Crear el cliente
        const nuevoCliente = await Cliente.create({
           
            nombre: nombre,
            apellido: apellido,
            documento: documento,
            correo: correo,
            telefono: telefono
        });

        // Crear el usuario asociado al cliente
        const usuario = await Usuario.create({
            id_rol: 3, // ID del rol "Cliente" en tu base de datos
            nombre_usuario: nombre, // Puedes usar el correo como nombre de usuario
            contrasena: '123456AA', // Puedes establecer una contraseña por defecto
            correo: correo,
            estado: 'Activo',
            // No establecer id_empleado aquí
            id_cliente: nuevoCliente.id_cliente, // Establece la relación con el cliente creado
        });

        res.status(201).json({
            msg: 'Se ha creado un nuevo cliente y su usuario asociado',
            cliente: nuevoCliente,
            usuario: usuario
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            msg: 'Error al crear un nuevo cliente y su usuario asociado.',
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
    enviarCorreo,
    enviarAgendaSemana,
    getAgendaSemanaCliente,
};
