const Abonos = require ('../models/abonos');
const { response } = require('express');

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
    
};

module.exports = {
    getAbonos
};