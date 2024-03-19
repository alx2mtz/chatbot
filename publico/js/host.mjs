const ws = new WebSocket('ws://localhost:3000');

ws.addEventListener('open', (event) => {
    console.log('WebSocket Connection Opened:', event);
});

ws.addEventListener('message', (event) => {
    console.log('WebSocket Message Received:', event.data);
});

function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value;

    if (message.trim() !== '') {
        ws.send(message); // Enviar el mensaje como cadena de texto
        messageInput.value = '';
    }
}