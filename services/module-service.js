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

    // Caché en memoria único por pestaña para evitar conflictos de LocalStorage compartido en el mismo navegador
    lastProcessedStates: null,

    /**
     * Inicializa la sincronización en tiempo real
     */
    init() {
        console.log("ModuleService: Inicializando sincronización en tiempo real...");
        
        RealtimeService.initListener((newStates) => {
            console.log("ModuleService: Nuevos estados recibidos de Firebase:", newStates);
            
            // Usar el estado en memoria de esta pestaña como referencia, o caer a LocalStorage
            const current = this.lastProcessedStates || this.getStates();
            
            // Comparar contra la memoria de esta pestaña
            if (JSON.stringify(current) !== JSON.stringify(newStates)) {
                this.lastProcessedStates = { ...newStates };
                localStorage.setItem('nexus_module_states', JSON.stringify(newStates));
                
                // Notificar a la UI para cambios reactivos
                Object.keys(newStates).forEach(key => {
                    if (current[key] !== newStates[key]) {
                        console.log(`ModuleService: Detectado cambio en [${key}]: ${current[key]} -> ${newStates[key]}. Despachando evento.`);
                        window.dispatchEvent(new CustomEvent('moduleStatusChanged', { 
                            detail: { moduleName: key, status: newStates[key] } 
                        }));
                    }
                });
            } else {
                console.log("ModuleService: Los estados de esta pestaña están al día. Omitiendo despacho.");
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
        
        // Sincronizar memoria de esta pestaña
        this.lastProcessedStates = { ...states };
        localStorage.setItem('nexus_module_states', JSON.stringify(states));
        
        // Sincronizar con la nube (Async)
        console.log(`ModuleService: setStatus enviado a Firebase para [${moduleName}]: ${status}`);
        RealtimeService.saveState(moduleName, status);
        
        // Notificar localmente
        window.dispatchEvent(new CustomEvent('moduleStatusChanged', { 
            detail: { moduleName, status } 
        }));
    }
};

// Iniciar el listener al importar
ModuleService.init();

export default ModuleService;
