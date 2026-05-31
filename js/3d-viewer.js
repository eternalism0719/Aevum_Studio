// Three.js 3D Model Viewer Logic
let scene, camera, renderer, model;

function init3D() {
    const container = document.getElementById('three-container');
    if (!container) return;

    // Create Scene
    scene = new THREE.Scene();

    // Setup Camera
    camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    // Setup Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Add Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00f3ff, 2);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const pinkLight = new THREE.PointLight(0xff00ff, 2);
    pinkLight.position.set(-5, -5, 5);
    scene.add(pinkLight);

    // Create a Cool 3D Geometry (Placeholder for actual .obj/.gltf)
    const geometry = new THREE.TorusKnotGeometry(1, 0.3, 128, 16);
    const material = new THREE.MeshStandardMaterial({
        color: 0x333333,
        metalness: 0.9,
        roughness: 0.1,
        emissive: 0x001122
    });
    
    model = new THREE.Mesh(geometry, material);
    scene.add(model);

    // Add Wireframe Overlay (analytical look)
    const wireframe = new THREE.LineSegments(
        new THREE.EdgesGeometry(geometry),
        new THREE.LineBasicMaterial({ color: 0x00f3ff, transparent: true, opacity: 0.2 })
    );
    model.add(wireframe);

    // Mouse Interaction
    let mouseX = 0, mouseY = 0;
    container.addEventListener('mousemove', e => {
        // Normalize mouse coordinates for light movement
        mouseX = (e.offsetX / container.clientWidth) * 2 - 1;
        mouseY = -(e.offsetY / container.clientHeight) * 2 + 1;
        
        // Move the cyan light slightly based on mouse
        pointLight.position.x = mouseX * 5;
        pointLight.position.y = mouseY * 5;
    });

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    
    // Auto rotation
    if (model) {
        model.rotation.y += 0.005;
        model.rotation.z += 0.001;
    }

    renderer.render(scene, camera);
}

// Handle Window Resize
window.addEventListener('resize', () => {
    const container = document.getElementById('three-container');
    if (!container) return;
    
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
});

// Initialize on load
window.addEventListener('DOMContentLoaded', init3D);
