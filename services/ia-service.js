import Config from '../js/config.js';

const IAService = {
    async classifyIncident(promptText) {
        return this.callGroq(promptText);
    },

    async callGroq(promptText) {
        if (!Config.GROQ_KEY || Config.GROQ_KEY === 'TU_GROQ_API_KEY_AQUI') {
            return { area: 'ERROR', title: 'Configuración', message: 'Por favor, ingresa una API Key válida de Groq.', contact: '-', email: '-', ext: '-' };
        }

        const endpoint = `https://api.groq.com/openai/v1/chat/completions`;
        const systemInstruction = this.getSystemInstruction();
        const requestBody = {
            model: Config.GROQ_MODEL,
            messages: [
                { role: "system", content: systemInstruction },
                { role: "user", content: promptText }
            ],
            temperature: 0.1
        };

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Config.GROQ_KEY}`
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Error ${response.status}: ${errorData.error?.message || 'Unknown error'}`);
            }

            const data = await response.json();
            const rawText = data.choices[0].message.content;
            
            const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(cleanJson);

        } catch (error) {
            console.error("IA Service Error:", error);
            return { area: 'ERROR', title: 'Error de API', message: 'No se pudo conectar con Groq: ' + error.message, contact: '-', email: '-', ext: '-' };
        }
    },

    getSystemInstruction() {
        return `
            Eres un clasificador inteligente para una mesa de ayuda técnica. Tu función es derivar incidentes al área correcta con absoluta precisión.

            Reglas de clasificación (PRIORIZA ESTO):
            1. SIAS (Seguridad y Servidores): Problemas de acceso a bases de datos centrales, bloqueos de seguridad crítica, caída de servicios backend, errores de autenticación en sistemas corporativos, caídas de servidores.
            2. SISTEMAS (Redes e Infraestructura): Problemas de conectividad de red, internet lento/caído, nodos físicos, cableado, fallos en switches/routers, módulos que no cargan datos (error de carga de datos suele ser un problema de conexión al backend o red).
            3. SOPORTE TECNICO: Problemas de usuario final (PC lenta, periféricos, software de escritorio, configuración de correo en cliente de escritorio, problemas de hardware de oficina).

            IMPORTANTE: 
            - Un "módulo que no carga información" ES un problema de SISTEMAS. 
            - Un "correo institucional" (login) ES SIAS.
            - Responde ÚNICAMENTE en formato JSON plano.
            - ASEGÚRATE DE QUE TODOS LOS CAMPOS ESTÉN LLENOS. No dejes ninguno vacío.

            Estructura JSON requerida:
            {
                "area": "SIAS | SISTEMAS | SOPORTE TECNICO",
                "title": "Nombre corto del área",
                "message": "Explicación técnica breve del problema",
                "contact": "Nombre del responsable técnico",
                "email": "correo@nexus.edu",
                "phone": "Numero de celular (ej. 987654321)"
            }
        `;
    },

};

export default IAService;
