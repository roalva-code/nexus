/**
 * Configuración global del proyecto NEXUS
 */

const Config = {
    // API de Inteligencia Artificial (Gemini)
    AI_KEY: 'TU_API_KEY_AQUI',
    AI_MODEL: 'gemini-2.0-flash-lite-001',
    
    // Configuración Groq
    GROQ_KEY: 'TU_GROQ_API_KEY_AQUI',
    GROQ_MODEL: 'openai/gpt-oss-120b',
    AI_PROVIDER: 'groq', // 'gemini' | 'groq'
    
    // Configuración Firebase (Opcional para Realtime)
    FIREBASE: {
        apiKey: "TU_API_KEY",
        authDomain: "tu-proyecto.firebaseapp.com",
        databaseURL: "https://tu-proyecto.firebaseio.com",
        projectId: "tu-proyecto",
        storageBucket: "tu-proyecto.appspot.com",
        messagingSenderId: "tu-sender-id",
        appId: "tu-app-id"
    }
};

export default Config;
