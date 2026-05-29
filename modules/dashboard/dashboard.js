import MockLoader from '../../services/mock-loader.js';

/**
 * Lógica del módulo Dashboard
 */

export async function init(container) {
    console.log("Iniciando Módulo: Dashboard");
    const root = container || document;

    setTimeout(async () => {
        // Cargar datos en paralelo para mejorar performance
        const [studentData, ticketData] = await Promise.all([
            MockLoader.load('matriculas'),
            MockLoader.load('tickets-demo')
        ]);

        const students = studentData ? studentData.students : [];
        const tickets = ticketData ? ticketData.tickets : [];

        // 1. Actualizar Contadores (Stats)
        const statStudents = root.querySelector('#stat-students');
        const statTickets = root.querySelector('#stat-tickets');

        if (statStudents) statStudents.textContent = students.length;
        if (statTickets) statTickets.textContent = tickets.filter(t => t.estado === 'Abierto').length;

        // 2. Renderizar tabla de ingresos recientes (últimos 3)
        const tbody = root.querySelector('#dash-tbody-students');
        if (tbody) {
            const recentStudents = students.slice(0, 3);
            tbody.innerHTML = recentStudents.map(alumno => `
                <tr>
                    <td>
                        <div class="d-flex align-items-center gap-3">
                            <div class="avatar-circle" style="width: 32px; height: 32px; font-size: 0.7rem; border-radius: 8px;">
                                ${alumno.nombres.charAt(0)}
                            </div>
                            <div class="fw-medium small">${alumno.nombres}</div>
                        </div>
                    </td>
                    <td class="text-muted small">${alumno.ciclo}</td>
                    <td class="text-end">
                        <span class="nx-badge nx-badge-${alumno.estado === 'Matriculado' ? 'success' : 'warning'}" style="font-size: 0.6rem;">
                            ${alumno.estado}
                        </span>
                    </td>
                </tr>
            `).join('');
        }
    }, 50);
}
