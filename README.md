# NEXUS - Intranet Académica Modular & Arquitectura de Microfrontends

NEXUS es un sistema web SPA (Single Page Application) modular e interactivo diseñado para simular alta disponibilidad, resiliencia ante caídas de servicios y procesamiento de solicitudes mediante Inteligencia Artificial. La arquitectura está desacoplada de frameworks pesados, implementada enteramente sobre Vanilla HTML5, CSS3, ES Modules y APIs Serverless RESTful.

---

## 🏗️ Arquitectura y Flujo Técnico del Sistema

El sistema implementa una arquitectura orientada a componentes independientes (microfrontends simulados) integrados mediante un despachador de eventos y carga perezosa (lazy loading).

```
                      +-------------------+
                      |    Navegador      |
                      |  (Cliente Intranet)|
                      +--------+----------+
                               |
                   EventSource | (SSE Read)
                 (Realtime Sync)|
                               v
+------------------+  HTTP PUT +------------------+
|      Admin       +---------->+ Firebase RTDB   |
| (Control Panel)  | (TokenAuth) | (Module States) |
+------------------+           +------------------+
```

### 1. Sistema de Enrutamiento Dinámico (Hash Routing)
- **Archivo principal:** [router.js](file:///c:/xampp/htdocs/PROJECTS/nexus/js/router.js)
- **Mecanismo:** Intercepta el evento global `hashchange` de la ventana (`window.location.hash`). Esto elimina la necesidad de `iframes` o recargas completas.
- **Flujo de carga:** 
  1. Extrae el módulo del hash (ej. `#matriculas`).
  2. Ejecuta un `fetch` asíncrono para obtener el archivo de marcado del módulo (`/modules/{moduleName}/{moduleName}.html`).
  3. Inserta el HTML en el nodo contenedor del DOM (`#view_mod`).
  4. Inyecta dinámicamente en el `<head>` la hoja de estilos respectiva (`/modules/{moduleName}/{moduleName}.css`).
  5. Importa de forma perezosa el archivo de lógica JavaScript (`import('/modules/{moduleName}/{moduleName}.js')`) y ejecuta su método exportado `init(container)`.

### 2. Sincronización en Tiempo Real mediante Server-Sent Events (SSE)
- **Archivos principales:** [realtime-service.js](file:///c:/xampp/htdocs/PROJECTS/nexus/services/realtime-service.js), [module-service.js](file:///c:/xampp/htdocs/PROJECTS/nexus/services/module-service.js)
- **Mecanismo:** La aplicación cliente se conecta a la API REST de Firebase usando la interfaz nativa `EventSource` de HTML5. Esto consume una conexión persistente unidireccional y eficiente que reacciona instantáneamente a eventos tipo `put` y `patch` enviados por Firebase.
- **Aislamiento de Almacenamiento (In-Memory Tab Cache):** Para resolver la coincidencia de origen en navegadores de desarrollo (donde el panel `admin.html` y la intranet `index.html` comparten el mismo `localStorage`), se implementó un caché local en memoria (`this.lastProcessedStates`). Esto previene falsos positivos al comparar los estados nuevos recibidos del canal SSE contra la caché de disco local, aislando el comportamiento de múltiples pestañas abiertas en el mismo ordenador.

### 3. Recuperación en Caliente y Estado de Resiliencia
- **Mecanismo:** Cuando un módulo es conmutado a `OFFLINE` por el administrador:
  1. El canal SSE de la Intranet recibe la actualización.
  2. Se despacha el evento local `moduleStatusChanged`.
  3. `router.js` captura el evento, desvanece el contenido del módulo actual y renderiza un esqueleto genérico con animación de pulsos de opacidad (`.animate-pulse`), superponiendo una interfaz de bloqueo absoluto (`.nx-overlay` con `pointer-events: none`).
  4. Se bloquea el scroll en el contenedor principal mediante la regla CSS `.content:has(.nx-overlay) { overflow-y: hidden !important; }` para evitar que el usuario se desplace y visualice las plantillas incompletas de fondo.
  5. Al retornar a `ONLINE`, el enrutador recarga en caliente de forma nativa el módulo invocando de nuevo el flujo de fetching y reinicializando el código JS del microfrontend.

### 4. Flujo de Autenticación de Administradores (REST Auth)
- **Archivos principales:** [admin-auth.js](file:///c:/xampp/htdocs/PROJECTS/nexus/admin/admin-auth.js), [login.html](file:///c:/xampp/htdocs/PROJECTS/nexus/admin/login.html)
- **Mecanismo:** Protege el panel de control mediante un filtro que corre síncronamente al inicio del ciclo de vida del DOM.
  - Al cargar `admin.html`, el script `admin-auth.js` se evalúa en el `<head>`. Si no detecta las llaves `nexus_admin_token` y `nexus_admin_user` en el almacenamiento del navegador, detiene el procesamiento y realiza un redireccionamiento forzado a `login.html`.
  - El inicio de sesión se realiza mediante una petición HTTP `POST` a la API REST de Firebase Identity Toolkit (`signInWithPassword?key=API_KEY`). Esto valida las credenciales y recupera un `idToken` de corta duración.
  - Al cerrar sesión o expirar la misma, se limpia el almacenamiento de forma segura y se retorna a la pantalla de acceso.

---

## ⚙️ Estado de Integración de APIs de Inteligencia Artificial

### ¿Por qué NO se utiliza actualmente la API de Google Gemini?
Originalmente, el archivo de configuración global `js/config.js` contenía constantes asignadas a Gemini (`AI_KEY` y `AI_MODEL`). Sin embargo, en la implementación final, **la API de Gemini ha sido desactivada en favor del microservicio REST de Groq**.

**Detalles Técnicos:**
1. **Lógica de Desvío:** En [ia-service.js](file:///c:/xampp/htdocs/PROJECTS/nexus/services/ia-service.js), la llamada principal `classifyIncident(promptText)` redirige su flujo de forma determinista y exclusiva hacia `callGroq(promptText)`.
2. **Razones de Arquitectura:**
   - **Formateo JSON estricto:** El modelo configurado en Groq (`openai/gpt-oss-120b` u homólogos) demostró mayor consistencia al retornar cadenas JSON limpias sin envoltorios markdown, lo que simplificó la deserialización nativa con `JSON.parse` en el navegador del cliente.
   - **Latencia de respuesta:** Menor tiempo de procesamiento (Time-To-First-Token) en el endpoint REST directo de Groq.
   - **Simplificación de credenciales:** Evita dependencias de librerías cliente pesadas de Google AI, resolviendo todo el procesamiento en una llamada POST estructurada compatible con el motor de categorización del Help Desk.

---

## 📦 Librerías y Dependencias Externas

El proyecto gestiona sus dependencias de forma mixta (archivos locales y CDNs) para optimizar la velocidad de carga y evitar la descarga redundante de paquetes npm:

### 1. Dependencias Locales (`/libs/`)
- **Bootstrap v5.3:** Utilizado para la rejilla adaptativa (grid system), estructuración flexible (flexbox), ventanas modales e interfaces base del layout de administración.
  - Hoja de estilos: `libs/bootstrap/css/bootstrap.min.css`
  - Archivo JavaScript: `libs/bootstrap/js/bootstrap.bundle.min.js`
- **Bootstrap Icons:** Librería de iconos vectoriales utilizada para el sidebar de navegación e indicadores visuales de las cabeceras.
  - Archivo CSS: `libs/bootstrap-icons/bootstrap-icons.min.css`
- **Anime.js v3.2.1:** Motor de animación ligero utilizado para dotar de transiciones y efectos de entrada y salida fluidos al inyectar los microfrontends dentro del DOM.
  - Ubicación: `libs/anime.umd.min.js`

### 2. Dependencias desde Red de Distribución (CDN)
- **Chart.js v4.5.1:** Utilizada para renderizar los gráficos dinámicos del módulo de Reportes del administrador y la monitorización de latencia en vivo del microservicio de IA.
  - CDN: `https://cdn.jsdelivr.net/npm/chart.js@4.5.1/dist/chart.umd.min.js`
- **SweetAlert2 v11:** Biblioteca utilizada para renderizar diálogos de confirmación, advertencias de configuración y alertas de errores de red con un acabado estético unificado.
  - CDN: `https://cdn.jsdelivr.net/npm/sweetalert2@11`

---

## 🛠️ Configuración de Firebase (Auth y Realtime Database)

Si deseas desplegar o probar este proyecto utilizando tu propio backend de Firebase, sigue rigurosamente los siguientes pasos:

### Paso 1: Configurar el Proyecto en Firebase Console
1. Ingresa a [Firebase Console](https://console.firebase.google.com/) y crea un nuevo proyecto llamado `nexus` (o el nombre de tu preferencia).
2. Ve a la sección **Authentication** (Autenticación) en el menú lateral izquierdo y haz clic en **Comenzar**.
3. En la pestaña **Método de inicio de sesión**, selecciona **Correo electrónico/contraseña** y habilítalo. Guarda los cambios.
4. En la pestaña **Users** (Usuarios), haz clic en **Add User** (Añadir usuario) y crea manualmente las credenciales para los administradores del sistema (ej. `admin@nexus.edu` y una contraseña).
5. Ve a la sección **Realtime Database** y haz clic en **Crear base de datos**. Elige tu ubicación de servidor preferida.

### Paso 2: Configurar las Reglas de Seguridad de Realtime Database
Para garantizar que solo los administradores logueados puedan apagar y encender módulos, pero que cualquier alumno de la Intranet pueda leer el estado, debes configurar las siguientes reglas en la pestaña **Rules** (Reglas) de tu base de datos:

```json
{
  "rules": {
    "module_states": {
      // Cualquiera puede ver si el servicio está caído (lectura pública antes de expiración demo)
      ".read": "now < 1782882000000",
      // Únicamente los administradores autenticados con token Firebase Auth pueden escribir
      ".write": "auth != null && now < 1782882000000"
    }
  }
}
```
*Nota: Reemplaza o extiende la marca temporal `1782882000000` (1 de julio de 2026) según el tiempo de validez requerido para tu demo.*

### Paso 3: Configurar las credenciales en la Aplicación
Abre el archivo [js/config.js](file:///c:/xampp/htdocs/PROJECTS/nexus/js/config.js) en tu editor y actualiza el objeto `FIREBASE` con los valores que te otorga la consola de tu proyecto (estos se encuentran en la rueda de configuración del proyecto -> Configuración del proyecto -> pestaña General -> Aplicaciones web -> Agregar aplicación):

```javascript
FIREBASE: {
    apiKey: "TU_API_KEY_DE_FIREBASE",
    authDomain: "tu-proyecto.firebaseapp.com",
    projectId: "tu-proyecto",
    storageBucket: "tu-proyecto.firebasestorage.app",
    messagingSenderId: "tu-sender-id",
    appId: "tu-app-id",
    databaseURL: "https://tu-proyecto-default-rtdb.firebaseio.com" // Asegúrate de incluir el protocolo https://
}
```

---

## 📂 Descripción de Módulos Críticos

El sistema se compone de varios microfrontends independientes alojados bajo el directorio `/modules/`:

### 1. Módulo: `estado-servicios` (Administración)
- **Lógica:** [estado-servicios.js](file:///c:/xampp/htdocs/PROJECTS/nexus/modules/estado-servicios/estado-servicios.js)
- **Función:** Genera la interfaz de control de apagado/encendido para el Administrador. Al interactuar con los switches de Dashboard o Matrículas, emite peticiones HTTP `PUT` directamente a la ruta `/module_states/{moduleName}.json` de la base de datos de Firebase.
- **Gráfico de Latencia (Chart.js):** Contiene un inicializador para representar visualmente el tiempo de respuesta del servicio Tickets IA (Llama 3 API). Utiliza un temporizador de simulación en vivo (despachado cada 4 segundos) que modifica los datos del dataset y actualiza el DOM de forma reactiva, desactivándose de forma autónoma al destruir o descargar el componente para optimizar memoria.

### 2. Módulo: `tickets-ia` (Intranet)
- **Lógica:** [tickets-ia.js](file:///c:/xampp/htdocs/PROJECTS/nexus/modules/tickets-ia/tickets-ia.js)
- **Función:** Ofrece una interfaz de chat interactiva que permite a los usuarios registrar incidentes técnicos.
- **Integración IA:** Envía el texto a través de [ia-service.js](file:///c:/xampp/htdocs/PROJECTS/nexus/services/ia-service.js) al endpoint de Groq. El prompt de sistema obliga a la IA a retornar un objeto JSON formateado que contiene la clasificación del ticket en tres áreas de soporte: `SIAS` (Seguridad y Servidores), `SISTEMAS` (Redes) o `SOPORTE TECNICO` (Hardware). Los datos resultantes se inyectan en forma de tarjeta informativa en la conversación del chat.

### 3. Módulo: `matriculas` (Intranet)
- **Función:** Simula la interfaz de registro académico. Si el administrador desactiva este módulo, la intranet bloquea de forma inmediata las tablas de datos reemplazándolas por un esqueleto translúcido y la pantalla de advertencia mediante el bus de eventos en tiempo real.

---

## 🚀 Despliegue y Ejecución Local

Debido a que el proyecto utiliza **ES Modules** para la carga dinámica de archivos JavaScript (`import()`), los navegadores restringen las llamadas por motivos de seguridad CORS cuando se ejecutan bajo el protocolo `file:///`.

### Requisitos de Ejecución:
Para levantar la aplicación localmente, debes servirla a través de un servidor HTTP local.

#### Opción A: Extensión Live Server (VS Code)
1. Abre el directorio del proyecto en Visual Studio Code.
2. Asegúrate de tener instalada la extensión **Live Server**.
3. Haz clic en el botón **Go Live** en la esquina inferior derecha de la ventana de VS Code.

#### Opción B: Usando XAMPP / Laragon (Recomendado si usas PHP/Apache)
1. Copia o clona la carpeta `nexus` dentro del directorio `htdocs` (en XAMPP) o `www` (en Laragon).
2. Enciende el servidor Apache.
3. Abre en tu navegador la dirección `http://localhost/PROJECTS/nexus/index.html`.

#### Opción C: Usando Python (Consola)
Si cuentas con Python instalado, abre una consola de comandos en el directorio raíz del proyecto y ejecuta:
```bash
# Python 3
python -m http.server 8000
```
Luego, accede en tu navegador a `http://localhost:8000/index.html`.
