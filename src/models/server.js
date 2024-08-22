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
const Nexmo = require('nexmo');







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
      origin: ['http://localhost:3001', 'https://proyectobac-d714e.web.app'],
      credentials: true,
    };

    this.app.use(cors(corsOptions));
    this.app.use(express.static(__dirname + '/public'));
    this.app.use(bodyParser.json());
  }

  async inicializarBaseDeDatos() {
    try {
      const cantidadRoles = await Rol.count();
      const cantidadUsuarios = await Usuario.count();
      const cantidadPermisos = await Permiso.count();

      if (cantidadRoles === 0) {
        await Rol.bulkCreate([
          { nombre: 'SuperAdmin', estado: 'Activo' },
          { nombre: 'Empleado', estado: 'Activo' },
          { nombre: 'Cliente', estado: 'Activo' }
         
        ]);
        console.log('Se ha creado el rol por defecto.');
      }

      if (cantidadPermisos === 0) {
        const permisos = [
          { nombre_permiso: 'lista de Citas', ruta: '/listaCitas' },
          { nombre_permiso: 'Reservas', ruta: '/reservar' },
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

      if (cantidadUsuarios === 0) {
        const usuarioPorDefecto = await Usuario.create({
          id_usuario: 1,
          id_rol: 1,
          nombre_usuario: 'Admin',
          contrasena: '12345678S',
          correo: 'sionbarbershop5@gmail.com',
          telefono: '+3146753115',
          estado: 'Activo',
        });
        console.log('Se ha creado el usuario por defecto.');

        const permisos = await Permiso.findAll();
        await usuarioPorDefecto.setPermisos(permisos);
        console.log('Se han asignado todos los permisos al usuario por defecto.');

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
    // Rutas de autenticación y perfil
    this.app.post(`${this.path}/login`, authController.iniciarSesion);
    this.app.post(`${this.path}/cambiar-contrasena`, recuperarContrasena.cambiarContrasena);
    this.app.post(`${this.path}/solicitar-restablecimiento`, solicitarRestablecimiento.solicitarRestablecimiento);
    this.app.post(`${this.path}/actualizarPerfil`, editarPerfil.actualizarPerfil);

    // Rutas de los modelos y controladores
    this.app.post(this.path, require('../routes/permisos'));
    this.app.post(this.path, require('../routes/roles'));
    this.app.post(this.path, require('../routes/usuarios'));
    this.app.use(this.path, require('../routes/roles'));
    this.app.use(this.path, require('../routes/usuarios'));
    this.app.use(this.path, require('../routes/permisos'));
    this.app.use(this.path, require('../routes/ventas'));
    this.app.use(this.path, require('../routes/productos'));
    this.app.use(this.path, require('../routes/agenda'));
    this.app.use(this.path, require('../routes/citas'));
    this.app.use(this.path, require('../routes/compras'));
    this.app.use(this.path, require('../routes/registroFacial'));
    this.app.use(this.path, require('../routes/proveedores'));
    this.app.use(this.path, require('../routes/insumos'));
    this.app.use(this.path, require('../routes/clientes'));
    this.app.use(this.path, require('../routes/servicios'));
    this.app.use(this.path, require('../routes/empleados'));
    this.app.use(this.path, require('../routes/detalleComprasP'));
    this.app.use(this.path, require('../routes/detalleComprasIn'));
    this.app.use(this.path, require('../routes/citas_servicios'));
    this.app.use(this.path, require('../routes/abonos'));

    // Ruta para enviar un mensaje de WhatsApp
    this.app.post(`${this.path}/enviar-whatsapp`, async (req, res) => {
      const body = req.body;

      try {
        const from = 'sionbarbershop-app';
        const prefix = '+57'; 
        const toUsuario = prefix + body.telefonoUsuario; 
        const toEmpleado = prefix + body.telefonoEmpleado; 
      

        // Configurar Nexmo
        const nexmo = new Nexmo({
          apiKey: '91875ba2',
          apiSecret: 'imX6kZ8BG98XVSq1'
        });

        // Enviar mensaje de WhatsApp al usuario (cliente)
        nexmo.message.sendSms(from, toUsuario, text, (error, response) => {
          if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error al enviar el mensaje de WhatsApp al usuario' });
          } else {
            console.log(response);
          }
        });

        // Enviar mensaje de WhatsApp al empleado
        nexmo.message.sendSms(from, toEmpleado, text, (error, response) => {
          if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error al enviar el mensaje de WhatsApp al empleado' });
          } else {
            console.log(response);
          }
        });

        res.json({ message: 'Mensajes de WhatsApp enviados correctamente' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al enviar mensajes de WhatsApp' });
      }
    });

    
  }

  sockets() {
    this.io = socketIO(this.server, {
      cors: {
        origin: ['http://localhost:3001', 'https://proyectobac-d714e.web.app'],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
      },
    });

    this.io.on('connection', (socket) => {
      console.log('Cliente conectado');

      socket.on('clienteConectado', (data) => {
        console.log('Cliente conectado:', data);
        socket.emit('confirmacionConexion', { message: 'Conexión establecida correctamente' });
      });

      socket.on('mensaje', (data) => {
        console.log('Mensaje recibido:', data);
        console.log('mensaje', '¡Hola felix Por fin!');
      });

      socket.on('eventoActualizado', (eventId) => {
        console.log('Evento actualizado:', eventId);
        this.io.emit('eventoActualizado', eventId);
      });

      socket.emit('mensaje', '¡Hola felix Por fin!');
    });
  }
}

module.exports = Server;
