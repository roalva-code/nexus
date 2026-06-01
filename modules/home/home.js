import Animations from '../../js/animations.js';

/**
 * Lógica del módulo Home (Intranet)
 */

export function init(container) {
    console.log("Iniciando Módulo: Home Académico");
    const root = container || document;

    // Animación de entrada para las tarjetas de acceso rápido
    setTimeout(() => {
        Animations.animateCards('.nx-card');
    }, 100);
}
