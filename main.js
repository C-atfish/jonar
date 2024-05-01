import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const startingCameraPosition = new THREE.Vector3(0, 0, 5);
const initialOrbitTarget = new THREE.Vector3(0, 0, 0);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const geometry2 = new THREE.ConeGeometry();
const material = new THREE.MeshPhongMaterial({
  color: new THREE.Color("rgb(242,61,93)"),
});
const cube = new THREE.Mesh(geometry, material);
const cone = new THREE.Mesh(geometry2, material);
scene.background = new THREE.Color("rgb(0,61,93)");

scene.add(cube);
scene.add(cone);

cone.position.x = 4;
cone.position.z = 4;

const insideLight = new THREE.PointLight(0xff0000, 1, 100);
insideLight.position.set(0, 0, 0);
scene.add(insideLight);

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
    cube.material.color = new THREE.Color("rgb(59,93,241)");
  } else {
    cube.material.color = new THREE.Color("rgb(242,61,93)"); // Reset color when not hovered
  }
}

window.addEventListener("mousemove", onMouseMove, false);

const modelLoader = new GLTFLoader();

modelLoader.load("room_jonar.glb", (gltf) => {
  // traverse and make every normal doublesided
  gltf.scene.traverse((child) => {
    if (child.isMesh) {
      child.material.side = THREE.DoubleSide;
    }
  });
  gltf.scene.position.x = 2;
  gltf.scene.position.y = -1;
  gltf.scene.position.z = 1.9;

  scene.add(gltf.scene);
});

// Load the font
const loader = new FontLoader();
loader.load(
  "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
  function (font) {
    const textGeo = new TextGeometry("Use mouse to move around", {
      font: font,
      size: 0.5,
      height: 0.1,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.01,
      bevelSize: 0.02,
      bevelSegments: 5,
    });

    const textMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const textMesh = new THREE.Mesh(textGeo, textMaterial);
    textMesh.position.set(-4, 2, 0);
    textMesh.rotation.x = -0.2;
    scene.add(textMesh);
  }
);

function moveToObject() {
  cube.position.x += 0.2;
  // orbit control camera looks at object
  controls.target.copy(cone.position);
  // Change camera position
  camera.position.copy(cone.position);
  camera.position.z += 5;
}

function moveBack() {
  camera.position.copy(startingCameraPosition); // Reset the camera position to its initial state
  controls.target.copy(initialOrbitTarget);
  controls.update();
}
document
  .getElementById("moveToConeButton")
  .addEventListener("click", moveToObject);
document.getElementById("goBackButton").addEventListener("click", moveBack);
function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  controls.update();
  highlightIntersections();
  renderer.render(scene, camera);
}

animate();
