document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('music-toggle');
    const audio = document.getElementById('bg-music');
    const statusText = document.getElementById('status-text');

    const MAX_VOLUME = 0.4; 
    const FADE_DURATION = 2000; 
    const FADE_STEP = 50; 
    let fadeInterval;

    // 1. Check if the user previously had music ON
    const musicPath = window.location.pathname; // Helpful for debugging
    if (localStorage.getItem('musicEnabled') === 'true') {
        toggle.checked = true;
        statusText.textContent = "SOUND ON";
        audio.volume = MAX_VOLUME;
        // Note: Some browsers still require a click before auto-playing
        // even if we saved the state.
        audio.play().catch(() => console.log("Waiting for user interaction to play..."));
    }

    function adjustVolume(targetVolume) {
        clearInterval(fadeInterval);
        const volumeIncrement = (targetVolume - audio.volume) / (FADE_DURATION / FADE_STEP);

        fadeInterval = setInterval(() => {
            let nextVolume = audio.volume + volumeIncrement;
            if ((volumeIncrement > 0 && nextVolume >= targetVolume) || 
                (volumeIncrement < 0 && nextVolume <= targetVolume)) {
                audio.volume = targetVolume;
                clearInterval(fadeInterval);
                if (targetVolume === 0) audio.pause();
            } else {
                audio.volume = nextVolume;
            }
        }, FADE_STEP);
    }

    toggle.addEventListener('change', () => {
        if (toggle.checked) {
            localStorage.setItem('musicEnabled', 'true');
            audio.volume = 0;
            audio.play().then(() => {
                statusText.textContent = "SOUND ON";
                adjustVolume(MAX_VOLUME);
            });
        } else {
            localStorage.setItem('musicEnabled', 'false');
            statusText.textContent = "SOUND OFF";
            adjustVolume(0);
        }
    });
});