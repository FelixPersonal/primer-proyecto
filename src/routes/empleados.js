const {Router} = require('express')
const route = Router()
const verificarToken = require('../middlewares/verificarToken');
const upload = require('../controllers/middlewares/multer');


const { getEmpleados, getEmpleado, postEmpleado, putEmpleado, cambiarEstadoEmpleado, getValidarDocumento, getEmpleadosActivos, getEmpleadoAgendas,deleteEmpleado,obtenerCitasEmpleados} = require ('../controllers/empleados');

route.delete('/empleado/:id', verificarToken, deleteEmpleado);
route.get('/empleado', verificarToken, getEmpleados);
route.get('/empleado/activos', verificarToken, getEmpleadosActivos);
//route.get('/empleado/citas/:id', verificarToken, getEmpleadoConCitas);
route.get('/empleado/agendas/:id', verificarToken, getEmpleadoAgendas);
route.get('/empleado/:id',verificarToken, getEmpleado);
route.post('/empleado', verificarToken, upload.single('foto'), postEmpleado);
route.put('/empleado/:id', verificarToken, putEmpleado);
route.put('/empleado/cambiarEstado/:id', verificarToken, cambiarEstadoEmpleado);
route.get('/validar', verificarToken, getValidarDocumento);


module.exports = route;