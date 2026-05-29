import Config from '../js/config.js';

/**
 * Servicio para sincronización en tiempo real usando la API REST de Firebase
 */

const RealtimeService = {
    /**
     * Guarda el estado de un módulo en Firebase
     */
    async saveState(moduleName, status) {
        if (!this.isEnabled()) return;

        try {
            const url = `${Config.FIREBASE.databaseURL}/module_states/${moduleName}.json`;
            await fetch(url, {
                method: 'PUT',
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
     * Escucha cambios (Simulado con Polling para evitar dependencias pesadas de SDK)
     * En un entorno real usaríamos Firebase SDK .on('value')
     */
    initListener(callback) {
        if (!this.isEnabled()) return;

        // Polling cada 3 segundos para simular tiempo real sin SDK
        setInterval(async () => {
            const states = await this.fetchStates();
            if (states) {
                callback(states);
            }
        }, 3000);
    },

    isEnabled() {
        return Config.FIREBASE.databaseURL && !Config.FIREBASE.databaseURL.includes('tu-proyecto');
    }
};

export default RealtimeService;
