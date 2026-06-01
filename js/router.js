/**
 * Router para la carga dinámica de módulos sin iframes
 */

import ModuleService from '../services/module-service.js';
import Animations from './animations.js';

const Router = {
    // Contenedor principal donde se cargará el contenido
    contentArea: null,
    currentModule: null,

    /**
     * Inicializa el router configurando el contenedor principal
     * @param {string} containerId - ID del elemento contenedor
     */
    init(containerId) {
        this.contentArea = document.getElementById(containerId);
        if (!this.contentArea) {
            console.error(`No se encontró el contenedor con ID: ${containerId}`);
            return;
        }
        
        // Escuchar cambios de estado globales para reaccionar en tiempo real
        window.addEventListener('moduleStatusChanged', (e) => {
            if (this.currentModule === e.detail.moduleName) {
                this.checkResilience(e.detail.moduleName, e.detail.status);
            }
        });

        console.log("Router inicializado correctamente.");
    },

    /**
     * Carga un módulo dinámicamente
     * @param {string} moduleName - Nombre de la carpeta del módulo
     */
    async loadModule(moduleName) {
        if (!this.contentArea) return;
        this.currentModule = moduleName;

        // Definir la ruta fuera del try para que sea accesible en el catch
        const path = `./modules/${moduleName}/${moduleName}.html`;

        try {
            // Mostrar un loader simple
            this.contentArea.innerHTML = '<div class="d-flex justify-content-center p-5"><div class="spinner-border text-primary" role="status"></div></div>';

            const response = await fetch(path);
            
            if (!response.ok) {
                throw new Error(`Error al cargar el módulo ${moduleName}: ${response.statusText}`);
            }

            const html = await response.text();
            
            // Inyectar el HTML
            this.contentArea.innerHTML = html;

            // Animar entrada del módulo
            Animations.animateModuleEntry(this.contentArea);

            // Cargar CSS específico del módulo
            this.loadModuleCSS(moduleName);

            // Verificar si el servicio está caído antes de inicializar JS
            const isOnline = ModuleService.isOnline(moduleName);
            this.checkResilience(moduleName, isOnline);

            // Notificar a la aplicación que el módulo ha cambiado
            window.dispatchEvent(new CustomEvent('moduleLoaded', { detail: { moduleName } }));

            // Tarea: Intentar cargar e inicializar el JS del módulo automáticamente
            if (isOnline) {
                this.loadModuleJS(moduleName);
            }

            console.log(`Módulo [${moduleName}] cargado.`);

        } catch (error) {
            console.error(error);
            this.contentArea.innerHTML = `
                <div class="alert alert-danger m-4">
                    <i class="bi bi-exclamation-triangle"></i> 
                    Error al cargar el módulo <strong>${moduleName}</strong>. 
                    Verifique que el archivo existe en <code>${path}</code>.
                </div>
            `;
        }
    },

    /**
     * Verifica la resiliencia del módulo y muestra/quita el overlay
     */
    checkResilience(moduleName, isOnline) {
        // Eliminar cualquier overlay existente primero
        const existingOverlay = this.contentArea.querySelector('.nx-overlay');
        if (existingOverlay) existingOverlay.remove();

        if (!isOnline) {
            const overlay = document.createElement('div');
            overlay.className = 'nx-overlay';
            overlay.innerHTML = `
                <div class="nx-overlay-icon">
                    <i class="bi bi-cloud-slash"></i>
                </div>
                <h2 class="nx-overlay-title">Servicio No Disponible</h2>
                <p class="nx-overlay-msg">
                    Lo sentimos, el módulo <strong>${moduleName}</strong> se encuentra temporalmente fuera de servicio por mantenimiento o fallas técnicas.
                </p>
                <button class="nx-btn nx-btn-outline" onclick="location.reload()">Reintentar Conexión</button>
            `;
            this.contentArea.appendChild(overlay);
        }
    },

    /**
     * Carga dinámicamente el archivo CSS del módulo
     */
    loadModuleCSS(moduleName) {
        const cssId = `css-${moduleName}`;
        if (!document.getElementById(cssId)) {
            const link = document.createElement('link');
            link.id = cssId;
            link.rel = 'stylesheet';
            link.href = `./modules/${moduleName}/${moduleName}.css?t=${Date.now()}`;
            document.head.appendChild(link);
        }
    },

    /**
     * Carga dinámicamente el archivo JS del módulo e invoca su función init()
     * @param {string} moduleName 
     */
    async loadModuleJS(moduleName) {
        try {
            const jsPath = `../modules/${moduleName}/${moduleName}.js`;
            const moduleScript = await import(jsPath + '?t=' + Date.now());
            
            if (moduleScript && typeof moduleScript.init === 'function') {
                // Pasamos el contenedor para que el módulo busque sus elementos dentro
                moduleScript.init(this.contentArea);
            }
        } catch (e) {
            console.debug(`No se encontró o no se pudo inicializar JS para: ${moduleName}`);
        }
    }
};

export default Router;
