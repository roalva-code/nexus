import Config from '../js/config.js';

/**
 * Servicio para sincronización en tiempo real usando la API REST de Firebase
 */
const RealtimeService = {
    /**
     * Guarda el estado de un módulo en Firebase (Autenticado con ID Token de Admin)
     */
    async saveState(moduleName, status) {
        if (!this.isEnabled()) return;

        try {
            const idToken = localStorage.getItem('nexus_admin_token');
            // Para cumplir con la regla de seguridad ".write": "auth != null", pasamos el token por parámetro REST
            const authParam = idToken ? `?auth=${idToken}` : '';
            const url = `${Config.FIREBASE.databaseURL}/module_states/${moduleName}.json${authParam}`;
            
            await fetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(status)
            });
        } catch (error) {
            console.error("RealtimeService Save Error:", error);
        }
    },

    /**
     * Obtiene todos los estados desde Firebase
     */
    async fetchStates() {
        if (!this.isEnabled()) return null;

        try {
            const url = `${Config.FIREBASE.databaseURL}/module_states.json`;
            const response = await fetch(url);
            return await response.json();
        } catch (error) {
            console.error("RealtimeService Fetch Error:", error);
            return null;
        }
    },

    /**
     * Escucha cambios en tiempo real mediante Server-Sent Events (SSE) nativo
     */
    initListener(callback) {
        if (!this.isEnabled()) {
            console.warn("RealtimeService: Sincronización en tiempo real deshabilitada (revisa config.js).");
            return;
        }

        try {
            const url = `${Config.FIREBASE.databaseURL}/module_states.json`;
            console.log(`RealtimeService: Conectando EventSource a: ${url}`);
            const eventSource = new EventSource(url);

            eventSource.onopen = () => {
                console.log("RealtimeService: ¡Conexión en tiempo real con Firebase establecida con éxito!");
            };

            const handleUpdate = (e) => {
                console.log("RealtimeService: Evento crudo recibido de Firebase:", e.type, e.data);
                try {
                    const payload = JSON.parse(e.data);
                    if (!payload) return;

                    // Carga inicial en el nodo raíz "/"
                    if (payload.path === '/') {
                        if (payload.data) {
                            console.log("RealtimeService: Carga inicial de estados procesada:", payload.data);
                            callback(payload.data);
                        }
                    } else {
                        // Cambios parciales del stream (ej: path = "/dashboard", data = false)
                        const moduleName = payload.path.slice(1);
                        if (moduleName) {
                            const saved = localStorage.getItem('nexus_module_states');
                            const currentStates = saved ? JSON.parse(saved) : {
                                'dashboard': true,
                                'matriculas': true,
                                'tickets-ia': true,
                                'reportes': true
                            };
                            currentStates[moduleName] = payload.data;
                            console.log(`RealtimeService: Cambio de módulo parcial procesado [${moduleName}]:`, payload.data);
                            callback(currentStates);
                        }
                    }
                } catch (err) {
                    console.error("RealtimeService: Error al procesar payload de EventSource:", err);
                }
            };

            eventSource.addEventListener('put', handleUpdate);
            eventSource.addEventListener('patch', handleUpdate);

            eventSource.onerror = (err) => {
                console.error("RealtimeService: Error o desconexión en EventSource de Firebase.", err);
            };

            return eventSource;
        } catch (error) {
            console.error("RealtimeService SSE Init Error:", error);
        }
    },

    isEnabled() {
        return Config.FIREBASE.databaseURL && !Config.FIREBASE.databaseURL.includes('tu-proyecto');
    }
};

export default RealtimeService;
