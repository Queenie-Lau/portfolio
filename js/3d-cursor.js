import * as THREE from 'https://esm.sh/three@0.165.0';
import { GLTFLoader } from 'https://esm.sh/three@0.165.0/examples/jsm/loaders/GLTFLoader.js';

const MODEL_PATH = new URL('assets/heart-cursor.glb', window.location.href).href;

let scene, camera, renderer, model;
let mouseX = 0, mouseY = 0;
let targetX = 0, targetY = 0;

function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.domElement.id = 'cursor-canvas';
    document.body.appendChild(renderer.domElement);

    // BRIGHT LIGHTING: To ensure the white "pops"
    const ambientLight = new THREE.AmbientLight(0xffffff, 3.0); 
    scene.add(ambientLight);
    
    const frontLight = new THREE.PointLight(0xffffff, 30);
    frontLight.position.set(0, 0, 5);
    scene.add(frontLight);

    // GHOSTLY WHITE GLASS MATERIAL:
    const glassMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,        // Pure White base
        metalness: 0.1,         // Slight metallic sheen
        roughness: 0.0,         // Perfectly smooth
        transmission: 0.3,      // Less transparent than before so it stays visible
        thickness: 1.0,         // Adds more "body" to the glass
        transparent: true,
        opacity: 0.8,           // Higher opacity to make it "whiter"
        emissive: 0xffffff,     // High-intensity white glow
        emissiveIntensity: 3.5, // This is what makes it "glow" and easy to see
        ior: 1.5,
    });

    const loader = new GLTFLoader();
    loader.load(MODEL_PATH, (gltf) => {
        model = gltf.scene;

        model.traverse((child) => {
            if (child.isMesh) {
                child.material = glassMaterial;
            }
        });

        // Tiny scale for elegant cursor
        model.scale.set(0.015, 0.015, 0.015); 
        model.rotation.set(0, 0, 0);
        
        scene.add(model);
    }, undefined, (error) => {
        console.error('Model not found at path:', error);
    });

    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;

        if (Math.random() > 0.85) {
            spawnAsciiHeart(e.clientX, e.clientY);
        }
    });

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    animate();
}

const hearts = ["♡", "♥", "❤", "❣"];

function spawnAsciiHeart(x, y) {
    const p = document.createElement('span');
    p.className = 'heart-particle';
    
    // Randomly pick an ASCII heart
    p.innerText = hearts[Math.floor(Math.random() * hearts.length)];
    
    // Initial Position
    const size = Math.random() * 15 + 10; // 10px to 25px
    Object.assign(p.style, {
        left: `${x}px`,
        top: `${y}px`,
        fontSize: `${size}px`,
        opacity: '1',
        transform: `translate(-50%, -50%) rotate(${Math.random() * 30 - 15}deg)`
    });

    document.body.appendChild(p);

    // Animation: Drift up and fade out
    const driftX = (Math.random() - 0.5) * 100; // Random horizontal drift
    const driftY = -50 - Math.random() * 100;   // Always drift up
    
    const animation = p.animate([
        { 
            transform: 'translate(-50%, -50%) scale(1) translateY(0)', 
            opacity: 1 
        },
        { 
            transform: `translate(-50%, -50%) scale(0.5) translate(${driftX}px, ${driftY}px)`, 
            opacity: 0 
        }
    ], {
        duration: 1200 + Math.random() * 800,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)'
    });

    animation.onfinish = () => p.remove();
}

function animate() {
    requestAnimationFrame(animate);

    if (model) {
        // High-precision smooth follow
        targetX += (mouseX - targetX) * 0.25;
        targetY += (mouseY - targetY) * 0.25;

        const vector = new THREE.Vector3(targetX, targetY, 0.5);
        vector.unproject(camera);
        const dir = vector.sub(camera.position).normalize();
        const distance = -camera.position.z / dir.z;
        const pos = camera.position.clone().add(dir.multiplyScalar(distance));
        
        model.position.copy(pos);
        model.rotation.set(0, 0, 0); 
    }

    renderer.render(scene, camera);
}

init();