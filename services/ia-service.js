import Config from '../js/config.js';

/**
 * Servicio para conectar con la API de Google Gemini
 */

const IAService = {
    /**
     * Envía una consulta a la IA para clasificar una incidencia técnica
     * @param {string} promptText 
     * @returns {Promise<Object>}
     */
    async classifyIncident(promptText) {
        if (!Config.AI_KEY || Config.AI_KEY === 'TU_API_KEY_AQUI') {
            console.warn("IA Service: API Key no configurada. Usando simulador local.");
            return this.mockClassification(promptText);
        }

        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${Config.AI_MODEL}:generateContent?key=${Config.AI_KEY}`;

        // Prompt de sistema para forzar respuesta JSON técnica
        const systemInstruction = `
            Actúa como un experto en soporte TI institucional. 
            Clasifica la incidencia del usuario en una de estas 3 áreas:
            - SIAS: Problemas de servidores, bases de datos centrales, seguridad crítica o caídas de servicios base.
            - SISTEMAS: Problemas de conectividad de red, internet, switches, cableado o nodos físicos.
            - SOPORTE: Problemas en equipos de usuario final (Laptops, PCs, Impresoras) o software de oficina.

            Responde ÚNICAMENTE en formato JSON con esta estructura:
            {
                "area": "SIAS | SISTEMAS | SOPORTE",
                "title": "Nombre legible del área",
                "message": "Breve explicación técnica de por qué se derivó a esta área",
                "contact": "Nombre del responsable (invéntalo)",
                "email": "correo@nexus.edu",
                "ext": "Anexo telefónico"
            }
        `;

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: `${systemInstruction}\n\nIncidencia del usuario: ${promptText}` }]
                    }]
                })
            });

            if (!response.ok) throw new Error("Error en la respuesta de la API de Gemini");

            const data = await response.json();
            const rawText = data.candidates[0].content.parts[0].text;
            
            // Limpiar posibles backticks de markdown que Gemini suele añadir
            const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
            
            return JSON.parse(cleanJson);

        } catch (error) {
            console.error("IA Service Error:", error);
            return this.mockClassification(promptText); // Fallback a simulación si falla la API
        }
    },

    /**
     * Clasificación de respaldo (Keyword based) por si falla la API
     */
    mockClassification(text) {
        const input = text.toLowerCase();
        if (input.includes('servidor') || input.includes('base de datos') || input.includes('caída global')) {
            return { area: 'SIAS', title: 'Área de Seguridad y Servidores (SIAS)', message: 'Clasificación automática por palabras clave de infraestructura crítica.', contact: 'Carlos Mendoza', email: 'seguridad.sias@nexus.edu', ext: '204' };
        }
        if (input.includes('internet') || input.includes('nodos') || input.includes('red') || input.includes('wifi')) {
            return { area: 'SISTEMAS', title: 'Infraestructura de Redes', message: 'Clasificación automática por palabras clave de conectividad.', contact: 'Ana Flores', email: 'redes@nexus.edu', ext: '301' };
        }
        return { area: 'SOPORTE', title: 'Soporte Técnico Operativo', message: 'Derivación estándar a soporte técnico de terminales.', contact: 'Luis Vega', email: 'soporte@nexus.edu', ext: '102' };
    }
};

export default IAService;
