const { Router } = require('express');
const route = Router();
const verificarToken = require('../middlewares/verificarToken');


const { getCompra, getCompras, postCompra, putCompra, deleteCompra, getComprasDetalles, cambiarEstadoCompra} = require('../controllers/compras');

route.get('/compras',verificarToken, getCompras);
route.get('/compras/detalles',verificarToken, getComprasDetalles)
route.get('/compras/:id',verificarToken, getCompra);
route.post('/compras',verificarToken, postCompra);
route.put('/compras/:id',verificarToken, putCompra);
route.delete('/compras/:id',verificarToken, deleteCompra);
route.put('/compras/:id/cambiarEstado',verificarToken, cambiarEstadoCompra)

module.exports = route;
