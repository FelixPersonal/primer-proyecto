const { Router } = require('express');
const route = Router();
const verificarToken = require('../middlewares/verificarToken');


const { getDetalleCompraP, getDetalleComprasP, postDetalleCompraP, putDetalleCompraP, deleteDetalleCompraP } = require('../controllers/detalleComprasP');

route.get('/detalle-comprasp',verificarToken, getDetalleComprasP);
route.get('/detalle-comprasp/:id',verificarToken, getDetalleCompraP);
route.post('/detalle-comprasp',verificarToken, postDetalleCompraP);
route.put('/detalle-comprasp/:id',verificarToken, putDetalleCompraP);
route.delete('/detalle-comprasp/:id',verificarToken, deleteDetalleCompraP);

module.exports = route;
