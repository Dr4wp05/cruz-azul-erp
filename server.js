const express = require('express');
const app = express();
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');

// Middlewares globales
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('views'));

// Vincular las rutas de autenticación bajo el prefijo /api/auth
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('<h1>Portal de Autenticación - Farmacias Cruz Azul</h1>');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor Frontend corriendo en el puerto ${PORT}`);
});
