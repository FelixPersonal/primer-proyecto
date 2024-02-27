const jwt = require('jsonwebtoken');
const { sequelize } = require('../database/config');
const Usuario = require('../models/usuarios');
const Rol = require('../models/roles');
const Permiso = require ('../models/permisos')
const { response } = require('express');
const bcrypt = require('bcrypt');

async function iniciarSesion(req, res = response) {
  const { nombre_usuario, contrasena } = req.body;

  try {
    // Verificar la conexión a la base de datos
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');

    const usuarioEncontrado = await Usuario.findOne({
      where: { nombre_usuario },
      include: {
        model: Rol,
        include: {
          model: Permiso,
          as: 'permisos', // Alias definido en la relación muchos a muchos
        },
      },
    });

    // Verificar si se encontró al usuario
    if (!usuarioEncontrado) {
      res.status(401).json({ mensaje: 'Usuario no encontrado' });
      return;
    }

    // Verificar la contraseña del usuario
    if (bcrypt.compareSync(contrasena, usuarioEncontrado.contrasena)) {
      // Verificar el estado del usuario
      if (usuarioEncontrado.estado === 'Inactivo') {
        res.status(403).json({ mensaje: 'Usuario inactivo, no puede iniciar sesión' });
        return;
      }
      
      if (usuarioEncontrado.Rol.estado === 'Inactivo') {
        res.status(403).json({ mensaje: 'Rol inactivo, no se puede iniciar sesión' });
        return;
      }


      // Formatear la respuesta
      const usuarioFormateado = {
        userId: usuarioEncontrado.id_usuario,
        nombre_usuario: usuarioEncontrado.nombre_usuario,
        rol: usuarioEncontrado.Rol ? { // Verificar si el usuario tiene un rol asignado
          id_rol: usuarioEncontrado.Rol.id_rol,
          nombre: usuarioEncontrado.Rol.nombre,
          estado: usuarioEncontrado.Rol.estado,
          permisos: usuarioEncontrado.Rol.permisos ? usuarioEncontrado.Rol.permisos.map(permiso => ({
            id_permiso: permiso.id_permiso,
            nombre_permiso: permiso.nombre_permiso,
            ruta: permiso.ruta,
          })) : [],
        } : null,
        correo: usuarioEncontrado.correo,
        created_at: usuarioEncontrado.created_at,
        updated_at: usuarioEncontrado.updated_at,
        estado: usuarioEncontrado.estado,
        // Puedes incluir más campos según tus necesidades
      };

      // Generar un token con la información del usuario formateado
      const token = generarToken(usuarioFormateado);

      res.json({
        token,
        usuario: usuarioFormateado,
      });
    } else {
      res.status(401).json({ mensaje: 'Contraseña incorrecta' });
    }
  } catch (error) {
    // Manejo de errores internos del servidor
    console.error('Error al buscar el usuario:', error);

    // Verificar si el error es específico de Sequelize
    if (error.name === 'SequelizeDatabaseError') {
      // Manejar errores específicos de la base de datos
      res.status(500).json({ mensaje: 'Error en la base de datos' });
    } else {
      // Otros errores internos del servidor
      res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
  }
}






// Nueva función para generar token de restablecimiento
function generarToken(usuario, tipoToken) {
  const { id_usuario, nombre_usuario, rol } = usuario;

  // Define la duración del token de restablecimiento (por ejemplo, 1 día)
  const duracionTokenReset = '1d';

  if (tipoToken === 'reset') {
    return jwt.sign({ userId: id_usuario, tipo: 'reset' }, 'secreto-seguro', { expiresIn: duracionTokenReset });
  }

  return jwt.sign({ nombre_usuario, userId: id_usuario, rol }, 'secreto-seguro', { expiresIn: '24h' });
}
//

module.exports = {
  iniciarSesion,
  generarToken
};
