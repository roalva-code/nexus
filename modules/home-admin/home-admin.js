/**
 * Lógica del módulo Home Admin
 */

export async function init(container) {
    console.log("Iniciando Módulo: Home Admin (Command Center)");
    const root = container || document;

    setTimeout(() => {
        initAdminDashboardChart(root);
    }, 50);
}

function initAdminDashboardChart(root) {
    const canvas = root.querySelector('#admin-main-chart');
    if (!canvas || typeof Chart === 'undefined') return;

    new Chart(canvas, {
        type: 'line',
        data: {
            labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'],
            datasets: [
                {
                    label: 'Red Institucional',
                    data: [30, 25, 45, 90, 85, 60, 40],
                    borderColor: '#0071e3',
                    borderWidth: 2,
                    pointRadius: 0,
                    tension: 0.4,
                    fill: true,
                    backgroundColor: 'rgba(0, 113, 227, 0.05)'
                },
                {
                    label: 'Consultas IA',
                    data: [5, 2, 15, 65, 75, 30, 10],
                    borderColor: '#30d158',
                    borderWidth: 2,
                    pointRadius: 0,
                    tension: 0.4,
                    fill: true,
                    backgroundColor: 'rgba(48, 209, 88, 0.05)'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { color: '#71717a', font: { size: 10 } }
                },
                y: {
                    grid: { color: 'rgba(255, 255, 255, 0.03)' },
                    ticks: { color: '#71717a', font: { size: 10 } }
                }
            }
        }
    });
}
