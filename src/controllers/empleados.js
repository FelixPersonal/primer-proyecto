const Empleado = require('../models/empleados');
const Agenda = require('../models/agenda');
const Citas = require('../models/citas');
const Usuario = require('../models/usuarios'); // Importa el modelo de usuarios
const sharp = require('sharp');
const path = require('path');
const { response } = require('express');




const getEmpleados = async (req, res = response) => {
    try {
        const empleados = await Empleado.findAll();
        res.json({ empleados });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los empleados ' });
    }
}

const getEmpleadosActivos = async (req, res = response) => {
    try {
        const empleados = await Empleado.findAll({ where: { estado: 'Activo' } });
        res.json({ empleados });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los empleados' });
    }
}








const getEmpleado = async (req, res = response) => {
    const id_empleado = req.params.id;

    try {
        const empleado = await Empleado.findByPk(id_empleado);

        if (empleado) {
            res.json(empleado);
        } else {
            res.status(404).json({ error: `Empleado no encontrado ${documento}` });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el empleado' });
    }
}

const getEmpleadoAgendas = async (req, res = response) => {
    const id_empleado = req.params.id;

    try {
        // Obtener el empleado
        const empleado = await Empleado.findByPk(id_empleado);

        if (!empleado) {
            return res.status(404).json({ error: `Empleado no encontrado con ID ${id_empleado}` });
        }

        // Obtener todas las agendas del empleado
        const agendas = await Agenda.findAll({
            where: {
                id_empleado: id_empleado
            }
        });

        // Combinar la información del empleado con sus agendas
        const empleadoConAgendas = {
            empleado,
            agendas
        };

        res.json(empleadoConAgendas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el empleado y sus agendas' });
    }
}

const postEmpleado = async (req, res = response) => {
    const { nombre, apellido, correo, documento, telefono } = req.body;

    try {
        // Subir la foto si existe
        let fotoPath = null;
        if (req.file) {
            const foto = req.file;
            fotoPath = `uploads/${Date.now()}-processed${path.extname(foto.originalname)}`;
            await sharp(foto.path)
                .resize(300, 300)
                .toFile(fotoPath);
        }

        // Crear el empleado
        const empleado = await Empleado.create({
            nombre: nombre,
            apellido: apellido,
            correo: correo,
            documento: documento,
            telefono: telefono,
            foto: fotoPath
        });

        // Crear el usuario asociado al empleado con id_usuario 2
        const usuario = await Usuario.create({
            
            id_rol: 2, 
            nombre_usuario: nombre,
            apellido: apellido,
            contrasena: '123456AA', // Puedes establecer una contraseña por defecto
            correo: correo,
            telefono: telefono,
            estado: 'Activo',
            id_empleado: empleado.id_empleado,
        });

        res.status(201).json({ message: 'Empleado agregado exitosamente', empleado, usuario });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Error al agregar el empleado ' + error });
    }
};



const getValidarDocumento = async (req, res = response) => {
    const { documento } = req.query;
    try {
        const empleado = await Empleado.findOne({ where: { documento } });
        if (empleado) {
            return res.status(400).json({ documento: 'El documento ya existe' });
        }
        return res.status(200).json({ documento: 'Documento válido' });
    } catch (error) {
        console.error('Error al validar el documento:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};



const putEmpleado = async (req, res = response) => {
    const id_empleado = req.params.id;
    const updatedData = req.body;

    console.log(id_empleado, updatedData);

    try {
        const empleado = await Empleado.findByPk(id_empleado);

        if (empleado) {
            await empleado.update(updatedData);
            res.json({
                msg: `Empleado actualizado exitosamente.`,
                empleado: empleado
            });
        } else {
            res.status(404).json({ error: `No se encontró el empleado con el ID: ${id_empleado}` });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el empleado' });
    }
}


const deleteEmpleado = async (req, res = response) => {
    const { id } = req.params;

    try {
        const empleado = await Empleado.findByPk(id);

        if (empleado) {
            await empleado.destroy();
            res.json('El empleado fue eliminado exitosamente');
        } else {
            res.status(404).json({ error: `No se encontró el empleado con ID ${id}` });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el empleado' });
    }
};

const cambiarEstadoEmpleado = async (req, res = response) => {
    const id_empleado = req.params.id;

    try {
        const empleado = await Empleado.findByPk(id_empleado);

        if (empleado) {
            empleado.toggleEstado();
            res.json({
                msg: `Estado del empleado actualizado exitosamente. Nuevo estado: ${empleado.estado}`,
                empleado: empleado
            });
        } else {
            res.status(404).json({ error: `No se encontró el empleado con el ID: ${id_empleado}` });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el estado del empleado' });
    }


};

module.exports = {
    getEmpleado,
    deleteEmpleado,
    getEmpleados,
    getEmpleadoAgendas,
    getEmpleadosActivos,
    postEmpleado,
    putEmpleado,
    cambiarEstadoEmpleado,
    getValidarDocumento,
   

};