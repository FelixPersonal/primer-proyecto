const { Router } = require('express');
const route = Router();
const verificarToken = require('../middlewares/verificarToken');

const { getAbonos } = require('../controllers/abonos');

route.get('/abonos', verificarToken, getAbonos);

module.exports = route;