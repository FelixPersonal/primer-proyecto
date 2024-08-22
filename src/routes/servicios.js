const { Router } = require('express');
const route = Router();
const verificarToken = require('../middlewares/verificarToken');


const { getServicio, getServicios, postServicio, putServicio, deleteServicio } = require('../controllers/servicios');

route.get('/servicio',verificarToken, getServicios);
route.get('/servicio/:id',verificarToken, getServicio);
route.post('/servicio',verificarToken, postServicio);
route.put('/servicio/:id',verificarToken, putServicio);
route.delete('/servicio/:id',verificarToken, deleteServicio);

module.exports = route;  
