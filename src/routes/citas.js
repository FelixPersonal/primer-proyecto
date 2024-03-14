const { Router } = require('express');
const route = Router();
const verificarToken = require('../middlewares/verificarToken');



const { getCita, getCitas, getCitasServcios, getCitasHoy, postCita, putCitaEstado, putCita, deleteCita, getCitasAgendadas } = require('../controllers/citas');

route.get('/citas',verificarToken, getCitas);
route.get('/citas/agendadas/',verificarToken, getCitasAgendadas);
route.get('/citas/servicios/:id',verificarToken, getCitasServcios);
route.get('/citas/:id',verificarToken, getCita);
route.post('/citashoy',verificarToken, getCitasHoy)
route.post('/citas',verificarToken, postCita);
route.put('/citas/:id/cambiarEstado',verificarToken, putCitaEstado);
route.put('/citas/:id',verificarToken, putCita);
route.delete('/citas/:id',verificarToken, deleteCita);

module.exports = route;
