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
        apiKey: "AIzaSyD_s1odSclUNGhu8gh9Us8DW64072m3MEY",
        authDomain: "nexus-6b1c9.firebaseapp.com",
        projectId: "nexus-6b1c9",
        storageBucket: "nexus-6b1c9.firebasestorage.app",
        messagingSenderId: "887615214194",
        appId: "1:887615214194:web:b4f662a6236484b29b68eb",
        databaseURL: "https://nexus-6b1c9-default-rtdb.firebaseio.com",
    }
};

export default Config;
