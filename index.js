const mudclient = require('./src/mudclient');

if (typeof window === 'undefined') {
    throw new Error('rsc-client needs to run in a browser');
}

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
