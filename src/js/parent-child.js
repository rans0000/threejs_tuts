import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const renderer = new THREE.WebGL1Renderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
const orbit = new OrbitControls(camera, renderer.domElement);
camera.position.set(-5, 10, 10);
orbit.update();

//add basic box geometry
const boxGeom = new THREE.BoxGeometry();
const basicMaterial = new THREE.MeshBasicMaterial({ color: 0x00FF00, wireframe: true });
const box = new THREE.Mesh(boxGeom, basicMaterial);
scene.add(box);

const earthObj = new THREE.Object3D();
const earthGeo = new THREE.SphereGeometry(1, 8, 4);
const earth = new THREE.Mesh(earthGeo, basicMaterial);
earthObj.add(earth);
earth.position.set(6, 0, 0);
scene.add(earthObj);


//
function animate(time) {

    box.rotation.y += .04;
    earthObj.rotation.y += .03;

    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);