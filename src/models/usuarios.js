const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/config');
const bcrypt = require('bcrypt');
const Rol = require('./roles');
const Permiso = require('./permisos'); // Importa el modelo Permiso


const Usuario = sequelize.define('usuario', {
  id_usuario: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  id_rol: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  documento: {
    type: DataTypes.STRING(10),
    allowNull: false,
    unique: true,
    validate: {
      is: /^\d+$/, // Solo números
      len: [10, 10], // Longitud exacta de 10 dígitos
    },
  },
  telefono: {
    type: DataTypes.STRING(10),
    allowNull: false,
    validate: {
      is: /^\d+$/, // Solo números
      len: [10, 10], // Longitud exacta de 10 dígitos
    },
  },
  nombre_usuario: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      is: /^[a-zA-Z0-9_-]*$/, // Permite letras, números, guiones bajos y guiones
    },
  },

  contrasena: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      len: {
        args: [8, 255],
        msg: 'La contraseña debe tener al menos 8 caracteres',
      },
    },
  },
  correo: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: {
        args: true,
        msg: 'Por favor, ingrese un correo electrónico válido',
      },
    },
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    onUpdate: DataTypes.NOW,
  },
  estado: {
    type: DataTypes.ENUM('Activo', 'Inactivo'),
    defaultValue: 'Activo',
  },
}, {
  timestamps: false,
});

Usuario.belongsTo(Rol, { foreignKey: 'id_rol' });

Usuario.belongsToMany(Permiso, { through: 'UsuarioPermiso' }); // Asociación muchos a muchos con Permiso


Usuario.beforeCreate(async (usuario) => {
  if (!usuario.contrasena) {
    throw new Error('La contraseña no puede estar vacía');
  }

  const hashedPassword = await bcrypt.hash(usuario.contrasena, 10);
  usuario.contrasena = hashedPassword;
});

// Método para actualizar el token de restablecimiento y la fecha de vencimiento
Usuario.prototype.actualizarTokenReset = async function (token, expires) {
  this.reset_token = token;
  this.reset_token_expires = expires;
  await this.save();
};

module.exports = Usuario;
