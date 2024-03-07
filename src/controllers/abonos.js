const Abonos = require ('../models/abonos');
const { response } = require('express');
const Venta = require('../models/ventas');

const getAbonos = async (req, res = response) => {
    try {
        const abonos = await Abonos.findAll();
        res.json ({ abonos });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al ontener los abonos.' });
    }
};


const postAbonos = async (req, res = response) => {
    // Obtener el ID de la venta y el monto del abono desde la solicitud
    const { id_ventas, monto_abono } = req.body;

    try {
        // Verificar si la venta existe
        const venta = await Venta.findByPk(id_ventas);
        if (!venta) {
            return res.status(404).json({ error: 'Venta no encontrada' });
        }

        // Verificar si la venta está pendiente
        if (venta.estado !== 'Pendiente') {
            return res.status(400).json({ error: 'La venta no está pendiente, no se puede crear un abono' });
        }

        // Obtener el precio total de la venta y el precio pendiente actual
        const precio_total_venta = venta.precio;
        let precio_pendiente_actual = venta.precio_pendiente;

        // Calcular el precio pendiente después del abono
        const nuevo_precio_pendiente = precio_pendiente_actual - monto_abono;

        // Actualizar el precio pendiente en la venta
        await venta.update({ precio_pendiente: nuevo_precio_pendiente });

        // Verificar si la venta está completamente pagada
        if (nuevo_precio_pendiente <= 0) {
            // Si el precio pendiente es menor o igual a cero, marcar la venta como pagada
            await venta.update({ estado: 'Pagada' });
        }

        // Crear el abono asociado a la venta
        const abono = await Abonos.create({
            id_ventas: id_ventas,
            precio_agregar: monto_abono,
            precio_pendiente: nuevo_precio_pendiente,
            fecha_abono: new Date()
        });

        res.status(201).json({
            message: 'Abono creado exitosamente',
            abono
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el abono.' });
    }
};

module.exports = {
    getAbonos,
    postAbonos
};