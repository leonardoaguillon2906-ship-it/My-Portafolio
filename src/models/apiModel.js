const net = require('net');
const crypto = require('crypto');
const os = require('os');

class ApiModel {

    /**
     * 1. ESCÁNER DE PUERTOS REAL
     * Utiliza Sockets TCP nativos para verificar si un puerto está abierto.
     */
    static checkPort(port, host) {
        return new Promise((resolve) => {
            const socket = new net.Socket();
            socket.setTimeout(1200); // Tiempo límite de 1.2 segundos para responder

            socket.on('connect', () => {
                socket.destroy();
                // Identificación de servicio básica
                let service = 'Unknown';
                if (port === 22) service = 'SSH';
                else if (port === 80) service = 'HTTP';
                else if (port === 443) service = 'HTTPS';
                else if (port === 3000) service = 'Node/Express';
                else if (port === 8080) service = 'HTTP-Proxy';

                resolve({ port, service, state: "open" });
            });

            socket.on('timeout', () => {
                socket.destroy();
                resolve({ port, state: "filtered/timeout" });
            });

            socket.on('error', () => {
                socket.destroy();
                resolve({ port, state: "closed" });
            });

            socket.connect(port, host);
        });
    }

    static async runPortScan(host) {
        // Por seguridad, limita el escaneo al localhost o una IP del laboratorio si no se especifica
        const target = host || '127.0.0.1';
        
        // Puertos estándar y comunes para auditar
        const portsToScan = [22, 80, 135, 443, 445, 3000, 3306, 8080];
        const startTime = Date.now();

        // Ejecuta todas las conexiones socket en paralelo
        const scanPromises = portsToScan.map(port => this.checkPort(port, target));
        const results = await Promise.all(scanPromises);
        
        // Filtra solo los puertos que respondieron exitosamente
        const openPorts = results.filter(r => r.state === 'open');

        return {
            status: "success",
            host: target,
            ports_scanned: portsToScan.length,
            open_ports: openPorts,
            execution_time: `${((Date.now() - startTime) / 1000).toFixed(2)}s`
        };
    }

    /**
     * 2. GENERADOR DE JWT REAL (FIRMADO CON CRIPTOGRAFÍA)
     * Genera un Token Web JSON real utilizando criptografía HMAC-SHA256 nativa.
     */
    static generateJwt() {
        const header = { alg: "HS256", typ: "JWT" };
        const payload = {
            user_id: "usr_99a8b2",
            role: "SecOps-Admin",
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 3600 // Expiración en 1 hora
        };
        
        // Clave secreta fuerte simulada en el Servidor
        const secret = "firma_segura_de_tu_portafolio_2026_@!";

        // Función para codificar a Base64URL de forma estándar
        const base64UrlEncode = (obj) => {
            return Buffer.from(JSON.stringify(obj))
                .toString('base64')
                .replace(/=/g, '')
                .replace(/\+/g, '-')
                .replace(/\//g, '_');
        };

        const encodedHeader = base64UrlEncode(header);
        const encodedPayload = base64UrlEncode(payload);

        // Firma criptográfica SHA255 real
        const signature = crypto
            .createHmac('sha256', secret)
            .update(`${encodedHeader}.${encodedPayload}`)
            .digest('base64')
            .replace(/=/g, '')
            .replace(/\+/g, '-')
            .replace(/\//g, '_');

        return {
            status: "authenticated",
            user_id: payload.user_id,
            role: payload.role,
            token: `${encodedHeader}.${encodedPayload}.${signature}`,
            expires_in: "3600s"
        };
    }

    /**
     * 3. MONITOREO DE SISTEMA REAL
     * Lee las especificaciones de hardware en tiempo real del sistema donde corre el servidor.
     */
    static getHealthStatus() {
        const totalMem = os.totalmem();
        const freeMem = os.freemem();
        const usedMem = totalMem - freeMem;
        const ramUsagePct = ((usedMem / totalMem) * 100).toFixed(1);

        // Calcula el promedio de carga del sistema
        const loadAvg = os.loadavg(); 

        return {
            server: os.hostname(),
            platform: `${os.type()} (${os.arch()})`,
            status: "healthy",
            cpu_cores: os.cpus().length,
            cpu_model: os.cpus()[0] ? os.cpus()[0].model.trim() : "Unknown",
            cpu_load_1m: `${(loadAvg[0] * 100).toFixed(1)}%`,
            ram_usage: `${ramUsagePct}%`,
            free_ram: `${(freeMem / 1024 / 1024 / 1024).toFixed(2)} GB`,
            total_ram: `${(totalMem / 1024 / 1024 / 1024).toFixed(2)} GB`,
            uptime_hours: `${(os.uptime() / 3600).toFixed(2)} hrs`
        };
    }
}

module.exports = ApiModel;