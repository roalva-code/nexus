# 🚀 NEXUS - Intranet Académica Modular

Plataforma institucional de alta fidelidad inspirada en arquitecturas de microfrontends, con integración de Inteligencia Artificial real y sincronización en la nube.

---

## ✨ Características Principales

- **Arquitectura Modular**: Sistema de rutas dinámicas (Router JS) que elimina el uso de iframes para una experiencia SPA (Single Page Application).
- **Diseño Premium**: Interfaz de alta densidad al estilo Apple/Linear con Glassmorphism y soporte nativo para **Modo Claro y Oscuro**.
- **IA Integrada**: Asistente técnico inteligente conectado a **Google Gemini 1.5 Flash** para clasificación de incidencias.
- **Realtime Sync**: Control de estado de servicios sincronizado mediante **Firebase Realtime Database**.
- **Visualización de Datos**: Gráficos analíticos con **Chart.js** y animaciones fluidas con **Anime.js**.

---

## 🛠️ Requisitos Previos

Debido al uso de **ES Modules**, el proyecto debe ejecutarse en un entorno de servidor (local o remoto). No funcionará abriendo el archivo HTML directamente desde el explorador.

- **Servidor Local Recomendado**: [Live Server (VS Code)](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer), XAMPP, Laragon o Python `http.server`.

---

## ⚙️ Configuración Personalizada

Para usar tus propias credenciales de IA y Firebase, edita el archivo `js/config.js`:

```javascript
const Config = {
    // 1. Google Gemini API
    // Consigue tu clave en: https://aistudio.google.com/app/apikey
    AI_KEY: 'TU_GEMINI_API_KEY',
    AI_MODEL: 'gemini-1.5-flash',
    
    // 2. Firebase Realtime Database
    // Consigue estos datos en tu Firebase Console -> Configuración del proyecto
    FIREBASE: {
        apiKey: "...",
        authDomain: "...",
        databaseURL: "https://TU-PROYECTO.firebaseio.com/",
        projectId: "...",
        storageBucket: "...",
        messagingSenderId: "...",
        appId: "..."
    }
};
```

### Configuración de Firebase (Realtime Database)
1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/).
2. Habilita **Realtime Database**.
3. En la pestaña **Reglas**, configura el acceso público para desarrollo:
   ```json
   {
     "rules": {
       ".read": true,
       ".write": true
     }
   }
   ```

---

## 📂 Estructura del Proyecto

```text
nexus/
├── index.html          # Intranet Principal (Vista Usuario)
├── admin.html          # Panel de Control (Vista Administrador)
├── js/
│   ├── router.js       # Motor de navegación dinámica
│   ├── ui.js           # Gestión de temas y sidebar
│   ├── animations.js   # Motor de Anime.js
│   └── config.js       # Credenciales y constantes
├── services/           # Lógica de negocio (IA, Firebase, Loader)
├── modules/            # Micro-componentes (HTML, JS, CSS independientes)
└── css/                # Estilos globales y layout
```

---

## 🚀 Guía de Uso

### Intranet (`index.html`)
- **Dashboard**: Resumen académico con métricas reales.
- **Matrículas**: Gestión de alumnos con búsqueda y filtrado de alta velocidad.
- **Asistente IA**: Reporte de incidencias técnicas analizadas por IA real.

### Admin (`admin.html`)
- **Estado de Servicios**: Apaga o enciende módulos de la Intranet. Gracias a Firebase, el bloqueo se verá **instantáneamente** en la pestaña del usuario sin recargar.
- **Reportes**: Visualización de métricas de rendimiento y uso de APIs.

---

## 📝 Créditos
Desarrollado como prototipo de alta gama para simulación de intranets académicas inteligentes.
