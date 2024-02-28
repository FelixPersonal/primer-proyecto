const { Router } = require('express');
const route = Router();
const verificarToken = require('../middlewares/verificarToken');


const { getDetalleCompraIn, getDetalleComprasIn, postDetalleCompraIn, putDetalleCompraIn, deleteDetalleCompraIn } = require('../controllers/detalleComprasIn');

route.get('/detalle-comprasin',verificarToken, getDetalleComprasIn);
route.get('/detalle-comprasin/:id',verificarToken, getDetalleCompraIn);
route.post('/detalle-comprasin',verificarToken, postDetalleCompraIn);
route.put('/detalle-comprasin/:id',verificarToken, putDetalleCompraIn);
route.delete('/detalle-comprasin/:id',verificarToken, deleteDetalleCompraIn);

module.exports = route;
