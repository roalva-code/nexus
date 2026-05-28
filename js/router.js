/**
 * Router para la carga dinámica de módulos sin iframes
 */

const Router = {
    // Contenedor principal donde se cargará el contenido
    contentArea: null,

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
        console.log("Router inicializado correctamente.");
    },

    /**
     * Carga un módulo dinámicamente
     * @param {string} moduleName - Nombre de la carpeta del módulo
     */
    async loadModule(moduleName) {
        if (!this.contentArea) return;

        // Definir la ruta fuera del try para que sea accesible en el catch
        const path = `./modules/${moduleName}/${moduleName}.html`;

        try {
            // Mostrar un loader simple (opcional, para mejorar UX luego)
            this.contentArea.innerHTML = '<div class="d-flex justify-content-center p-5"><div class="spinner-border text-primary" role="status"></div></div>';

            const response = await fetch(path);
            
            if (!response.ok) {
                throw new Error(`Error al cargar el módulo ${moduleName}: ${response.statusText}`);
            }

            const html = await response.text();
            
            // Inyectar el HTML
            this.contentArea.innerHTML = html;

            // Notificar a la aplicación que el módulo ha cambiado (para actualizar sidebar, etc)
            window.dispatchEvent(new CustomEvent('moduleLoaded', { detail: { moduleName } }));

            // Actualizar la URL o el estado si fuera necesario (opcional)
            console.log(`Módulo [${moduleName}] cargado.`);

            // Cargar CSS y JS del módulo de forma opcional si existen
            this.loadModuleAssets(moduleName);

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
     * Carga scripts y estilos específicos del módulo si existen
     * @param {string} moduleName 
     */
    loadModuleAssets(moduleName) {
        // Aquí podríamos implementar la carga dinámica de .css y .js específicos
        // Para no duplicar, podríamos verificar si ya existen.
        // Por ahora lo dejamos como gancho para la siguiente fase.
    }
};

export default Router;
