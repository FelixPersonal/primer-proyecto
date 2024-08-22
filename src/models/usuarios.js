const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/config');
const bcrypt = require('bcrypt');
const Rol = require('./roles');
const Permiso = require('./permisos');

const Usuario = sequelize.define('usuario', {
  id_cliente: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  id_empleado: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true, 
    allowNull: false,
  },
  id_rol: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  documento: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  nombre_usuario: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      is: /^[a-zA-Z0-9_-]*$/,
    },
  },
  apellido: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: true,
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

  foto: {
    type: DataTypes.STRING, 
    allowNull: true, 
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
Usuario.belongsToMany(Permiso, { through: 'UsuarioPermiso' });

Usuario.beforeCreate(async (usuario) => {
  if (!usuario.contrasena) {
    throw new Error('La contraseña no puede estar vacía');
  }
  const hashedPassword = await bcrypt.hash(usuario.contrasena, 10);
  usuario.contrasena = hashedPassword;
});

Usuario.prototype.actualizarTokenReset = async function (token, expires) {
  this.reset_token = token;
  this.reset_token_expires = expires;
  await this.save();
};

module.exports = Usuario;
