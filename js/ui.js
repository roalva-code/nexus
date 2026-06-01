/**
 * Gestión de la interfaz de usuario (UI) - Centralizado
 */

import Animations from './animations.js';

export function initUI() {
    initTheme();
    initSidebar();
}

function initTheme() {
    const themeToggle = document.getElementById("theme-toggle");
    const body = document.body;

    const savedTheme = localStorage.getItem("nexus-theme") || 
                      (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");

    setTheme(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const currentTheme = body.getAttribute("data-theme");
            const newTheme = currentTheme === "light" ? "dark" : "light";
            setTheme(newTheme);
        });
    }
}

function setTheme(theme) {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("nexus-theme", theme);
    const themeIcon = document.getElementById("theme-icon");
    if (themeIcon) {
        themeIcon.className = theme === "light" ? "bi bi-sun-fill fs-6" : "bi bi-moon-fill fs-6";
    }
}

function initSidebar() {
    // Delegación de eventos para el Sidebar
    document.addEventListener('click', (e) => {
        const menuTrigger = e.target.closest('#menu');
        const closeTrigger = e.target.closest('#close');
        const mobileTrigger = e.target.closest('#mobile-toggle');
        const mobileCloseTrigger = e.target.closest('#mobile-close');
        const linkItemClicked = e.target.closest('.link-item');
        const sidebarOverlay = document.getElementById('sidebar-overlay');
        
        const sidebar = document.querySelector('.sidebar');
        const mainContent = document.querySelector('.main-content');
        const menuBtn = document.getElementById('menu');
        const closeBtn = document.getElementById('close');

        if (!sidebar || !mainContent || !menuBtn || !closeBtn) return;

        // Toggle Desktop: CONTRAER
        if (menuTrigger) {
            sidebar.classList.add('active');
            mainContent.classList.add('active');
            menuBtn.style.display = 'none';
            closeBtn.style.display = 'block';
        }
        
        // Toggle Desktop: EXPANDIR
        if (closeTrigger) {
            sidebar.classList.remove('active');
            mainContent.classList.remove('active');
            closeBtn.style.display = 'none';
            menuBtn.style.display = 'block';
        }

        // Mobile Logic - ABRIR
        if (mobileTrigger && sidebarOverlay) {
            sidebar.classList.add("mobile-active");
            Animations.animateOverlay(sidebarOverlay, true);
            document.body.style.overflow = "hidden";
        }

        // Mobile Logic - CERRAR (Por click en overlay, botón X, o al seleccionar un módulo)
        const shouldCloseMobileSidebar = 
            (sidebarOverlay && e.target === sidebarOverlay) || 
            mobileCloseTrigger || 
            (linkItemClicked && sidebar.classList.contains("mobile-active"));

        if (shouldCloseMobileSidebar && sidebarOverlay && sidebar.classList.contains("mobile-active")) {
            sidebar.classList.remove("mobile-active");
            Animations.animateOverlay(sidebarOverlay, false);
            document.body.style.overflow = "";
        }
    });
}
