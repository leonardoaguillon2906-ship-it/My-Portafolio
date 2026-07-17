document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("terminal-input");
    const output = document.getElementById("terminal-output");
    const container = document.getElementById("terminal-container");

    // Verificar que los elementos existan en la página activa
    if (!input || !output || !container) return;

    // Historial básico de comandos
    let commandHistory = [];
    let historyIndex = -1;

    // 1. Forzar el foco en el input al hacer clic en la terminal
    container.addEventListener("click", () => {
        input.focus();
    });

    // 2. Escuchar la pulsación de teclas en el input
    input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            const fullCommand = input.value.trim();
            const [command, ...args] = fullCommand.toLowerCase().split(' ');

            // Imprimir prompt con el comando ingresado
            const prompt = `<div class="flex items-center gap-1.5 mt-2"><span class="text-emerald-400 font-bold">lsr@cyber-sec</span><span class="text-slate-400">:</span><span class="text-indigo-400">~</span><span class="text-cyan-400">$</span> <span class="text-slate-300">${fullCommand}</span></div>`;
            output.innerHTML += prompt;

            // Guardar en el historial
            if (fullCommand) {
                commandHistory.push(fullCommand);
                historyIndex = commandHistory.length;
            }

            let response = "";

            if (fullCommand !== "") {
                switch (command) {
                    case "help":
                        response = `<div class="text-slate-300 font-semibold mb-1">Comandos disponibles:</div>` +
                                   `<div class="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-400">` +
                                   `<div><strong class="text-cyan-400">help</strong> - Muestra esta ayuda.</div>` +
                                   `<div><strong class="text-cyan-400">clear</strong> - Limpia la pantalla.</div>` +
                                   `<div><strong class="text-cyan-400">ls</strong> - Lista archivos (simulado).</div>` +
                                   `<div><strong class="text-cyan-400">cat</strong> - Muestra contenido de un archivo.</div>` +
                                   `<div><strong class="text-cyan-400">whoami</strong> - Usuario actual.</div>` +
                                   `<div><strong class="text-cyan-400">ipconfig</strong> - Info de red.</div>` +
                                   `<div><strong class="text-cyan-400">nmap</strong> - Simulador de escaneo básico.</div>` +
                                   `</div>`;
                        break;
                    case "clear":
                        output.innerHTML = "";
                        response = "";
                        break;
                    case "ls":
                        response = `<div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-indigo-400">` +
                                   `<span>README.txt</span>` +
                                   `<span class="text-emerald-400">backups/</span>` +
                                   `<span>vulnerabilidades.log</span>` +
                                   `<span class="text-emerald-400">scripts/</span>` +
                                   `</div>`;
                        break;
                    case "cat":
                        if (args[0] === "readme.txt") {
                            response = `<div class="text-slate-300 p-2 border border-slate-800 bg-slate-900/80 rounded-lg font-mono text-[11px] leading-relaxed">` +
                                       `<h5 class="text-cyan-400 font-bold mb-1">LSR Security Corp - Internal Memo</h5>` +
                                       `Este sistema simula un Honeypot controlado.\n` +
                                       `Cualquier intento de intrusión real está siendo monitoreado.\n` +
                                       `Para pruebas seguras, usar 'nmap -h'.</div>`;
                        } else if (args[0] === "vulnerabilidades.log") {
                            response = `<div class="text-red-400/90 font-mono text-[10px] leading-relaxed">` +
                                       `[WARN] 2026-07-16 10:33:12 - Intento de fuerza bruta detectado en SSH.\n` +
                                       `[WARN] 2026-07-16 11:01:45 - Escaneo de puertos desde IP: 192.168.1.100.\n` +
                                       `[INFO] 2026-07-16 11:15:01 - Backup encriptado correctamente (AES-256).</div>`;
                        } else if (!args[0]) {
                            response = `<span class="text-red-400">Uso: cat [nombre_archivo] (ej: cat README.txt)</span>`;
                        } else {
                            response = `<span class="text-red-400">cat: ${args[0]}: No existe el archivo.</span>`;
                        }
                        break;
                    case "whoami":
                        response = `<span class="text-slate-300">guest_user (Simulación de Honeypot)</span>`;
                        break;
                    case "ipconfig":
                    case "ifconfig":
                        response = `<div class="text-slate-400 font-mono text-[10px] leading-relaxed">` +
                                   `eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500\n` +
                                   `        inet <span class="text-emerald-400">10.0.2.15</span>  netmask 255.255.255.0  broadcast 10.0.2.255\n` +
                                   `        ether 08:00:27:af:a1:00  txqueuelen 1000  (Ethernet)</div>`;
                        break;
                    case "nmap":
                        if (args[0] === "10.0.2.15" || args[0] === "localhost") {
                            response = `<div class="text-slate-300 font-mono text-[10px] leading-relaxed">` +
                                       `Iniciando Nmap 7.80 ( https://nmap.org ) at 2026-07-16 17:33 CET\n` +
                                       `Reporte de escaneo para ${args[0]}\n` +
                                       `Host está activo (latencia 0.0001s).\n` +
                                       `PUERTO     ESTADO   SERVICIO\n` +
                                       `<span class="text-emerald-400">22/tcp     open     ssh</span>\n` +
                                       `<span class="text-emerald-400">80/tcp     open     http</span>\n` +
                                       `<span class="text-red-400">3306/tcp   filtered mysql</span>\n\n` +
                                       `Nmap finalizado: 1 dirección IP escaneada en 0.55 segundos</div>`;
                        } else if (args[0] === "-h" || args[0] === "--help") {
                            response = `<span class="text-slate-400">Uso: nmap [IP_destino] (IPs válidas: localhost, 10.0.2.15)</span>`;
                        } else if (!args[0]) {
                            response = `<span class="text-red-400">Error: Debes especificar una IP de destino. Usar 'nmap -h'.</span>`;
                        } else {
                            response = `<span class="text-red-400">Error: Escaneo bloqueado en la simulación para ${args[0]}.</span>`;
                        }
                        break;
                    default:
                        response = `<span class="text-red-400">Comando no encontrado: '${command}'. Escribe 'help' para ver opciones.</span>`;
                }
            }

            // Pintar la respuesta si existe
            if (response !== "") {
                const responseDiv = document.createElement("div");
                responseDiv.className = "mt-1.5";
                responseDiv.innerHTML = response;
                output.appendChild(responseDiv);
            }

            // Limpiar input y desplazar scroll hacia abajo
            input.value = "";
            container.scrollTop = container.scrollHeight;

        } else if (event.key === "ArrowUp") {
            if (historyIndex > 0) {
                historyIndex--;
                input.value = commandHistory[historyIndex];
            }
            event.preventDefault();
        } else if (event.key === "ArrowDown") {
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                input.value = commandHistory[historyIndex];
            } else {
                historyIndex = commandHistory.length;
                input.value = "";
            }
            event.preventDefault();
        }
    });
});