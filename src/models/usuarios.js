const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/config');
const bcrypt = require('bcrypt');
const Rol = require('../models/roles');

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
  nombre_usuario: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: true,
      is: /^[a-zA-Z\s]*$/,
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
  /*
  reset_token: {
    type: DataTypes.STRING, // Almacena el token de restablecimiento de contraseña
  },
  reset_token_expires: {
    type: DataTypes.DATE, // Almacena la fecha de vencimiento del token
  },

  */
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
