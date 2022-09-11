import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
import { Vector2 } from 'three';

const renderer = new THREE.WebGL1Renderer();
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
const orbit = new OrbitControls(camera, renderer.domElement)

// add 3d helper
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
camera.position.set(-10, 30, 30);
orbit.update();

//add grid helper
const gridHelper = new THREE.GridHelper(30);
scene.add(gridHelper);

//add basic box geometry
const boxGeom = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00FF00 });
const box = new THREE.Mesh(boxGeom, boxMaterial);
scene.add(box);

//add basic plane geometry
const planeGeom = new THREE.PlaneGeometry(30, 30);
const planeMaterial = new THREE.MeshBasicMaterial({
    color: 0xFFFFFF,
    side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(planeGeom, planeMaterial);
plane.receiveShadow = true;
scene.add(plane);
plane.rotation.x = -0.5 * Math.PI;

//add basic sphere geometry
const sphereGeom = new THREE.SphereGeometry(4, 20, 20);
const sphereMaterial = new THREE.MeshStandardMaterial({
    color: 0x0000FF,
    // wireframe: true,
});
const sphere = new THREE.Mesh(sphereGeom, sphereMaterial);
sphere.castShadow = true;
sphere.receiveShadow = true;
scene.add(sphere);
sphere.position.set(-5, 0, 0);

//Lighting setup
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.8);
directionalLight.castShadow = true;
directionalLight.position.set(-30, 50, 0);
directionalLight.shadow.camera.bottom = -12;
scene.add(directionalLight);

const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
scene.add(dLightHelper);
const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
scene.add(dLightShadowHelper);

//fog
// scene.fog = new THREE.Fog(0xFFFFFF, 0, 200);
scene.fog = new THREE.FogExp2(0xFFFFFF, 0.01);
renderer.setClearColor(0xFFEA00);

//datGUI config
const gui = new dat.GUI();
const options = {
    sphereColor: '#ffea00',
    wireframe: false,
    speed: 0.1,
};
gui.addColor(options, 'sphereColor').onChange(e => sphere.material.color.set(e));
gui.add(options, 'wireframe').onChange(e => sphere.material.wireframe = e);
gui.add(options, 'speed', 0, 0.1);

let dy = 0;

//object selection
const mousePosition = new Vector2();
window.addEventListener('mousemove', e => {
    mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = (e.clientY / window.innerHeight) * 2 + 1;
});
const rayCaster = new THREE.Raycaster();

function animate(time) {
    console.log(time);
    box.rotation.x = time / 1000;
    box.rotation.y = time / 1000;

    dy += options.speed;
    sphere.position.y = Math.abs(Math.sin(dy)) * 10;

    rayCaster.setFromCamera(mousePosition, camera);
    const intersects = rayCaster.intersectObjects(scene.children);
    console.log(intersects);

    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});