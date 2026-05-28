import Router from '../js/router.js';
import '../js/ui.js';

// Inicialización del Panel Administrativo
document.addEventListener("DOMContentLoaded", () => {
    console.log("Nexus Admin - Panel iniciado.");

    // Exponer Router globalmente para permitir su uso en onclick de módulos cargados
    window.Router = Router;

    // 1. Inicializar Router (apuntando al contenedor de admin)
    Router.init("view_mod");

    // 2. Cargar módulo inicial de Admin
    Router.loadModule("home-admin");

    // 3. Referencias UI para Sidebar
    const menuBtn = document.getElementById("menu");
    const closeBtn = document.getElementById("close");
    const mobileToggle = document.getElementById("mobile-toggle");
    const sidebarOverlay = document.getElementById("sidebar-overlay");
    const sidebar = document.querySelector(".sidebar");
    const sidebarContent = document.querySelector(".sidebar-content");
    const mainContent = document.querySelector(".main-content");
    const nameItems = document.querySelectorAll(".name-item");
    const logoContainer = document.querySelector(".logo-container");
    const linkItems = document.querySelectorAll(".link-item");

    // 4. Lógica de Sidebar (Colapsar/Expandir)
    const toggleSidebar = (isActive) => {
        const action = isActive ? 'add' : 'remove';
        
        sidebar.classList[action]("active");
        sidebarContent.classList[action]("active");
        mainContent.classList[action]("active");
        logoContainer.classList[action]("active");
        
        menuBtn.style.display = isActive ? "none" : "block";
        closeBtn.style.display = isActive ? "block" : "none";

        nameItems.forEach(item => item.classList[action]("active"));
        linkItems.forEach(item => item.classList[action]("active"));
    };

    // Lógica para Móvil (Drawer)
    const toggleMobileSidebar = (isOpen) => {
        if (isOpen) {
            sidebar.classList.add("mobile-active");
            sidebarOverlay.classList.add("active");
            document.body.style.overflow = "hidden";
        } else {
            sidebar.classList.remove("mobile-active");
            sidebarOverlay.classList.remove("active");
            document.body.style.overflow = "";
        }
    };

    if (menuBtn) menuBtn.addEventListener("click", () => toggleSidebar(true));
    if (closeBtn) closeBtn.addEventListener("click", () => toggleSidebar(false));
    if (mobileToggle) mobileToggle.addEventListener("click", () => toggleMobileSidebar(true));
    if (sidebarOverlay) sidebarOverlay.addEventListener("click", () => toggleMobileSidebar(false));

    // 5. Gestión de Navegación y Sincronización del Sidebar Admin
    const itemContents = document.querySelectorAll(".item-content");

    const updateSidebarSelection = (moduleName) => {
        itemContents.forEach(item => {
            const link = item.querySelector(".link-item");
            if (link.getAttribute("data-module") === moduleName) {
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
            if (window.innerWidth <= 768) {
                toggleMobileSidebar(false);
            }

            const link = item.querySelector(".link-item");
            const moduleName = link.getAttribute("data-module");

            if (moduleName) {
                Router.loadModule(moduleName);
            }
        });
    });

    if (itemContents.length > 0) {
        itemContents[0].classList.add("selected");
    }
});
