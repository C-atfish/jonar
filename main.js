import * as THREE from 'three';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshPhongMaterial( { color:  new THREE.Color("rgb(242,61,93)") } );
const cube = new THREE.Mesh( geometry, material );
scene.background = new THREE.Color("rgb(0,61,93)")

scene.add( cube );

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
directionalLight.position.z = 3
scene.add(directionalLight)

camera.position.z = 5;

function animate(){
    requestAnimationFrame(animate);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    
    renderer.render(scene, camera)

}
animate()

new FontLoader().load('font.json', (font) => {
    let textGeo = new TextGeometry(this.settings.text, {
        font: font,
        size: 1, // fontsize
        height: 1, // extrusion
        curveSegments: 10, // how smooth the text is
        bevelEnabled: false,
    });
})  