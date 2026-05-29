/**
 * Lógica del módulo de Reportes (Admin)
 */

export async function init(container) {
    console.log("Iniciando Módulo: Reportes");
    const root = container || document;

    // Micro-espera para asegurar sincronización con el DOM
    setTimeout(() => {
        initCharts(root);
        renderLogs(root);
    }, 50);
}

function initCharts(root) {
    const ctxServicios = root.querySelector('#chart-servicios');
    const ctxIA = root.querySelector('#chart-ia');

    if (!ctxServicios || !ctxIA || typeof Chart === 'undefined') {
        console.warn("Reportes: Chart.js no está disponible o no se encontraron los canvas.");
        return;
    }

    // Gráfico de Líneas - Uso de Servicios
    new Chart(ctxServicios, {
        type: 'line',
        data: {
            labels: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'],
            datasets: [
                {
                    label: 'Matrículas',
                    data: [12, 19, 3, 5, 2, 3, 10],
                    borderColor: '#0071e3',
                    backgroundColor: 'rgba(0, 113, 227, 0.1)',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Tickets IA',
                    data: [2, 5, 20, 12, 11, 2, 5],
                    borderColor: '#30d158',
                    backgroundColor: 'rgba(48, 209, 88, 0.1)',
                    fill: true,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: true, position: 'bottom', labels: { color: '#a1a1aa', font: { family: 'Inter' } } }
            },
            scales: {
                y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#71717a' } },
                x: { grid: { display: false }, ticks: { color: '#71717a' } }
            }
        }
    });

    // Gráfico de Dona - Distribución IA
    new Chart(ctxIA, {
        type: 'doughnut',
        data: {
            labels: ['Gemini', 'Groq', 'Manual'],
            datasets: [{
                data: [64, 26, 10],
                backgroundColor: ['#0071e3', '#30d158', '#3f3f46'],
                borderWidth: 0,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            cutout: '75%'
        }
    });
}

function renderLogs(root) {
    const tbody = root.querySelector('#tbody-logs');
    if (!tbody) return;

    const mockLogs = [
        { event: 'Login Exitoso', module: 'Auth', user: 'admin', time: '10:45 AM', status: 'Success' },
        { event: 'Error de Conexión', module: 'Tickets IA', user: 'u202312', time: '09:30 AM', status: 'Error' },
        { event: 'Nueva Matrícula', module: 'Matrículas', user: 'u202405', time: '08:15 AM', status: 'Success' },
        { event: 'Sincronización FB', module: 'Realtime', user: 'system', time: '07:00 AM', status: 'Success' }
    ];

    tbody.innerHTML = mockLogs.map(log => `
        <tr>
            <td class="fw-medium">${log.event}</td>
            <td><span class="nx-badge nx-badge-outline">${log.module}</span></td>
            <td class="text-secondary">${log.user}</td>
            <td class="text-muted small">${log.time}</td>
            <td class="text-end">
                <span class="nx-badge nx-badge-${log.status === 'Success' ? 'success' : 'danger'}">
                    ${log.status}
                </span>
            </td>
        </tr>
    `).join('');
}
