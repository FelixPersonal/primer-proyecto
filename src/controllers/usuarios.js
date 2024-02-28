const Usuario = require('../models/usuarios');
const { response } = require('express');
const Rol = require('../models/roles');
const Permiso = require('../models/permisos');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const getUsuarios = async (req, res = response) => {
    try {
        const usuarios = await Usuario.findAll({
            include: {
                model: Rol,
                include: {
                    model: Permiso,
                    as: 'permisos',
                },
            },
        });

        res.json({ usuarios });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
};

const getUsuario = async (req, res = response) => {
    const { id } = req.params;

    try {
        const usuario = await Usuario.findByPk(id);

        if (usuario) {
            res.json(usuario);
        } else {
            res.status(404).json({ error: `No se encontró el usuario con ID ${id}` });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el usuario' });
    }
};

const postUsuario = async (req, res = response) => {
    const newEntryData = req.body;

    if (!newEntryData.contrasena) {
        return res.status(400).json({ error: 'La contraseña no se ha proporcionado correctamente' });
    }

    try {
        // Verificar si se especificó un rol en los datos del nuevo usuario
        if (!newEntryData.id_rol) {
            // Buscar el rol de cliente por nombre y asignar su ID
            let clienteRol = await Rol.findOne({ where: { nombre: 'cliente' } });
            if (!clienteRol) {
                // Si no existe un rol de cliente, asignar un valor predeterminado para el rol de cliente
                clienteRol = await Rol.findOne({ where: { id_rol: 1 } }); // Buscar el rol con ID 1
            }
            newEntryData.id_rol = clienteRol.id_rol;
        }

        const createdUsuarioItem = await Usuario.create(newEntryData);
        res.status(201).json({ message: 'Usuario guardado exitosamente', usuario: createdUsuarioItem });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Error al crear un elemento de Usuario' });
    }
};

const putUsuario = async (req, res = response) => {
    const { id } = req.params;
    const updatedData = req.body;

    try {
        const usuario = await Usuario.findByPk(id);

        if (usuario) {
            await usuario.update(updatedData);
            res.json({ msg: `El elemento de Usuario fue actualizado exitosamente.` });
        } else {
            res.status(404).json({ error: `No se encontró un elemento de Usuario con ID ${id}` });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el elemento de Usuario' });
    }
};

const deleteUsuario = async (req, res = response) => {
    const { id } = req.params;

    try {
        const usuario = await Usuario.findByPk(id);

        if (usuario) {
            await usuario.destroy();
            res.json('Elemento de Usuario eliminado exitosamente');
        } else {
            res.status(404).json({ error: `No se encontró un elemento de usuario con ID ${id}` });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el elemento de usuario' });
    }
};

const actualizarPerfil = async (req, res) => {
    try {
        const { nombre, correo, nuevaContrasena } = req.body;

        // Verifica y decodifica el token de autenticación
        const authorizationHeader = req.headers['authorization'];

        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
            return res.status(401).json({ mensaje: 'Token no válido' });
        }

        const token = authorizationHeader.split(' ')[1];
        const decodedToken = jwt.verify(token, 'secreto-seguro');

        // Busca al usuario por ID (utilizando el ID del token decodificado)
        const usuario = await Usuario.findOne({ where: { nombre_usuario: decodedToken.nombre_usuario } });


        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado', decodedToken });
        }

        // Actualiza los campos del perfil
        usuario.nombre_usuario = nombre || usuario.nombre_usuario;
        usuario.correo = correo || usuario.correo;

        // Actualiza la contraseña si se proporciona una nueva
        if (nuevaContrasena) {
            const hashedContrasena = await bcrypt.hash(nuevaContrasena, 10);
            usuario.contrasena = hashedContrasena;
        }

        // Guarda los cambios en la base de datos
        await usuario.save();

        res.json({ mensaje: 'Perfil actualizado con éxito' });
    } catch (error) {
        console.error('Error al actualizar el perfil:', error);
        res.status(500).json({ mensaje: 'Error al actualizar el perfil' });
    }

   
    
};
const actualizarEstadoUsuario = async (req, res = response) => {
    const { id } = req.params;
    const { estado } = req.body;

    try {
        const usuario = await Usuario.findByPk(id);

        if (usuario) {
            usuario.estado = estado;
            await usuario.save();

            res.json({ mensaje: 'Estado de usuario actualizado correctamente' });
        } else {
            res.status(404).json({ error: `No se encontró un usuario con ID ${id}` });
        }
    } catch (error) {
        console.error('Error al actualizar estado de usuario:', error);
        res.status(500).json({ error: 'Error al actualizar estado de usuario' });
    }
};



module.exports = {
    getUsuario,
    getUsuarios,
    postUsuario,
    putUsuario,
    deleteUsuario,
    actualizarPerfil,
    actualizarEstadoUsuario
};
