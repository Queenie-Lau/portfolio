window.addEventListener('load', () => {
    const magazineElement = document.getElementById('magazine');
    if (!magazineElement) return;

    const pageFlip = new St.PageFlip(magazineElement, {
        width: 450, 
        height: 650,
        size: "fixed",
        
        showCover: true,      // Tells the framework Page 0 is a cover
        mode: "double",       // Forces double-page spread logic
        useMouseEvents: true,
        flippingTime: 1200,   
        
        drawShadow: true,
        maxShadowOpacity: 0.1, 
        showPageCorners: true, 
        
        usePortrait: false,   // Ensures it doesn't switch to single-page on small screens
        startPage: 1,
        clickEventForward: false
    });

    pageFlip.loadFromHTML(document.querySelectorAll('.page'));
});