import "./style.css";
import * as THREE from "three";
import { WorldManager } from "./src/WorldManager";
import { FPSCamera } from "./src/PlayerController";


const scene = new THREE.Scene();
scene.background = new THREE.Color("#41b1f2");
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.shadowMap.enabled = true
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.set(12.341603543921833, 
  55.54026855383366,16.70519393182329)

const worldManager = new WorldManager(scene , renderer , camera);

worldManager.init();

const controls = new FPSCamera(camera)
controls.init(scene)

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);

  worldManager.update()
}

animate();

