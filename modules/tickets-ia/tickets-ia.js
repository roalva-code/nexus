import IAService from '../../services/ia-service.js';

/**
 * Lógica del módulo Tickets IA (Integración real con Gemini)
 */

export function init(container) {
    console.log("Iniciando Módulo: Tickets IA (Real AI Mode)");
    const root = container || document;

    setTimeout(() => {
        const chatForm = root.querySelector('#chat-form');
        const userInput = root.querySelector('#user-input');
        const chatWindow = root.querySelector('#chat-window');
        const aiResult = root.querySelector('#ai-result');

        if (!chatForm || !userInput) return;

        chatForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const text = userInput.value.trim();
            if (!text) return;

            // 1. Agregar mensaje del usuario
            addMessage(chatWindow, text, 'user');
            userInput.value = '';

            // 2. Estado de carga
            const loadingMsg = addMessage(chatWindow, 'Consultando al motor de IA...', 'bot');
            
            // 3. Llamada al servicio de IA Real
            const result = await IAService.classifyIncident(text);
            
            // 4. Quitar carga y mostrar respuesta
            loadingMsg.remove();
            addMessage(chatWindow, result.message, 'bot');
            
            // 5. Renderizar tarjeta de resultado técnico
            renderResultCard(aiResult, result);
        });
    }, 50);
}

function addMessage(window, text, type) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-message ${type} animate-fadeIn`;
    msgDiv.innerHTML = `<div class="chat-bubble">${text}</div>`;
    window.appendChild(msgDiv);
    window.scrollTop = window.scrollHeight;
    return msgDiv;
}

function renderResultCard(container, data) {
    container.classList.remove('d-none');
    container.innerHTML = `
        <div class="nx-card area-card ${data.area} animate-fadeIn" style="padding: 0.75rem;">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="fw-bold m-0">${data.title}</h6>
                <span class="nx-badge nx-badge-outline">${data.area}</span>
            </div>
            <p class="text-secondary" style="font-size: 11px; margin-bottom: 0.75rem;">Canal derivado por el modelo de IA:</p>
            <div class="row g-2">
                <div class="col-6">
                    <div class="text-muted" style="font-size: 9px;">RESPONSABLE</div>
                    <div class="fw-bold" style="font-size: 12px;">${data.contact}</div>
                </div>
                <div class="col-6">
                    <div class="text-muted" style="font-size: 9px;">CORREO</div>
                    <div class="fw-bold" style="font-size: 11px;">${data.email}</div>
                </div>
            </div>
            <div class="mt-3 pt-2 border-top border-white border-opacity-10">
                <button class="nx-btn nx-btn-primary w-100 py-1" onclick="Swal.fire({title:'Ticket Creado', text:'Registrado en el área de ${data.area}', icon:'success', background:'#1c1c1f', color:'#fafafa'})">Confirmar Registro</button>
            </div>
        </div>
    `;
}
