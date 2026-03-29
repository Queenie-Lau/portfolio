const nav = document.querySelector('.works-nav');
const vignette = document.createElement('div');
vignette.id = 'vignette-layer';
document.body.appendChild(vignette);

let currentMode = 'none';

window.addEventListener('mousemove', (e) => {
    document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
    document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);

    if (currentMode !== 'none') {
        spawnParticle(e.clientX, e.clientY);
    }
});

document.querySelectorAll('.works-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
        const title = item.querySelector('.works-title').innerText;
        if (title.includes('CODE')) currentMode = 'binary';
        else if (title.includes('PHOTO')) currentMode = 'ascii';
        else if (title.includes('VIDEO')) currentMode = 'video'; // Added Video check
        else currentMode = 'dots';
    });
    item.addEventListener('mouseleave', () => currentMode = 'none');
});

function spawnParticle(x, y) {
    const p = document.createElement('span');
    p.className = 'trail-particle';
    
    let keyframes = [];
    
    if (currentMode === 'binary') {
        p.innerText = Math.random() > 0.5 ? "1" : "0";
        keyframes = [
            { transform: 'translate(-50%, -50%) translateY(0) scale(1)', opacity: 0.8 },
            { transform: `translate(-50%, -50%) translateY(${Math.random() * -50}px) scale(0)`, opacity: 0 }
        ];
    } else if (currentMode === 'ascii') {
        const chars = ".:*+°";
        p.innerText = chars[Math.floor(Math.random() * chars.length)];
        keyframes = [
            { transform: 'translate(-50%, -50%) scale(1)', opacity: 0.8 },
            { transform: `translate(-50%, -50%) scale(2) rotate(90deg)`, opacity: 0 }
        ];
    } else if (currentMode === 'video') {
        // VIDEO EFFECT: Shutter / Scanline bars
        p.innerText = "—"; 
        p.style.fontSize = "24px";
        p.style.fontWeight = "100";
        keyframes = [
            { transform: 'translate(-50%, -50%) scaleX(1) scaleY(1)', opacity: 0.6 },
            { transform: 'translate(-50%, -50%) scaleX(5) scaleY(0.1)', opacity: 0 } 
        ];
    }

    Object.assign(p.style, {
        position: 'fixed',
        left: `${x}px`,
        top: `${y}px`,
        pointerEvents: 'none',
        fontSize: '12px',
        color: 'white',
        opacity: '0.8',
        zIndex: '4',
        fontFamily: 'monospace',
        // Random rotation for variety, except for video which stays horizontal
        transform: currentMode === 'video' ? 'translate(-50%, -50%)' : `translate(-50%, -50%) rotate(${Math.random() * 360}deg)`
    });

    document.body.appendChild(p);

    const animation = p.animate(keyframes, { 
        duration: currentMode === 'video' ? 600 : 1000, 
        easing: 'ease-out' 
    });

    animation.onfinish = () => p.remove();
}