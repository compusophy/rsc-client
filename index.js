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
    
    // Create game container with proper aspect ratio
    const gameContainer = document.createElement('div');
    gameContainer.style.position = 'relative';
    gameContainer.style.width = '100%';
    gameContainer.style.maxWidth = '512px';
    gameContainer.style.aspectRatio = '512/346';
    
    wrapperContainer.appendChild(gameContainer);
    
    // Detect if we're on mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Initialize the game client
    const mc = window.mc = new mudclient(gameContainer);
    
    mc.setOptions({
        middleClickCamera: true,
        mouseWheel: true,
        resetCompass: true,
        zoomCamera: true,
        accountManagement: true,
        mobile: isMobile  // Auto-detect mobile devices
    });
    
    // Style the body
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.height = '100vh';
    document.body.style.overflow = 'hidden';
    document.body.style.backgroundColor = '#000';
    
    document.body.appendChild(wrapperContainer);

    await mc.startApplication(512, 346, 'Runescape by Andrew Gower');
})();
