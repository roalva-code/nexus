/**
 * Servicio para gestionar la carga de datos simulados (JSON)
 */

const MockLoader = {
    /**
     * Carga un archivo JSON desde la carpeta /data
     * @param {string} fileName - Nombre del archivo (ej: 'matriculas')
     * @returns {Promise<Array|Object>}
     */
    async load(fileName) {
        try {
            const response = await fetch(`./data/${fileName}.json`);
            if (!response.ok) throw new Error(`Error al cargar datos: ${fileName}`);
            return await response.json();
        } catch (error) {
            console.error(`MockLoader Error: ${error.message}`);
            return null;
        }
    },

    /**
     * Simula una latencia de red
     * @param {number} ms 
     */
    async delay(ms = 800) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};

export default MockLoader;
