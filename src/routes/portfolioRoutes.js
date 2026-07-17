// src/routes/portfolioRoutes.js
const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');

// ==========================================
// RUTA DE LA VISTA PRINCIPAL (HOME)
// ==========================================
router.get('/', portfolioController.renderHome);

// ==========================================
// RUTA DE LA VISTA INTERACTIVA (DASHBOARD)
// ==========================================
router.get('/dashboard-demo', (req, res) => {
    // Renderiza la plantilla 'dashboard.ejs' enviando el título correspondiente
    res.render('dashboard', { title: 'LSR Dashboard Generator' });
});

// ==========================================
// RUTAS DE API DINÁMICAS (Llamadas vía Fetch)
// ==========================================
router.post('/api/v1/scan', portfolioController.handlePortScan);
router.post('/api/v1/auth/token', portfolioController.handleJwtGeneration);
router.get('/api/v1/health-check', portfolioController.handleHealthCheck);

// ==========================================
// RUTAS DE ADMINISTRACIÓN Y FORMULARIOS
// ==========================================
router.post('/api/v1/contacto', portfolioController.handleContactForm);
router.get('/admin/messages', portfolioController.renderAdminMessages);

module.exports = router;