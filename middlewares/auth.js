const jwt = require('jsonwebtoken');

// Middleware para verificar el acceso condicional por Token
const verificarAcceso = (pasosRequeridos) => {
  return (req, res, next) => {
    // Buscar el token en los headers (Bearer Token)
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
    }

    try {
      // Verificar la firma del token
      const verificado = jwt.verify(token, process.env.JWT_SECRET);
      req.usuario = verificado;

      // CONTROL CONDICIONAL: Verificar si cumple con los niveles de MFA requeridos
      if (req.usuario.mfaSteps < pasosRequeridos) {
        return res.status(403).json({ 
          error: `Acceso restringido. Este recurso requiere una autenticación de ${pasosRequeridos} pasos.`,
          mfaActual: req.usuario.mfaSteps
        });
      }

      next(); // Si cumple todo, continúa a la ruta
    } catch (err) {
      res.status(403).json({ error: 'Token inválido o expirado.' });
    }
  };
};

module.exports = { verificarAcceso };
