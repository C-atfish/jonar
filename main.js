import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshPhongMaterial({ color: new THREE.Color("rgb(242,61,93)") });
const cube = new THREE.Mesh(geometry, material);
scene.background = new THREE.Color("rgb(0,61,93)");

scene.add(cube);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.z = 3;
scene.add(directionalLight);

camera.position.z = 5;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseMove(event) {
    // Calculate mouse position in normalized device coordinates (-1 to +1) for both components
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function highlightIntersections() {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects([cube]);

    if (intersects.length > 0) {
        cube.material.color = new THREE.Color("rgb(59,93,241)")
    } else {
        cube.material.color = new THREE.Color("rgb(242,61,93)") // Reset color when not hovered
    }
}

window.addEventListener('mousemove', onMouseMove, false);

// Load the font
const loader = new FontLoader();
loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
    const textGeo = new TextGeometry('Use mouse to move around', {
        font: font,
        size: 0.5,
        height: 0.1,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.01,
        bevelSize: 0.02,
        bevelSegments: 5
    });

    const textMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const textMesh = new THREE.Mesh(textGeo, textMaterial);
    textMesh.position.set(-4, 2, 0); 
    textMesh.rotation.x = -0.2;
    scene.add(textMesh);
});

function animate() {
    requestAnimationFrame(animate);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    controls.update();
    highlightIntersections(); // Check for intersections
    renderer.render(scene, camera);
}

animate();
