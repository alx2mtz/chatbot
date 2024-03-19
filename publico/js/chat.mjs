const ws = new WebSocket('ws://localhost:3000');
    
ws.addEventListener('open', (event) => {
    console.log('WebSocket Connection Opened:', event);
});

ws.addEventListener('message', (event) => {
    console.log('WebSocket Message Received:', event.data);
    displayMessage(event.data);
});

// Función para enviar un mensaje cuando se presiona "Enter"
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// Asignar el evento de "keypress" al campo de entrada de mensajes
document.getElementById('user-message').addEventListener('keypress', handleKeyPress);

function sendMessage() {
    const userMessage = document.getElementById('user-message').value.trim();
    const chatMessages = document.getElementById('chat-messages');

    // Verificar si el campo de entrada está vacío
    if (userMessage === '') {
        return;
    }

    // Agregar mensaje del usuario al chat
    chatMessages.innerHTML += `<div class="user-message">${userMessage}</div>`;

    // Enviar mensaje al servidor
    fetch(`http://localhost:3000/chatgpt?message=${userMessage}`)
        .then(response => response.json())
        .then(data => {
            // Agregar respuesta del chatbot al chat
            chatMessages.innerHTML += `<div class="bot-message">${data.response}</div>`;
        });

    // Limpiar el campo de entrada
    document.getElementById('user-message').value = '';
}

function displayMessage(message) {
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.innerHTML += `<div class="bot-message">${message}</div>`;
}

// Observador de mutaciones para desplazarse hacia abajo automáticamente cuando se agregue un nuevo mensaje
const observer = new MutationObserver(() => {
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

observer.observe(document.getElementById('chat-messages'), { childList: true });