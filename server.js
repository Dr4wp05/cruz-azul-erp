const express = require('express');
const app = express();
require('dotenv').config();

// Middleware para entender JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (HTML, CSS) desde la carpeta views
app.use(express.static('views'));

// Ruta base de prueba
app.get('/', (req, res) => {
  res.send('<h1>Portal de Autenticación - Farmacias Cruz Azul</h1>');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor Frontend corriendo en el puerto ${PORT}`);
});
