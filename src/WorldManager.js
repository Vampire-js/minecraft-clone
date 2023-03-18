import * as THREE from "three";
import { materials } from "./materials";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { SimplexNoise } from "three/examples/jsm/math/SimplexNoise";
import { EffectsManager } from "./EffectsManager";

export class WorldManager {
  constructor(scene , renderer , camera) {
    this.scene = scene;
    this.mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), materials.grass);
    this.instancedMesh = new THREE.InstancedMesh(
      this.mesh.geometry,
      this.mesh.material,
      25600
    );
    this.loader = new THREE.TextureLoader()
    this.effectsManager = new EffectsManager(renderer , this.scene , camera)
    this.simplex = new SimplexNoise();
    this.dummy = new THREE.Object3D();
    this.side = 160;
    this.depth = 8;
  }
  init() {
    this.mesh.castShadow = true
    this.mesh.receiveShadow = true
    this.makeInstancedMesh();
    this.lightsManager();
    this.addWater();
    this.setupAmbientLighting()
    this.effectsManager.init()
  }
  makeInstancedMesh() {
    this.instancedMesh.receiveShadow = true;
    this.instancedMesh.castShadow = true;
    this.scene.add(this.instancedMesh);
    this.updateInstancedMesh();
  }

  updateInstancedMesh() {
    for (let x = 0; x < this.side; x++) {
      for (let y = 0; y < this.side; y++) {
        this.dummy.position.set(
          x,
          Math.floor(this.simplex.noise(x / 50, y / 50) * this.depth),
          y
        );
        this.dummy.updateMatrix();
        this.instancedMesh.setMatrixAt(x * this.side + y, this.dummy.matrix);
      }
      this.instancedMesh.needsUpdate = true;
    }
  }
  addHdri(e) {
    let loader = new RGBELoader();
    loader
      .setPath("textures/sky/")
      .load("MinecraftSkyDay.hdr", function (texture) {
        texture.mapping = THREE.EquirectangularReflectionMapping;

        e.background = texture;
        e.environment = texture;
      });
  }
  addWater() {
    const water = new THREE.Mesh(
      new THREE.PlaneGeometry(this.side, this.side),
      new THREE.MeshPhysicalMaterial({ color: 0x0781fa  , roughness:0.1})
    );
    water.position.set(this.side / 2, -3, this.side / 2);
    water.rotation.set(-Math.PI / 2, 0, 0);
    this.scene.add(water);
  }
  lightsManager() {
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(9, 6, -3);
    light.castShadow = true;

    this.scene.add(light);
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;

    const hemilight = new THREE.HemisphereLight(0xB1E1FF, 0xB97A20, 0.6);
    this.scene.add(hemilight);
  }
  setupAmbientLighting(){
    const AO = this.loader.load("textures/AO/roundshadow.png")
    const planeSize = 10;

    const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
    const planeMat = new THREE.MeshBasicMaterial({
      map: AO,
      side: THREE.DoubleSide,
    });
    planeMat.color.setRGB(1.5, 1.5, 1.5);
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.rotation.x = Math.PI * -.5;
    this.scene.add(mesh);
  }

  update(){
    this.effectsManager.render()
  }
}
