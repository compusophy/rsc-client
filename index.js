const mudclient = require('./src/mudclient');

if (typeof window === 'undefined') {
    throw new Error('rsc-client needs to run in a browser');
}

// Remove Farcaster Frame support code

(async () => {
    // Create a wrapper container that takes up the full viewport
    const wrapperContainer = document.createElement('div');
    wrapperContainer.style.display = 'flex';
    wrapperContainer.style.justifyContent = 'center';
    wrapperContainer.style.alignItems = 'center';
    wrapperContainer.style.width = '100%';
    wrapperContainer.style.height = '100vh';
    wrapperContainer.style.margin = '0';
    wrapperContainer.style.padding = '0';
    wrapperContainer.style.overflow = 'hidden';
    
    // Create the game container
    const mcContainer = document.createElement('div');
    // We don't set dimensions here - let the game set them
    
    // Add the game container to the wrapper
    wrapperContainer.appendChild(mcContainer);
    
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
    
    document.body.appendChild(wrapperContainer);

    await mc.startApplication(512, 346, 'Runescape by Andrew Gower');
})();
