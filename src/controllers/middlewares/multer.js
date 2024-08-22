const multer = require('multer');

const path = require('path');

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure this folder exists
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-processed${path.extname(file.originalname)}`;
    cb(null, uniqueSuffix);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos de imágenes'));
  }
};

const limits = {
  fileSize: 1024 * 1024 * 5 // 5 MB
};

const upload = multer({ storage, fileFilter, limits });

// // Rutas para subir imágenes de perfil
// this.app.post(`${this.path}/upload/admin-profile`, upload.single('foto'), (req, res) => {
//   res.json({ message: 'Imagen de administrador subida con éxito', filePath: req.file.filename });
// });

// this.app.post(`${this.path}/upload/employee-profile`, upload.single('foto'), (req, res) => { // Corregido nombre de la ruta
//   res.json({ message: 'Imagen de empleado subida con éxito', filePath: req.file.filename });
// });

module.exports = upload; // Exportar upload
