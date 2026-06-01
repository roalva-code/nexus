/**
 * NEXUS - Sistema de Animaciones con Anime.js
 */

// Intentar obtener la instancia global de anime
const getAnime = () => {
    if (typeof window.anime === 'function') return window.anime;
    if (window.anime && typeof window.anime.default === 'function') return window.anime.default;
    return null;
};

const Animations = {
    /**
     * Animación de entrada para módulos (Fade + Slide Up)
     */
    animateModuleEntry(container) {
        const anime = getAnime();
        if (!container || !anime) return;
        
        container.style.opacity = 0;
        container.style.transform = 'translateY(10px)';

        anime({
            targets: container,
            opacity: [0, 1],
            translateY: [10, 0],
            duration: 600,
            easing: 'easeOutQuart'
        });
    },

    /**
     * Animación sutil al contraer/expandir sidebar
     */
    animateSidebarToggle(sidebar, isActive) {
        const anime = getAnime();
        if (!sidebar || !anime) return;

        anime({
            targets: sidebar,
            width: isActive ? [240, 72] : [72, 240],
            duration: 400,
            easing: 'easeInOutQuint'
        });
    },

    /**
     * Animación de tarjetas en el Home (Efecto cascada)
     */
    animateCards(selector) {
        const anime = getAnime();
        if (!anime) return;

        anime({
            targets: selector,
            opacity: [0, 1],
            translateY: [20, 0],
            delay: anime.stagger(100),
            duration: 800,
            easing: 'easeOutElastic(1, .8)'
        });
    },

    /**
     * Animación para modales o overlays
     */
    animateOverlay(overlay, show) {
        const anime = getAnime();
        if (!overlay || !anime) {
            if (overlay) overlay.style.display = show ? 'block' : 'none';
            return;
        }
        
        if (show) {
            overlay.style.display = 'block';
            anime({
                targets: overlay,
                opacity: [0, 1],
                duration: 300,
                easing: 'linear'
            });
        } else {
            anime({
                targets: overlay,
                opacity: [1, 0],
                duration: 300,
                easing: 'linear',
                complete: () => { overlay.style.display = 'none'; }
            });
        }
    }
};

export default Animations;
