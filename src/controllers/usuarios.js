const Usuario = require('../models/usuarios');
const { response } = require('express');
const Rol = require('../models/roles');
const Permiso = require('../models/permisos');
const Cliente = require('../models/clientes'); // Importa el modelo Cliente

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const getUsuarios = async (req, res = response) => {
  try {
    const usuarios = await Usuario.findAll({
      include: {
        model: Rol,
        include: {
          model: Permiso,
          as: "permisos",
        },
      },
    });

    res.json({ usuarios });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener usuarios" });
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
    res.status(500).json({ error: "Error al obtener el usuario" });
  }
};

const postUsuario = async (req, res = response) => {
  const newEntryData = req.body;

    console.log('Datos de la nueva entrada:', newEntryData);

    if (!newEntryData.contrasena) {
        return res.status(400).json({ error: 'La contraseña no se ha proporcionado correctamente' });
    }

    try {
      
        // Crear el usuario
        const createdUsuarioItem = await Usuario.create(newEntryData);

        // Verificar si se proporciona el nombre del cliente, de lo contrario, usar el nombre del usuario
        const nombreCliente = newEntryData.nombre || createdUsuarioItem.nombre_usuario;

        // Crear el cliente asociado al usuario
        const nuevoCliente = await Cliente.create({
            id_rol: 3,
            nombre: nombreCliente,
            apellido: newEntryData.apellido || '',
            documento: newEntryData.documento || '',
            correo: newEntryData.correo || createdUsuarioItem.correo,
            telefono: newEntryData.telefono || '',
            estado: true,
            id_usuario: createdUsuarioItem.id_usuario
        });

        res.status(201).json({ message: 'Usuario y cliente guardados exitosamente', usuario: createdUsuarioItem, cliente: nuevoCliente });
    } catch (error) {
        console.error(error);

        // Verificar si el error es debido a un nombre de usuario o correo electrónico duplicado
        if (error.name === 'SequelizeUniqueConstraintError') {
            let errorMessage = '';
            if (error.errors[0].path === 'nombre_usuario') {
                errorMessage = 'El nombre de usuario ya está en uso. Por favor, elige otro nombre.';
            } else if (error.errors[0].path === 'correo') {
                errorMessage = 'El correo electrónico ya está en uso. Por favor, ingresa otro correo.';
            }
            return res.status(400).json({ error: errorMessage });
        }

        res.status(400).json({ error: 'Error al crear un elemento de Usuario' });
    }
};





const putUsuario = async (req, res = response) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res
        .status(404)
        .json({ error: `No se encontró un elemento de Usuario con ID ${id}` });
    }

    // Validar si se está intentando cambiar el nombre de usuario
    if (
      updatedData.nombre_usuario &&
      updatedData.nombre_usuario !== usuario.nombre_usuario
    ) {
      const existingUsername = await Usuario.findOne({
        where: { nombre_usuario: updatedData.nombre_usuario },
      });

      if (existingUsername) {
        return res
          .status(400)
          .json({ error: "El nombre de usuario ya está en uso" });
      }
    }

    // Validar si se está intentando cambiar el correo
    if (updatedData.correo && updatedData.correo !== usuario.correo) {
      const existingEmail = await Usuario.findOne({
        where: { correo: updatedData.correo },
      });

      if (existingEmail) {
        return res
          .status(400)
          .json({ error: "El correo electrónico ya está en uso" });
      }
    }

    await usuario.update(updatedData);
    res.json({ msg: `El elemento de Usuario fue actualizado exitosamente.` });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error al actualizar el elemento de Usuario" });
  }
};

const deleteUsuario = async (req, res = response) => {
  const { id } = req.params;

  try {
    const usuario = await Usuario.findByPk(id);

    if (usuario) {
      await usuario.destroy();
      res.json("Elemento de Usuario eliminado exitosamente");
    } else {
      res
        .status(404)
        .json({ error: `No se encontró un elemento de usuario con ID ${id}` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar el elemento de usuario" });
  }
};

const actualizarPerfil = async (req, res) => {
  try {
    const { nombre, correo, nuevaContrasena } = req.body;

    // Verifica y decodifica el token de autenticación
    const authorizationHeader = req.headers["authorization"];

    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      return res.status(401).json({ mensaje: "Token no válido" });
    }

    const token = authorizationHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, "secreto-seguro");

    // Busca al usuario por ID (utilizando el ID del token decodificado)
    const usuario = await Usuario.findOne({
      where: { nombre_usuario: decodedToken.nombre_usuario },
    });

    if (!usuario) {
      return res
        .status(404)
        .json({ mensaje: "Usuario no encontrado", decodedToken });
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

    res.json({ mensaje: "Perfil actualizado con éxito" });
  } catch (error) {
    console.error("Error al actualizar el perfil:", error);
    if (error.name === "SequelizeUniqueConstraintError") {
      if (error.fields.nombre_usuario) {
        return res
          .status(400)
          .json({ mensaje: "El nombre de usuario ya está en uso" });
      } else if (error.fields.correo) {
        return res
          .status(400)
          .json({ mensaje: "El correo electrónico ya está en uso" });
      }
    }
    res.status(500).json({ mensaje: "Error al actualizar el perfil" });
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

      res.json({ mensaje: "Estado de usuario actualizado correctamente" });
    } else {
      res.status(404).json({ error: `No se encontró un usuario con ID ${id}` });
    }
  } catch (error) {
    console.error("Error al actualizar estado de usuario:", error);
    res.status(500).json({ error: "Error al actualizar estado de usuario" });
  }
};

module.exports = {
  getUsuario,
  getUsuarios,
  postUsuario,
  putUsuario,
  deleteUsuario,
  actualizarPerfil,
  actualizarEstadoUsuario,
};
