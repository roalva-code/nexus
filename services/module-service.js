import RealtimeService from './realtime-service.js';

/**
 * Servicio para gestionar el estado (ONLINE/OFFLINE) de los módulos
 */

const ModuleService = {
    // Estados por defecto
    defaultStates: {
        'dashboard': true,
        'matriculas': true,
        'tickets-ia': true,
        'reportes': true
    },

    /**
     * Inicializa la sincronización en tiempo real
     */
    init() {
        RealtimeService.initListener((newStates) => {
            const current = this.getStates();
            // Solo disparar evento si algo cambió realmente para evitar loops
            if (JSON.stringify(current) !== JSON.stringify(newStates)) {
                localStorage.setItem('nexus_module_states', JSON.stringify(newStates));
                
                // Notificar a la UI para cambios reactivos
                Object.keys(newStates).forEach(key => {
                    if (current[key] !== newStates[key]) {
                        window.dispatchEvent(new CustomEvent('moduleStatusChanged', { 
                            detail: { moduleName: key, status: newStates[key] } 
                        }));
                    }
                });
            }
        });
    },

    /**
     * Obtiene el estado de todos los módulos
     */
    getStates() {
        const saved = localStorage.getItem('nexus_module_states');
        return saved ? JSON.parse(saved) : this.defaultStates;
    },

    /**
     * Verifica si un módulo específico está activo
     */
    isOnline(moduleName) {
        const states = this.getStates();
        return states[moduleName] !== undefined ? states[moduleName] : true;
    },

    /**
     * Cambia el estado de un módulo y persiste en LocalStorage + Firebase
     */
    setStatus(moduleName, status) {
        const states = this.getStates();
        states[moduleName] = status;
        localStorage.setItem('nexus_module_states', JSON.stringify(states));
        
        // Sincronizar con la nube (Async)
        RealtimeService.saveState(moduleName, status);
        
        // Notificar localmente
        window.dispatchEvent(new CustomEvent('moduleStatusChanged', { 
            detail: { moduleName, status } 
        }));
        
        console.log(`Servicio [${moduleName}] sincronizado: ${status ? 'ONLINE' : 'OFFLINE'}`);
    }
};

// Iniciar el listener al importar
ModuleService.init();

export default ModuleService;
