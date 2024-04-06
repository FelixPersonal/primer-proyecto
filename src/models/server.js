const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const http = require('http');
const socketIO = require('socket.io');
const authController = require('../controllers/authController');
const recuperarContrasena = require('../controllers/resetPassword');
const solicitarRestablecimiento = require('../controllers/resetPassword');
const editarPerfil = require('../controllers/usuarios');
const Rol = require('./roles');
const Usuario = require('../models/usuarios');
const Permiso = require('./permisos');
const RolPermiso = require('../models/rolPermiso');


class Server {
  constructor() {
    this.app = express();
    this.app.use(bodyParser.json());

    this.port = process.env.PORT || 8095;
    this.path = '/api';
    this.middlewares();
    this.routes();
    this.createServer();
    this.sockets();
    this.inicializarBaseDeDatos();
  }

  createServer() {
    this.server = http.createServer(this.app);
  }

  listen() {
    this.server.listen(this.port, () => {
      console.log(`Está escuchando por el puerto ${this.port}`);
    });
  }

  middlewares() {
    const corsOptions = {
      origin: 'http://localhost:3001',
      credentials: true,
    };

    this.app.use(cors(corsOptions));
    this.app.use(express.static(__dirname + '/public'));
    this.app.use(bodyParser.json());
  }

  async inicializarBaseDeDatos() {
    try {
      // Verificar si existen roles, usuarios y permisos en la base de datos
      const cantidadRoles = await Rol.count();
      const cantidadUsuarios = await Usuario.count();
      const cantidadPermisos = await Permiso.count();

      // Si no hay ningún rol, crea uno automáticamente
      if (cantidadRoles === 0) {
        await Rol.create({
          nombre: 'SuperAdmin',
          estado: 'Activo',
        }),
        await Rol.create({
          nombre: 'Cliente',
          estado: 'Activo',

        }),
        await Rol.create({
          nombre: 'Empleado',
          estado: 'Activo',

        })


        console.log('Se ha creado el rol por defecto.');
      }

      // Si no hay ningún permiso, crea los permisos por defecto
      if (cantidadPermisos === 0) {
        const permisos = [
          { nombre_permiso: 'Dashboard', ruta: '/dashboard' },
          { nombre_permiso: 'Agenda', ruta: '/agendas/crearconfiguracion' },
          { nombre_permiso: 'Ventas', ruta: '/ventas' },
          { nombre_permiso: 'Proveedores', ruta: '/proveedores' },
          { nombre_permiso: 'Productos', ruta: '/productos' },
          { nombre_permiso: 'Clientes', ruta: '/clientes/listaClientes' },
          { nombre_permiso: 'Servicios', ruta: '/servicios' },
          { nombre_permiso: 'Empleados', ruta: '/empleados' },
          { nombre_permiso: 'Compras', ruta: '/compras' },
          { nombre_permiso: 'Roles', ruta: '/listarol' },
          { nombre_permiso: 'Usuarios', ruta: '/listausuarios' },
        ];

        await Permiso.bulkCreate(permisos);
        console.log('Se han creado los permisos por defecto.');
      }

      // Si no hay ningún usuario, crea el usuario por defecto
      if (cantidadUsuarios === 0) {
        // Crear usuario por defecto
        const usuarioPorDefecto = await Usuario.create({
          id_rol: 1,
          nombre_usuario: 'Admin',
          contrasena: '12345678S',
          correo: 'sionbarbershop5@gmail.com',
          estado: 'Activo',

          
        });

        console.log('Se ha creado el usuario por defecto.');

        // Obtener todos los permisos disponibles de la base de datos
        const permisos = await Permiso.findAll();

        // Asignar todos los permisos al usuario creado
        await usuarioPorDefecto.setPermisos(permisos);



        console.log('Se han asignado todos los permisos al usuario por defecto.');

        // Registrar los permisos en la tabla intermedia RolPermiso
        await Promise.all(permisos.map(async (permiso) => {
          await RolPermiso.create({
            id_rol: usuarioPorDefecto.id_rol,
            id_permiso: permiso.id_permiso,
          });
        }));

        console.log('Se han registrado los permisos en la tabla intermedia.');
      }
    } catch (error) {
      console.error('Error al inicializar la base de datos:', error);
    }
  }





  routes() {

    this.app.post(`${this.path}/login`, authController.iniciarSesion);

    this.app.post(`${this.path}/cambiar-contrasena`, recuperarContrasena.cambiarContrasena);
    this.app.post(`${this.path}/solicitar-restablecimiento`, solicitarRestablecimiento.solicitarRestablecimiento);
    this.app.post(`${this.path}/actualizarPerfil`, editarPerfil.actualizarPerfil);

    this.app.post(this.path, require('../routes/permisos'));
    this.app.post(this.path, require('../routes/roles'))
    this.app.post(this.path, require('../routes/usuarios'))


    this.app.use(this.path, require('../routes/roles'))
    this.app.use(this.path, require('../routes/usuarios'))
    this.app.use(this.path, require('../routes/permisos'))
    this.app.use(this.path, require('../routes/ventas'))
    this.app.use(this.path, require('../routes/productos'))
    this.app.use(this.path, require('../routes/agenda'))
    this.app.use(this.path, require('../routes/citas'))
    this.app.use(this.path, require('../routes/compras'))
    this.app.use(this.path, require('../routes/registroFacial'))
    this.app.use(this.path, require('../routes/proveedores'))
    this.app.use(this.path, require('../routes/insumos'))
    this.app.use(this.path, require('../routes/clientes'))
    this.app.use(this.path, require('../routes/servicios'))
    this.app.use(this.path, require('../routes/empleados'))
    this.app.use(this.path, require('../routes/detalleComprasP'))
    this.app.use(this.path, require('../routes/detalleComprasIn'))
    this.app.use(this.path, require('../routes/citas_servicios'))
    this.app.use(this.path, require('../routes/abonos'))
  }

  sockets() {
    this.io = socketIO(this.server, {
      cors: {
        origin: 'http://localhost:3001',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
      },
    });

    this.io.on('connection', (socket) => {
      console.log('Cliente conectado');

      // Manejo de evento 'clienteConectado' enviado desde el cliente
      socket.on('clienteConectado', (data) => {
        console.log('Cliente conectado:', data);
        // Envía una confirmación al cliente
        socket.emit('confirmacionConexion', { message: 'Conexión establecida correctamentee' });
      });

      // Manejo de evento 'mensaje' enviado desde el cliente
      socket.on('mensaje', (data) => {
        console.log('Mensaje recibido:', data);
        console.log('mensaje', '¡Hola felix Por fin!');
      });

      // Manejo de evento 'eventoActualizado' enviado desde el cliente
      socket.on('eventoActualizado', (eventId) => {
        console.log('Evento actualizado:', eventId);
        // Aquí puedes realizar acciones adicionales, como notificar a otros usuarios o actualizar datos en tiempo real
        this.io.emit('eventoActualizado', eventId); // Emitir un mensaje a todos los clientes conectados
      });

      // Envío de un mensaje al cliente cuando se conecta
      socket.emit('mensaje', '¡Hola felix Por fin!');
    });
  }

}

module.exports = Server;