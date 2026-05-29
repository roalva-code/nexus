/**
 * Configuración global del proyecto NEXUS
 */

const Config = {
    // API de Inteligencia Artificial (Gemini)
    AI_KEY: 'TU_API_KEY_AQUI',
    AI_MODEL: 'gemini-1.5-flash',
    
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
