const mudclient = require('./src/mudclient');

if (typeof window === 'undefined') {
    throw new Error('rsc-client needs to run in a browser');
}

// Inject WebSocket override before anything else
(function() {
    // Store the original WebSocket constructor
    const OriginalWebSocket = window.WebSocket;
    
    // Override the WebSocket constructor
    window.WebSocket = function(url, protocols) {
        // Always replace localhost/127.0.0.1 with the Railway server
        if (url.includes('127.0.0.1') || url.includes('localhost')) {
            const serverAddress = 'rsc-server.railway.internal';
            url = url.replace(/ws:\/\/(127\.0\.0\.1|localhost):[0-9]+/, `ws://${serverAddress}:43595`);
            console.log('Redirecting WebSocket connection to:', url);
        }
        
        // Call the original WebSocket constructor with the modified URL
        return new OriginalWebSocket(url, protocols);
    };
    
    // Copy all properties from the original WebSocket constructor
    for (const prop in OriginalWebSocket) {
        if (OriginalWebSocket.hasOwnProperty(prop)) {
            window.WebSocket[prop] = OriginalWebSocket[prop];
        }
    }
    
    // Set the prototype to match the original
    window.WebSocket.prototype = OriginalWebSocket.prototype;
    
    // Also patch any existing WebSocket instances
    if (window.WebSockets) {
        for (let i = 0; i < window.WebSockets.length; i++) {
            const ws = window.WebSockets[i];
            if (ws.url && (ws.url.includes('127.0.0.1') || ws.url.includes('localhost'))) {
                // Close and recreate with the correct URL
                const newUrl = ws.url.replace(/ws:\/\/(127\.0\.0\.1|localhost):[0-9]+/, 
                                             `ws://rsc-server.railway.internal:43595`);
                const newWs = new OriginalWebSocket(newUrl, ws.protocol);
                
                // Copy event handlers
                if (ws.onopen) newWs.onopen = ws.onopen;
                if (ws.onclose) newWs.onclose = ws.onclose;
                if (ws.onerror) newWs.onerror = ws.onerror;
                if (ws.onmessage) newWs.onmessage = ws.onmessage;
                
                window.WebSockets[i] = newWs;
            }
        }
    }
    
    // Add a global variable to indicate our patch is active
    window.__websocketPatched = true;
})();

// Add a function to create WebSockets with the correct URL
window.createWebSocket = function(path) {
    const serverAddress = 'rsc-server.railway.internal';
    const url = `ws://${serverAddress}:43595${path || ''}`;
    console.log('Creating WebSocket with URL:', url);
    return new WebSocket(url);
};

(async () => {
    const mcContainer = document.createElement('div');
    const args = window.location.hash.slice(1).split(',');
    const mc = new mudclient(mcContainer);

    window.mcOptions = mc.options;

    Object.assign(mc.options, {
        middleClickCamera: true,
        mouseWheel: true,
        resetCompass: true,
        zoomCamera: true,
        accountManagement: true,
        mobile: false
    });

    mc.members = args[0] === 'members';
    
    // Use the provided server address or default to the Railway domain
    mc.server = args[1] ? args[1] : 'rsc-server.railway.internal';
    
    // Use the provided port or default to the WebSocket port from the server config
    mc.port = args[2] && !isNaN(+args[2]) ? +args[2] : 43595;

    // Store these globally to help with WebSocket creation
    window.serverAddress = mc.server;
    window.serverPort = mc.port;

    mc.threadSleep = 10;

    document.body.appendChild(mcContainer);

    const fullscreen = document.createElement('button');

    fullscreen.innerText = 'Fullscreen';

    fullscreen.onclick = () => {
        mcContainer.requestFullscreen();
    };

    document.body.appendChild(fullscreen);

    await mc.startApplication(512, 346, 'Runescape by Andrew Gower');
})();
