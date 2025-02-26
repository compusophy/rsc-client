const mudclient = require('./src/mudclient');

if (typeof window === 'undefined') {
    throw new Error('rsc-client needs to run in a browser');
}

// Remove Farcaster Frame support code

(async () => {
    // Create a wrapper container for the game
    const wrapperContainer = document.createElement('div');
    wrapperContainer.style.display = 'flex';
    wrapperContainer.style.justifyContent = 'center';
    wrapperContainer.style.alignItems = 'center';
    wrapperContainer.style.height = '100vh';
    wrapperContainer.style.width = '100%';
    
    // Create the game container
    const mcContainer = document.createElement('div');
    
    // Add the game container to the wrapper
    wrapperContainer.appendChild(mcContainer);
    
    const args = window.location.hash.slice(1).split(',');
    const mc = new mudclient(mcContainer);
    
    // Make client globally accessible
    window.mc = mc;
    window.mcOptions = mc.options;

    // Detect mobile devices
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    Object.assign(mc.options, {
        middleClickCamera: true,
        mouseWheel: true,
        resetCompass: true,
        zoomCamera: true,
        accountManagement: true,
        mobile: isMobile  // Only enable mobile mode on actual mobile devices
    });

    mc.members = args[0] === 'members';
    mc.server = args[1] ? args[1] : 'rsc-server-production.up.railway.app';
    mc.port = args[2] && !isNaN(+args[2]) ? +args[2] : 
        (mc.server.includes('railway.app') ? null : 43595);
    mc.threadSleep = 10;
    
    // Style the body
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.height = '100vh';
    document.body.style.overflow = 'hidden';
    document.body.style.backgroundColor = '#000';
    
    document.body.appendChild(wrapperContainer);

    await mc.startApplication(512, 346, 'Runescape by Andrew Gower');
})();
