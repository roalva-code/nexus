import Router from './router.js';
import { initUI } from './ui.js';

// Inicialización de la aplicación
document.addEventListener("DOMContentLoaded", () => {
    console.log("Nexus - Aplicación iniciada.");

    // Exponer Router globalmente para permitir su uso en onclick de módulos cargados
    window.Router = Router;

    // Inicializar UI (Sidebar + Temas)
    initUI();

    // 1. Inicializar Router
    Router.init("view_mod");

    // 2. Cargar módulo inicial (Hash de la URL o "home" por defecto)
    const initialModule = window.location.hash.slice(1) || "home";
    Router.loadModule(initialModule);

    // 3. Gestión de Navegación y Sincronización del Sidebar
    const itemContents = document.querySelectorAll(".item-content");

    const updateSidebarSelection = (moduleName) => {
        itemContents.forEach(item => {
            const link = item.querySelector(".link-item");
            if (link && link.getAttribute("data-module") === moduleName) {
                item.classList.add("selected");
            } else {
                item.classList.remove("selected");
            }
        });
    };

    // Escuchar el evento del Router para actualizar la selección visual
    window.addEventListener('moduleLoaded', (e) => {
        updateSidebarSelection(e.detail.moduleName);
    });

    itemContents.forEach(item => {
        item.addEventListener("click", () => {
            const link = item.querySelector(".link-item");
            const moduleName = link ? link.getAttribute("data-module") : null;

            if (moduleName) {
                Router.loadModule(moduleName);
            }
        });
    });

    // Marcar el primero como seleccionado por defecto
    if (itemContents.length > 0) {
        itemContents[0].classList.add("selected");
    }
});
