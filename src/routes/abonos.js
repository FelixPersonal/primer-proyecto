const { Router } = require('express');
const route = Router();
const verificarToken = require('../middlewares/verificarToken');

const { getAbonos, postAbonos } = require('../controllers/abonos');

route.get('/abonos', verificarToken, getAbonos);
route.post('/abono', verificarToken, postAbonos)

module.exports = route;