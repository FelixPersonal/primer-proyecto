const { Router } = require('express');
const route = Router();
const verificarToken = require('../middlewares/verificarToken');

const { getInsumo, 
    getInsumos, 
    postInsumo, 
    putInsumo, 
    deleteInsumo 
} = require('../controllers/insumos');

route.use(verificarToken);

route.get('/insumo', verificarToken, getInsumos);
route.get('/insumo/:id',verificarToken, getInsumo);
route.post('/insumo', verificarToken, postInsumo);
route.put('/insumo/:id', verificarToken, putInsumo);
route.delete('/insumo/:id',verificarToken, deleteInsumo);

module.exports = route;
