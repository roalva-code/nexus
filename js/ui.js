/**
 * Gestión de la interfaz de usuario (UI)
 */

document.addEventListener("DOMContentLoaded", () => {
    initTheme();
});

function initTheme() {
    const themeToggle = document.getElementById("theme-toggle");
    const themeIcon = document.getElementById("theme-icon");
    const body = document.body;

    // Cargar tema guardado o preferencia del sistema
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
    const body = document.body;
    const themeIcon = document.getElementById("theme-icon");

    body.setAttribute("data-theme", theme);
    localStorage.setItem("nexus-theme", theme);

    if (themeIcon) {
        if (theme === "light") {
            themeIcon.classList.remove("bi-moon-fill");
            themeIcon.classList.add("bi-sun-fill");
        } else {
            themeIcon.classList.remove("bi-sun-fill");
            themeIcon.classList.add("bi-moon-fill");
        }
    }
}
