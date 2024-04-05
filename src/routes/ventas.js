const { Router } = require('express');
const route = Router();
const verificarToken = require('../middlewares/verificarToken');


const { postVentas, getVentas, cancelarVenta, cambiarEstado, getVenta, postCargarVentas } = require('../controllers/ventas');

route.get('/venta', verificarToken, getVentas);
route.get('/venta/:id', verificarToken, getVenta);
route.post('/venta', verificarToken, postVentas);
route.post('/ventas', verificarToken, postCargarVentas);
route.put('/venta/estadoventa/:id_ventas', verificarToken, cambiarEstado);
route.put('/venta/cancelar/:id_ventas', verificarToken, cancelarVenta);

module.exports = route;
