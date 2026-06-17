const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { verificarAcceso } = require('../middlewares/auth');

// Credenciales de prueba (Simulando la BD que luego tu compañero conectará en RDS)
const USUARIO_TEST = {
  id: 1,
  username: 'admin_cruzazul',
  password: 'password123', // En producción usar bcrypt
  mfaWebSecret: '123456',  // Código simulado para paso 2
  mfaAdminSecret: '987654' // Código simulado para paso 3 (SSH/Admin)
};

// PASO 1: Login básico (Usuario y Contraseña)
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === USUARIO_TEST.username && password === USUARIO_TEST.password) {
    // Generamos un token temporal de Paso 1
    const tokenPaso1 = jwt.sign(
      { id: USUARIO_TEST.id, username: USUARIO_TEST.username, mfaSteps: 1 },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );
    
    return res.json({ 
      mensaje: 'Paso 1 aprobado. Ingrese el código MFA para el sitio Web (Paso 2).', 
      token: tokenPaso1 
    });
  }

  res.status(401).json({ error: 'Credenciales incorrectas.' });
});

// PASO 2: Verificación MFA para Sitio Web (2 Pasos en total)
router.post('/verificar-mfa-web', verificarAcceso(1), (req, res) => {
  const { codigo } = req.body;

  if (codigo === USUARIO_TEST.mfaWebSecret) {
    // Elevamos el nivel del token a 2 pasos
    const tokenPaso2 = jwt.sign(
      { id: req.usuario.id, username: req.usuario.username, mfaSteps: 2 },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    return res.json({ 
      mensaje: 'Autenticación Web completada con éxito (MFA 2 Pasos).', 
      token: tokenPaso2 
    });
  }

  res.status(400).json({ error: 'Código MFA Web incorrecto.' });
});

// PASO 3: Verificación MFA para Servicios Administrativos (3 Pasos en total, ej: Open-SSH)
router.post('/verificar-mfa-admin', verificarAcceso(2), (req, res) => {
  const { codigoAdmin } = req.body;

  if (codigoAdmin === USUARIO_TEST.mfaAdminSecret) {
    // Elevamos el token al máximo nivel (3 pasos)
    const tokenPaso3 = jwt.sign(
      { id: req.usuario.id, username: req.usuario.username, mfaSteps: 3 },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.json({ 
      mensaje: 'Autenticación de Administrador aprobada (MFA 3 Pasos - Acceso SSH liberado).', 
      token: tokenPaso3 
    });
  }

  res.status(400).json({ error: 'Código MFA Administrador incorrecto.' });
});

// --- RUTAS PROTEGIDAS POR ACCESO CONDICIONAL ---

// Ruta del sitio web (Requiere mínimo 2 pasos)
router.get('/sitio-web', verificarAcceso(2), (req, res) => {
  res.json({ mensaje: 'Bienvenido al panel interno de Farmacias Cruz Azul (Acceso Seguro).' });
});

// Ruta de administración avanzada / Open-SSH (Requiere estrictamente 3 pasos)
router.get('/servicio-ssh', verificarAcceso(3), (req, res) => {
  res.json({ mensaje: 'Acceso concedido a la consola de administración Open-SSH de la infraestructura.' });
});

module.exports = router;
