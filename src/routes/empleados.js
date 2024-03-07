const {Router} = require('express')
const route = Router()
const verificarToken = require('../middlewares/verificarToken');


const { getEmpleados, getEmpleado, postEmpleado, putEmpleado, cambiarEstadoEmpleado, getValidarDocumento, getEmpleadosActivos } = require ('../controllers/empleados');

route.get('/empleado', verificarToken, getEmpleados);
route.get('/empleado/activos', verificarToken, getEmpleadosActivos);
route.get('/empleado/:id',verificarToken, getEmpleado);
route.post('/empleado', verificarToken, postEmpleado);
route.put('/empleado/:id', verificarToken, putEmpleado);
route.put('/empleado/cambiarEstado/:id', verificarToken, cambiarEstadoEmpleado);
route.get('/validar', verificarToken, getValidarDocumento);


module.exports = route;