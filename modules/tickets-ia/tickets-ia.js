import IAService from '../../services/ia-service.js';
import Config from '../../js/config.js';

const KEY_STORAGE_NAME = 'nexus_groq_key';
const EXPIRATION_MS = 5 * 60 * 60 * 1000; // 5 horas

export function init(container) {
    const root = container || document;

    setTimeout(() => {
        const chatForm = root.querySelector('#chat-form');
        const userInput = root.querySelector('#user-input');
        const chatWindow = root.querySelector('#chat-window');
        const aiResult = root.querySelector('#ai-result');
        const keyInput = root.querySelector('#ai-key-input');
        const saveKeyBtn = root.querySelector('#save-key-btn');

        loadSavedKey(keyInput);

        saveKeyBtn.addEventListener('click', () => {
            saveKey(keyInput.value.trim());
        });

        if (!chatForm || !userInput) return;

        chatForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const text = userInput.value.trim();
            const key = keyInput.value.trim();
            
            if (!text) return;
            if (!key) {
                Swal.fire({title:'Configuración', text:'Primero configura tu API Key en el botón de ajustes.', icon:'warning', background:'var(--bg-card)', color:'var(--text-primary)'});
                return;
            }

            saveKey(key);

            addMessage(chatWindow, text, 'user');
            userInput.value = '';
            const loadingSkeleton = addSkeleton(chatWindow);
            
            Config.GROQ_KEY = key;

            const result = await IAService.classifyIncident(text);
            
            loadingSkeleton.remove();
            
            if (result.area === 'ERROR') {
                addMessage(chatWindow, `Error técnico: ${result.message}`, 'bot');
            } else {
                addMessage(chatWindow, result.message, 'bot');
                
                // Detectar saludo simple
                const saludoRegex = /^(hola|buenos días|buenas tardes|buenas noches|hi|hello|saludos)/i;
                if (!saludoRegex.test(text.trim())) {
                    renderResultCard(aiResult, result);
                } else {
                    aiResult.classList.add('d-none');
                }
            }
        });
    }, 50);
}

function addMessage(window, text, type) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-message ${type} mb-3 animate-fadeIn`;
    msgDiv.innerHTML = `<div class="chat-bubble ${type === 'bot' ? '' : ''}">${text}</div>`;
    window.appendChild(msgDiv);
    window.scrollTop = window.scrollHeight;
    return msgDiv;
}

function addSkeleton(window) {
    const skeletonDiv = document.createElement('div');
    skeletonDiv.className = 'chat-message bot mb-3 skeleton-loader';
    skeletonDiv.innerHTML = `
        <div class="skeleton-item" style="width: 80%"></div>
        <div class="skeleton-item" style="width: 50%"></div>
    `;
    window.appendChild(skeletonDiv);
    window.scrollTop = window.scrollHeight;
    return skeletonDiv;
}

function saveKey(key) {
    if (!key) return;
    const data = {
        key: key,
        timestamp: new Date().getTime()
    };
    localStorage.setItem(KEY_STORAGE_NAME, JSON.stringify(data));
}

function loadSavedKey(inputElement) {
    const saved = localStorage.getItem(KEY_STORAGE_NAME);
    if (!saved) return;

    const data = JSON.parse(saved);
    const now = new Date().getTime();

    if (now - data.timestamp < EXPIRATION_MS) {
        inputElement.value = data.key;
    } else {
        localStorage.removeItem(KEY_STORAGE_NAME);
    }
}

function renderResultCard(container, data) {
    container.classList.remove('d-none');
    container.innerHTML = `
        <div class="nx-card p-4 border-primary border-2 shadow-sm mb-4">
            <div class="d-flex align-items-center mb-3">
                <div class="bg-primary bg-opacity-10 p-2 rounded-3 me-3">
                    <i class="bi bi-shield-check text-primary fs-4"></i>
                </div>
                <div>
                    <h5 class="fw-bold m-0">Ticket Clasificado</h5>
                    <div class="text-secondary small">Derivación automática a soporte técnico</div>
                </div>
            </div>
            <div class="row g-3">
                <div class="col-md-4">
                    <div class="text-muted small text-uppercase">Área</div>
                    <div class="fw-bold text-primary">${data.area}</div>
                </div>
                <div class="col-md-4">
                    <div class="text-muted small text-uppercase">Responsable</div>
                    <div class="fw-bold">${data.contact}</div>
                </div>
                <div class="col-md-4">
                    <div class="text-muted small text-uppercase">Celular</div>
                    <div class="fw-bold">${data.phone}</div>
                </div>
            </div>
            <div class="mt-3 p-3 bg-secondary bg-opacity-1 rounded-3">
                <div class="text-white small text-uppercase mb-1">Correo electrónico</div>
                <div class="fw-bold text-white">${data.email}</div>
            </div>
            <div class="mt-3 p-3 bg-secondary bg-opacity-1 rounded-3">
                <p class="text-white small mb-0"><strong>Nota:</strong> ${data.message}</p>
            </div>
        </div>
    `;
}
