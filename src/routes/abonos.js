const { Router } = require('express');
const route = Router();
const verificarToken = require('../middlewares/verificarToken');

const { getAbonos, postAbonos, getAbono } = require('../controllers/abonos');

route.get('/abonos', verificarToken, getAbonos);
route.post('/abono', verificarToken, postAbonos);
route.get('/abono/:id', verificarToken, getAbono);

module.exports = route;