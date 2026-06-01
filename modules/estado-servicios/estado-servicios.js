import ModuleService from '../../services/module-service.js';

/**
 * Lógica del módulo de administración de servicios
 */

export function init(container) {
    console.log("Iniciando Módulo: Estado de Servicios");
    const root = container || document;
    
    // Micro-espera para asegurar sincronización con el DOM
    setTimeout(() => {
        const states = ModuleService.getStates();

        const config = [
            { id: 'switch-dashboard', key: 'dashboard' },
            { id: 'switch-matriculas', key: 'matriculas' },
            { id: 'switch-tickets', key: 'tickets-ia' },
            { id: 'switch-reportes', key: 'reportes' }
        ];

        config.forEach(item => {
            const el = root.querySelector(`#${item.id}`);
            if (el) {
                el.checked = states[item.key] !== false;

                el.addEventListener('change', (e) => {
                    ModuleService.setStatus(item.key, e.target.checked);
                    
                    const card = el.closest('.nx-card');
                    if (card) {
                        const badge = card.querySelector('.nx-badge');
                        if (badge) {
                            badge.textContent = e.target.checked ? 'Online' : 'Offline';
                            badge.className = `nx-badge nx-badge-${e.target.checked ? 'success' : 'danger'}`;
                        }
                    }
                });
            }
        });

        // Inicializar gráfico de latencia de Tickets IA
        initLatencyChart(root);
    }, 50);
}

function initLatencyChart(root) {
    const canvas = root.querySelector('#latency-chart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Generar gradiente para el área
    const gradient = ctx.createLinearGradient(0, 0, 0, 200);
    gradient.addColorStop(0, 'rgba(0, 113, 227, 0.28)');
    gradient.addColorStop(1, 'rgba(0, 113, 227, 0.0)');

    // Datos simulados históricos
    const dataPoints = [310, 280, 420, 350, 290, 310, 430, 380, 330, 360, 290, 320];
    const labels = Array.from({ length: 12 }, (_, i) => `-${(12 - i) * 10}s`);

    const chartConfig = {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Latencia Llama 3 API',
                data: dataPoints,
                borderColor: '#0071e3',
                borderWidth: 2,
                backgroundColor: gradient,
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: '#0071e3',
                pointBorderColor: '#ffffff',
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(128, 128, 128, 0.06)' },
                    ticks: { color: 'rgba(128, 128, 128, 0.6)', font: { size: 10 } }
                },
                y: {
                    grid: { color: 'rgba(128, 128, 128, 0.06)' },
                    ticks: { color: 'rgba(128, 128, 128, 0.6)', font: { size: 10 } },
                    min: 200,
                    max: 500
                }
            }
        }
    };

    // Crear la instancia de Chart.js
    const chart = new Chart(ctx, chartConfig);

    // Simular actualizaciones en tiempo real de latencia
    const avgLatencyEl = root.querySelector('#avg-latency');
    const lastLatencyEl = root.querySelector('#last-latency');

    const updateInterval = setInterval(() => {
        // Verificar si la pestaña o el módulo cambió y el canvas ya no existe en el DOM
        if (!document.body.contains(canvas)) {
            clearInterval(updateInterval);
            console.log("Módulo Estado de Servicios cerrado. Limpiando simulador de latencia.");
            return;
        }

        // Generar nueva latencia simulada
        const newLatency = Math.floor(Math.random() * (450 - 270) + 270);
        
        // Desplazar datos
        dataPoints.shift();
        dataPoints.push(newLatency);

        // Actualizar gráfico
        chart.update();

        // Actualizar valores en el DOM
        if (lastLatencyEl) lastLatencyEl.textContent = `${newLatency} ms`;
        if (avgLatencyEl) {
            const avg = Math.round(dataPoints.reduce((a, b) => a + b, 0) / dataPoints.length);
            avgLatencyEl.textContent = `${avg} ms`;
        }
    }, 4000);
}
