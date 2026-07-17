let myChartInstance = null;

async function processSheetData() {
    const urlInput = document.getElementById('sheet-url').value.trim();
    const totalCountElement = document.getElementById('total-count');
    const ctx = document.getElementById('myChart').getContext('2d');

    if (!urlInput) {
        alert("Por favor, introduce una URL válida de Google Sheets.");
        return;
    }

    try {
        // 1. Extraer el ID del documento usando una expresión regular fuerte
        const matches = urlInput.match(/\/d\/([a-zA-Z0-9-_]+)/);
        if (!matches || !matches[1]) {
            alert("No se pudo extraer el ID del documento. Verifica el formato de la URL.");
            return;
        }
        const sheetId = matches[1];

        // Intentar extraer el ID de la hoja específica (gid) si existe, por defecto es 0
        const gidMatches = urlInput.match(/[#&]gid=([0-9]+)/);
        const gid = gidMatches ? gidMatches[1] : '0';

        // 2. Construir la URL de exportación a CSV directa
        const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;

        // 3. Hacer el fetch al recurso público
        const response = await fetch(csvUrl);
        if (!response.ok) {
            throw new Error("No se pudo acceder a la hoja. Asegúrate de que esté compartida de forma pública.");
        }

        const csvText = await response.text();
        
        // 4. Procesar el CSV de forma nativa e inteligente
        const rows = csvText.split('\n').map(row => {
            // Manejar comas internas si hay comillas en los textos
            return row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(cell => cell.replace(/^"|"$/g, '').trim());
        }).filter(row => row.length > 1 && row[0] !== "");

        if (rows.length <= 1) {
            alert("El documento parece estar vacío o no tiene suficientes columnas.");
            return;
        }

        // Extraer encabezados y registros
        const headers = rows[0];
        const dataRows = rows.slice(1);

        // Tomar la primera columna como etiquetas (Labels) y la segunda como datos (Values)
        const labels = [];
        const values = [];
        let grandTotal = 0;

        dataRows.forEach(row => {
            labels.push(row[0]);
            // Sanitizar número quitando signos de dólar, espacios o comas de miles
            const rawValue = row[1] ? row[1].replace(/[\$\s,]/g, '') : "0";
            const numValue = parseFloat(rawValue) || 0;
            values.push(numValue);
            grandTotal += numValue;
        });

        // 5. Actualizar interfaz de usuario
        // Formatear total con decimales o estilo moneda local
        totalCountElement.innerText = grandTotal.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 });

        // 6. Destruir gráfico anterior para evitar superposiciones raras al renderizar de nuevo
        if (myChartInstance) {
            myChartInstance.destroy();
        }

        // 7. Renderizar el nuevo gráfico con diseño Cyberpunk dinámico
        myChartInstance = new Chart(ctx, {
            type: 'line', // Tipo línea se ve increíble para tendencias financieras/facturas
            data: {
                labels: labels,
                datasets: [{
                    label: headers[1] || 'Monto',
                    data: values,
                    borderColor: '#6366f1', // Indigo
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.3,
                    pointBackgroundColor: '#10b981', // Verde esmeralda para los puntos
                    pointBorderColor: '#fff',
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: { color: '#94a3b8', font: { family: 'monospace' } }
                    }
                },
                scales: {
                    y: {
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { 
                            color: '#94a3b8',
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    },
                    x: {
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: '#94a3b8', font: { size: 9 } }
                    }
                }
            }
        });

    } catch (error) {
        console.error(error);
        alert("Error al procesar los datos: " + error.message);
    }
}