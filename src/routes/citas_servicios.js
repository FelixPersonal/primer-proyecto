const { Router } = require('express');
const route = Router();
const verificarToken = require('../middlewares/verificarToken');


const { getCitaServicio, getCitasServicios, postCitaServicio, putCitaServicio, deleteCitaServicio, getCitaServicioInfo} = require('../controllers/citas_servicios');

route.get('/citas_servicios',verificarToken, getCitasServicios);
route.get('/citas_servicios/:id',verificarToken, getCitaServicio);
route.get('/citas_servicios_info/',verificarToken, getCitaServicioInfo);
route.post('/citas_servicios',verificarToken, postCitaServicio);
route.put('/citas_servicios/:id',verificarToken, putCitaServicio);
route.delete('/citas_servicios/:id',verificarToken, deleteCitaServicio);

module.exports = route;
