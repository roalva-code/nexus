import Router from '../js/router.js';
import { initUI } from '../js/ui.js';

// Inicialización del Panel Administrativo
document.addEventListener("DOMContentLoaded", () => {
    console.log("Nexus Admin - Panel iniciado.");

    // Exponer Router globalmente para permitir su uso en onclick de módulos cargados
    window.Router = Router;

    // Inicializar UI (Sidebar + Temas)
    initUI();

    // 1. Inicializar Router (apuntando al contenedor de admin)
    Router.init("view_mod");

    // 2. Cargar módulo inicial de Admin
    Router.loadModule("home-admin");

    // 3. Gestión de Navegación y Sincronización del Sidebar Admin
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

    if (itemContents.length > 0) {
        itemContents[0].classList.add("selected");
    }
});
