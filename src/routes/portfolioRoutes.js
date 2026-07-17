// src/routes/portfolioRoutes.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// ❌ SE ELIMINÓ: const { marked } = require('marked'); <--- Esto rompía Vercel

// Importamos tu controlador original
const portfolioController = require('../controllers/portfolioController');

// ==========================================
// RUTA DE LA VISTA PRINCIPAL (HOME)
// ==========================================
router.get('/', portfolioController.renderHome);

// ==========================================
// RUTA DE LA VISTA INTERACTIVA (DASHBOARD)
// ==========================================
router.get('/dashboard-demo', (req, res) => {
    res.render('dashboard', { title: 'LSR Dashboard Generator' });
});

// ==========================================
// RUTAS DEL BLOG TÉCNICO (Markdown)
// ==========================================

// 1. Listar todos los artículos del blog
router.get('/blog', (req, res) => {
    try {
        const postsDirectory = path.resolve(process.cwd(), 'posts');
        let posts = [];

        if (fs.existsSync(postsDirectory)) {
            const fileNames = fs.readdirSync(postsDirectory);
            
            posts = fileNames
                .filter(fileName => fileName.endsWith('.md'))
                .map(fileName => {
                    const slug = fileName.replace(/\.md$/, '');
                    const fullPath = path.join(postsDirectory, fileName);
                    const fileContents = fs.readFileSync(fullPath, 'utf8');
                    const { data } = matter(fileContents);

                    return {
                        slug,
                        ...data
                    };
                });
        }

        res.render('blog', { title: 'Mi Blog Técnico', posts });
    } catch (error) {
        console.error("❌ Error crítico en la ruta /blog:", error);
        res.render('blog', { title: 'Mi Blog Técnico', posts: [] });
    }
});

// 2. Leer un artículo individual dinámicamente usando su slug
// 💡 Transformamos la función a asíncrona (async) para poder usar el import dinámico
router.get('/blog/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        const postsDirectory = path.resolve(process.cwd(), 'posts');
        const fullPath = path.join(postsDirectory, `${slug}.md`);

        if (!fs.existsSync(fullPath)) {
            console.warn(`⚠️ Post no encontrado en el sistema de archivos: ${slug}`);
            return res.status(404).send('El artículo que buscas no existe en el blog.');
        }

        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);
        
        // 🔥 Importación dinámica asíncrona que exige Vercel para ES Modules
        const { marked } = await import('marked');
        
        // Parseamos el contenido de Markdown a HTML de manera segura
        const htmlContent = marked.parse(content);

        res.render('post', { 
            title: data.title, 
            meta: data, 
            content: htmlContent 
        });
    } catch (error) {
        console.error("❌ Error en la ruta /blog/:slug:", error);
        res.status(500).send('Algo salió mal en el servidor al cargar el artículo.');
    }
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
