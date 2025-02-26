const mudclient = require('./src/mudclient');

if (typeof window === 'undefined') {
    throw new Error('rsc-client needs to run in a browser');
}

// Remove Farcaster Frame support code

(async () => {
    // Get the existing game container from our HTML
    const gameContainer = document.getElementById('gameContainer');
    
    // Create the game container for the client
    const mcContainer = document.createElement('div');
    
    // Add the game container to our existing container
    gameContainer.appendChild(mcContainer);
    
    const args = window.location.hash.slice(1).split(',');
    const mc = new mudclient(mcContainer);
    
    // Make client globally available
    window.mc = mc;

    window.mcOptions = mc.options;

    Object.assign(mc.options, {
        middleClickCamera: true,
        mouseWheel: true,
        resetCompass: true,
        zoomCamera: true,
        accountManagement: true,
        mobile: true // Always set mobile to true for better touch support
    });

    mc.members = args[0] === 'members';
    
    // Use the provided server address or default to the Railway server
    mc.server = args[1] ? args[1] : 'rsc-server-production.up.railway.app';
    
    // Don't specify a port for Railway domains
    mc.port = args[2] && !isNaN(+args[2]) ? +args[2] : 
        (mc.server.includes('railway.app') ? null : 43595);

    mc.threadSleep = 10;

    // Style the body to ensure full height and remove margins
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.height = '100vh';
    document.body.style.overflow = 'hidden';
    document.body.style.backgroundColor = '#000';
    
    document.body.appendChild(gameContainer);

    await mc.startApplication(512, 346, 'Runescape by Andrew Gower');
})();
