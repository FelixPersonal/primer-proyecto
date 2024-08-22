const { Router } = require('express');
const route = Router();
const verificarToken = require('../middlewares/verificarToken');

const { getCita, getCitas, getCitasServcios, getCitasHoy, postCita,getUsuario, getCitasUsuario, putCitaEstado,getEmpleadoConCitas, putCita, deleteCita, getCitasAgendadas, getHorariosDisponibles,CancelarCita,TomarCita} = require('../controllers/citas');
route.get('/horarios-disponibles/:id_empleado', verificarToken, getHorariosDisponibles);
route.get('/citas',verificarToken, getCitas);
route.get('/empleado/citas/:id', verificarToken, getEmpleadoConCitas); 
route.get('/citas/usuario/:id_usuario', verificarToken, getCitasUsuario);
route.post('/usuarios/:id_usuario',verificarToken, getUsuario);
route.get('/citas/agendadas/',verificarToken, getCitasAgendadas);
route.get('/citas/servicios/:id',verificarToken, getCitasServcios);
route.get('/citas/:id',verificarToken, getCita);
route.post('/citashoy',verificarToken, getCitasHoy);
route.post('/citas',verificarToken, postCita);
route.put('/citas/:id/cambiarEstado',verificarToken, putCitaEstado);
route.put('/citas/:id',verificarToken, putCita);
route.delete('/citas/:id',verificarToken, deleteCita);
route.post('/cancelar/:id_cita', verificarToken,CancelarCita);
route.post('/tomar/:id_cita',verificarToken,TomarCita)

module.exports = route;
