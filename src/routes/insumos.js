const { Router } = require('express');
const router = Router();
require('../controllers/insumos');

const verificarToken = require('../middlewares/verificarToken');
const {
    getInsumo,
    getInsumos,
    postInsumo,
    putInsumo,
    deleteInsumo
} = require('../controllers/insumos');


router.get('/insumos', verificarToken, getInsumos);
router.get('/insumos/:id',verificarToken, getInsumo);
router.post('/insumos',verificarToken, postInsumo);
router.put('/insumos/:id',verificarToken, putInsumo);
router.delete('/insumos/:id',verificarToken, deleteInsumo);

module.exports = router;
