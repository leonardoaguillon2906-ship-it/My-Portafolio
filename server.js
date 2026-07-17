const express = require('express');
const path = require('path');
const portfolioRoutes = require('./src/routes/portfolioRoutes');

const app = express();

// Configurar EJS como motor de plantillas (Vistas)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views')); 

// Servir archivos estáticos (CSS, JS, imágenes del banner, logos, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Habilitar parsing de datos (Crucial para las llamadas de tus APIs y formularios)
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

// Usar las rutas del portafolio (Incluye las nuevas rutas de tu Blog Técnico)
app.use('/', portfolioRoutes);

// Manejo de errores 404 (Ruta no encontrada) - Si una ruta o post de blog no existe, renderiza home con error
app.use((req, res, next) => {
    res.status(404).render('home', { 
        title: '404 - Página No Encontrada', 
        error: 'La sección que buscas no existe en el sistema.' 
    }); 
});

// Manejo de errores global del sistema
app.use((err, req, res, next) => {
    console.error("❌ Error en el servidor:", err.stack);
    res.status(500).send('Algo salió mal en el servidor.');
});

// CONDICIONAL PARA VERCEL: 
// Solo levantamos el puerto de escucha local si NO estamos en producción (Vercel)
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`🚀 Servidor MVC corriendo en http://localhost:${PORT}`);
    });
}

// Exportamos la app para que Vercel la maneje como una función Serverless
module.exports = app;