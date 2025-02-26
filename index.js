const mudclient = require('./src/mudclient');

if (typeof window === 'undefined') {
    throw new Error('rsc-client needs to run in a browser');
}

// Add Farcaster Frame SDK
function addFarcasterSupport() {
    // Add meta tag for Farcaster Frame
    const metaTag = document.createElement('meta');
    metaTag.setAttribute('property', 'fc:frame');
    metaTag.setAttribute('content', JSON.stringify({
        version: 'next',
        imageUrl: 'https://rsc-client-production.up.railway.app/favicon.png',
        button: {
            title: 'play',
            action: {
                type: 'launch_frame',
                name: 'RuneScape Classic',
                url: 'https://rsc-client-production.up.railway.app/',
                splashImageUrl: 'https://rsc-client-production.up.railway.app/favicon.png',
                splashBackgroundColor: '#000000'
            }
        }
    }));
    document.head.appendChild(metaTag);
    
    // Add Farcaster SDK script
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@farcaster/frame-sdk/dist/index.min.js';
    script.onload = function() {
        // Initialize Farcaster Frame SDK when loaded
        if (window.frame && window.frame.sdk) {
            window.frame.sdk.actions.ready();
        }
    };
    document.body.appendChild(script);
}

// Call the function to add Farcaster support
addFarcasterSupport();

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
