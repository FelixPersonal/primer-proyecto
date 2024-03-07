const { Router } = require('express');
const route = Router();
const verificarToken = require('../middlewares/verificarToken');

const { getAgenda, getAgendas, getAgendaEmpleado, postAgenda, putAgenda, deleteAgenda,disableEvent,getEmpleadoActivos} = require('../controllers/agenda');


route.get('/agenda', verificarToken,getAgendas);
route.get('/agenda/Activo', verificarToken, getEmpleadoActivos);
route.get('/agenda/empleado/:id', getAgendaEmpleado);
route.get('/agenda/:id',verificarToken, getAgenda);
route.post('/agenda',verificarToken, postAgenda);
route.put('/agenda/:id',verificarToken, putAgenda);
route.delete('/agenda/:id',verificarToken, deleteAgenda);
route.put('/agenda/:id/disabled',verificarToken, disableEvent);



module.exports = route;

