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

const getAbono = async (req, res = response) => {

    const id_abonos = req.params.id;

    try {

        const abonos = await Abonos.findByPk(id_abonos);

        if (abonos) {
            res.json(abonos);
        } else {
            res.status(404).json({ error: `No se encontró ningún abono con este id: ${id_abonos}` });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Error al obtener el abono.'})
    }
};


const postAbonos = async (req, res = response) => {

    const { id_ventas, id_cliente, monto_abono } = req.body;

    try {
        const venta = await Venta.findByPk(id_ventas);
        if (!venta) {
            return res.status(404).json({ error: 'Venta no encontrada' });
        }

        if (venta.estado !== 'Pendiente') {
            return res.status(400).json({ error: 'La venta no está pendiente, no se puede crear un abono' });
        }

        let precio_pendiente_actual = venta.precio;

        const nuevo_precio_pendiente = precio_pendiente_actual - monto_abono;

        await venta.update({ precio_pendiente: nuevo_precio_pendiente });

        if (nuevo_precio_pendiente <= 0) {
            await venta.update({ estado: 'Pagado' });
        }

        const abono = await Abonos.create({
            id_ventas: id_ventas,
            id_cliente: id_cliente,
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
    postAbonos,
    getAbono
};