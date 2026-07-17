const ApiModel = require('../models/apiModel');
const ContactModel = require('../models/contactModel');

exports.renderHome = (req, res) => {
    // Definimos las variables dinámicas que usará la vista EJS
    const portfolioData = {
        title: "Portafolio Premium | Dev, Soporte & Seguridad",
        name: "Tu Nombre",
        status: "Disponible · Dev y Seguridad",
        lastUpdated: "16/07/2026"
    };
    
    // Renderiza la plantilla 'index.ejs' y le inyecta los datos
    res.render('index', { data: portfolioData });
};

// Endpoints controladores para responder a las llamadas fetch de tus botones
exports.handlePortScan = (req, res) => {
    const { host } = req.body;
    const result = ApiModel.runPortScan(host);
    res.json(result);
};

exports.handleJwtGeneration = (req, res) => {
    const result = ApiModel.generateJwt();
    res.json(result);
};

exports.handleHealthCheck = (req, res) => {
    const result = ApiModel.getHealthStatus();
    res.json(result);
};

exports.handleContactForm = async (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
        return res.status(400).json({ status: "error", msg: "Todos los campos son obligatorios." });
    }
    
    const saved = await ContactModel.saveMessage(name, email, message);
    res.json({ status: "success", msg: "¡Mensaje guardado correctamente!", data: saved });
};

// Endpoint protegido (idealmente) para ver los mensajes recibidos
exports.renderAdminMessages = async (req, res) => {
    const messages = await ContactModel.getAllMessages();
    res.render('admin', { messages }); // Requeriría crear una vista corta 'admin.ejs'
};