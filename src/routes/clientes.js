const {Router} = require('express');
const route = Router();
const verificarToken = require('../middlewares/verificarToken');


const { getCliente,getClientes,postCliente,putCliente,deleteCliente,getClientesActivos,enviarAgendaSemana,getAgendaSemanaCliente} = require('../controllers/clientes');
route.get('/cliente/activos', verificarToken, getClientesActivos);
route.get('/cliente', verificarToken, getClientes);
route.get('/cliente/:id', verificarToken, getCliente);
route.post('/cliente', verificarToken, postCliente);
route.put('/cliente/:id', verificarToken, putCliente);
route.delete('/cliente/:id', verificarToken, deleteCliente);
route.post('/cliente/agenda-semana/:id', verificarToken, enviarAgendaSemana);
route.get('/cliente/agenda-semana/:id', verificarToken, getAgendaSemanaCliente);


module.exports = route;