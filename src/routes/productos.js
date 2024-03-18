const { Router } = require('express');
const route = Router();
const verificarToken = require('../middlewares/verificarToken');


const { getProductos, getProducto, postProducto, putProducto, deleteProducto,  obtenerProveedores, getProductosActivos } = require('../controllers/productos');

route.get('/producto/activos', verificarToken,getProductosActivos);
route.get('/producto',verificarToken, getProductos);
route.get('/producto-proveedores',verificarToken, obtenerProveedores);
route.get('/producto/:id',verificarToken, getProducto);
route.post('/producto',verificarToken, postProducto);
route.put('/producto/:id',verificarToken, putProducto);
route.delete('/producto/:id',verificarToken, deleteProducto);
module.exports = route;
