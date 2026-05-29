/**
 * Gestión de la interfaz de usuario (UI) - Centralizado
 */

export function initUI() {
    initTheme();
    initSidebar();
}

function initTheme() {
    const themeToggle = document.getElementById("theme-toggle");
    const themeIcon = document.getElementById("theme-icon");
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
        themeIcon.className = theme === "light" ? "bi bi-sun fs-6" : "bi bi-moon-fill fs-6";
    }
}

function initSidebar() {
    const menuBtn = document.getElementById("menu");
    const closeBtn = document.getElementById("close");
    const mobileToggle = document.getElementById("mobile-toggle");
    const sidebarOverlay = document.getElementById("sidebar-overlay");
    const sidebar = document.querySelector(".sidebar");
    const mainContent = document.querySelector(".main-content");

    if (!sidebar || !menuBtn || !closeBtn) return;

    // Toggle Desktop
    menuBtn.addEventListener("click", () => {
        sidebar.classList.add("active");
        mainContent.classList.add("active");
        menuBtn.style.display = "none";
        closeBtn.style.display = "block";
    });

    closeBtn.addEventListener("click", () => {
        sidebar.classList.remove("active");
        mainContent.classList.remove("active");
        menuBtn.style.display = "block";
        closeBtn.style.display = "none";
    });

    // Toggle Mobile
    if (mobileToggle && sidebarOverlay) {
        mobileToggle.addEventListener("click", () => {
            sidebar.classList.add("mobile-active");
            sidebarOverlay.classList.add("active");
            document.body.style.overflow = "hidden";
        });

        sidebarOverlay.addEventListener("click", () => {
            sidebar.classList.remove("mobile-active");
            sidebarOverlay.classList.remove("active");
            document.body.style.overflow = "";
        });
    }
}
