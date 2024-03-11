const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const http = require('http');
const socketIO = require('socket.io');
const authController = require('../controllers/authController');
const recuperarContrasena = require('../controllers/resetPassword');
const solicitarRestablecimiento = require('../controllers/resetPassword');
const editarPerfil = require('../controllers/usuarios');

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
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    this.io.on('connection', (socket) => {
      console.log('Cliente conectado');

      // Manejo de evento 'clienteConectado' enviado desde el cliente
      socket.on('clienteConectado', (data) => {
        console.log('Cliente conectado:', data);
        // Envía una confirmación al cliente
        socket.emit('confirmacionConexion', { message: 'Conexión establecida correctamente' });
      });

      // Manejo de evento 'mensaje' enviado desde el cliente
      socket.on('mensaje', (data) => {
        console.log('Mensaje recibido:', data);
        console.log('mensaje', '¡Hola felix Por fin!');
      });

      // Envío de un mensaje al cliente cuando se conecta
      socket.emit('mensaje', '¡Hola felix Por fin!');
    });
  }
}

module.exports = Server;