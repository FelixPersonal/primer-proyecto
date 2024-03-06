const Venta = require('../models/ventas');
const DetalleProducto = require('../models/detalleProducto');
const DetalleServicio = require('../models/detalleServicio');
const Producto = require('../models/productos')
const Citas = require('../models/citas')

const { response } = require('express');
const Clientes = require('../models/clientes');
const Empleado = require('../models/empleados');

const getVentas = async (req, res = response) => {
  try {
    const ventas = await Venta.findAll({
      include: [DetalleProducto, DetalleServicio],
    });
    res.json({ ventas });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener elementos de Venta' });
  }
}


const getVenta = async (req, res = response) => {
  const id_ventas = req.params;
  try {
    const venta = await Venta.findByPk(id_ventas);

    if (venta) {
      res.json(venta);
    } else {
      res.status(404).json({ error: `No se encontró un elemento de Venta con ID ${nombre}` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el elemento de Venta' });
  }
}


const postVentas = async (req, res = response) => {
  // Obtener datos de la solicitud
  const { nueva_venta } = req.body;
  try {
    const cliente = await Clientes.findByPk(nueva_venta.clienteId);
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    const empleado = await Empleado.findByPk(nueva_venta.empleadoId);
    if (!empleado) {
      return res.status(404).json({ error: 'Empleado no encontrado' });
    }
    // Crear la venta
    const productos = nueva_venta.productos;
    const servicios = nueva_venta.servicios;
    console.log('Productos: ', productos)
    console.log('Servicios: ', servicios)
    const precio = calculateTotalPrice(productos, servicios);
    const venta = await Venta.create({
      id_cita: nueva_venta.citaId,
      id_cliente: nueva_venta.clienteId,
      id_empleado: nueva_venta.empleadoId,
      numeroFactura: nueva_venta.numeroFactura,
      precio: precio,
      estado: 'Pendiente',
      estado_anulado: 'Activo',
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      documento: cliente.documento,
      nombre_empleado: empleado.nombre
    });
    let id_venta = venta.get('id_ventas');
    console.log(productos)
    console.log(servicios)
    // Agregar detalles de productos
    if (productos.length > 0) {
      console.log('Entramos al detalle de productos')
      for (let producto of productos) {
        var valor_total = producto.cantidad * producto.precioTotal;
        try {
          let detalle_prod = await DetalleProducto.create({
            id_ventas: id_venta,
            id_producto: producto.id,
            cantidad: producto.cantidad,
            valor_venta: producto.precioTotal,
            valor_total: valor_total
          });
          console.log('producto registrado')
        } catch (error) {
          console.error('Error al registrar el producto:', error);
          continue;
        }
        const productoActual = await Producto.findByPk(producto.id);
        if (productoActual) {
          productoActual.stock -= producto.cantidad;
          await productoActual.save();
          console.log('Stock actualizado para el producto');
        } else {
          console.error('Producto no encontrado en la base de datos');
        }
      }
    }

    if (servicios.length > 0) {
      console.log('Entramos al detalle de servicios')
      for (let servicio of servicios) {
        var valor_total = servicio.cantidad * servicio.precioTotal;
        try {
          await DetalleServicio.create({
            id_ventas: id_venta,
            id_servicio: servicio.id,
            cantidad: servicio.cantidad,
            valor_venta: servicio.precioTotal,
            valor_total: valor_total
          });
          console.log('servicio registrado')
        } catch (error) {
          console.error('Error al registrar el servicio:', error);
          continue;
        }
      }
    }

    if (nueva_venta.citaId !== null) {
      console.log("Id cita: ", nueva_venta.citaId);
      try {
        // Buscar la cita por su ID
        const cita = await Citas.findByPk(nueva_venta.citaId);

        if (cita) {
          // Actualizar el estado de la cita a "Finalizado"
          await cita.update({ estado: 'Finalizado' });
        } else {
          res.status(404).json({ error: `No se encontró la cita con ID ${id}` });
        }
      } catch (error) {
        console.error('Error al registrar el servicio:', error);
      }
    }

    res.status(201).json({
      "message": 'Venta creada exitosamente',
      "venta": venta,
      "productos_vendidos": productos,
      "servicios_vendidos": servicios
    });
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};

function calculateTotalPrice(productos, servicios) {
  let totalPrice = 0;
  for (const producto of productos) {
    const precioFloat = parseFloat(producto.precioTotal);
    totalPrice += producto.cantidad * precioFloat;
  }
  for (const servicio of servicios) {
    const precioFloat = parseFloat(servicio.precioTotal);
    totalPrice += servicio.cantidad * precioFloat;
  }
  return totalPrice;
}


const cancelarVenta = async (req, res = response) => {
  const { id_ventas } = req.params;
  console.log(id_ventas)
  try {
    const venta = await Venta.findByPk(id_ventas);
    if (!venta) {
      return res.status(404).json({ error: 'Venta no encontrada' });
    }
    if (venta.estado === 'Cancelado') {
      return res.status(400).json({ error: 'La venta ya está cancelada' });
    }
    venta.estado = 'Cancelado';
    await venta.save();

    return res.json({ message: 'Venta cancelada exitosamente' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}

const cambiarEstado = async (req, res = response) => {
  const id_ventas = req.params.id_ventas;

  try {
    const ventas = await Venta.findByPk(id_ventas);

    if (ventas) {
      ventas.toggleEstadoAnulado();
      res.json({
        msg: `El estado ha sido anulado, nuevo estado: ${ventas.estado_anulado}`,
        ventas: ventas
      });
    } else {
      res.status(404).json({ error: `no se encontro la venta con el ID: ${id_ventas}` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar la venta ha anulada' });
  }
};

module.exports = {
  getVentas,
  getVenta,
  postVentas,
  cancelarVenta,
  cambiarEstado
};
