import MockLoader from '../../services/mock-loader.js';

/**
 * Lógica del módulo de Matrículas - Refinado para nueva Data
 */

let allAlumnos = [];

export async function init(container) {
    const root = container || document;
    
    setTimeout(async () => {
        const tbody = root.querySelector('#tbody-matriculas');
        const searchInput = root.querySelector('#search-alumnos');
        const noResults = root.querySelector('#no-results');

        if (!tbody || !searchInput) return;

        // Cargar datos
        const data = await MockLoader.load('matriculas');
        allAlumnos = data ? data.students : [];

        if (!allAlumnos || !Array.isArray(allAlumnos)) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center p-4">Sin datos.</td></tr>';
            return;
        }

        renderTable(allAlumnos, tbody);

        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = allAlumnos.filter(a => 
                a.nombres.toLowerCase().includes(term) || 
                a.apellidos.toLowerCase().includes(term) ||
                a.codigo.toLowerCase().includes(term) ||
                a.ciclo.toLowerCase().includes(term)
            );

            renderTable(filtered, tbody);
            if (noResults) filtered.length === 0 ? noResults.classList.remove('d-none') : noResults.classList.add('d-none');
        });
    }, 50);
}

function renderTable(alumnos, tbody) {
    if (!tbody) return;

    tbody.innerHTML = alumnos.map(alumno => {
        // Lógica para badge de estado
        let badgeClass = 'warning';
        if (alumno.estado === 'Matriculado') badgeClass = 'success';
        if (alumno.estado === 'Reservado') badgeClass = 'secondary';

        // Lógica para badge de turno
        const turnoClass = alumno.turno === 'Mañana' ? 'text-primary' : 'text-warning';

        return `
        <tr>
            <td>
                <div class="avatar-circle">
                    ${alumno.nombres.charAt(0)}
                </div>
            </td>
            <td>
                <div class="fw-bold small-text">${alumno.nombres} ${alumno.apellidos}</div>
                <div class="text-muted extra-small">${alumno.correo}</div>
            </td>
            <td><span class="code-badge">${alumno.codigo}</span></td>
            <td>
                <div class="small-text">${alumno.ciclo}</div>
            </td>
            <td>
                <span class="small-text ${turnoClass} fw-medium">
                    <i class="bi bi-clock-history me-1"></i> ${alumno.turno}
                </span>
            </td>
            <td>
                <span class="nx-badge nx-badge-${badgeClass}">
                    ${alumno.estado}
                </span>
            </td>
            <td class="text-end">
                <button class="nx-btn nx-btn-outline icon-btn" title="Editar">
                    <i class="bi bi-three-dots"></i>
                </button>
            </td>
        </tr>
    `}).join('');
}
