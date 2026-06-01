/**
 * Control de Autenticación de Administración para NEXUS
 */
class AdminAuth {
    static checkAuth() {
        const token = localStorage.getItem('nexus_admin_token');
        const user = localStorage.getItem('nexus_admin_user');

        // Si no existe el token, redireccionar inmediatamente al login
        if (!token || !user) {
            this.logout();
            return;
        }

        // Opcional: Podríamos validar la expiración del token aquí en el futuro.
    }

    static logout() {
        localStorage.removeItem('nexus_admin_token');
        localStorage.removeItem('nexus_admin_user');
        
        // Redirección simple, flexible y a prueba de todo
        const path = window.location.pathname.toLowerCase();
        if (path.includes('admin.html')) {
            window.location.href = './admin/login.html';
        } else if (!path.includes('login.html')) {
            window.location.href = '../admin/login.html';
        }
    }

    static getUser() {
        const userJson = localStorage.getItem('nexus_admin_user');
        return userJson ? JSON.parse(userJson) : null;
    }
}

// Ejecutar validación de seguridad de inmediato al cargar el script
AdminAuth.checkAuth();

// Delegación de eventos global para el botón de cerrar sesión (garantiza funcionamiento sin importar orden de carga)
document.addEventListener('click', (e) => {
    const logoutBtn = e.target.closest('#logout-btn');
    if (logoutBtn) {
        e.preventDefault();
        AdminAuth.logout();
    }
});

export default AdminAuth;
