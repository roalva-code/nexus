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
    }, 50);
}
