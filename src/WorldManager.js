import * as THREE from "three";
import { materials } from "./materials";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { SimplexNoise } from "three/examples/jsm/math/SimplexNoise";
import { EffectsManager } from "./EffectsManager";
import { TreesManager } from "./TreesManager";

export class WorldManager {
  constructor(scene, renderer, camera) {
    this.scene = scene;
    this.camera = camera;
    this.mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), materials.grass);
    this.treeMesh = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      materials.debug
    );
    this.instancedMesh = new THREE.InstancedMesh(
      this.mesh.geometry,
      this.mesh.material,
      256
    );
    this.loader = new THREE.TextureLoader();
    this.effectsManager = new EffectsManager(renderer, this.scene, camera);
    this.treesManager = new TreesManager(this.scene, this.instancedMesh);
    this.simplex = new SimplexNoise();
    this.dummy = new THREE.Object3D();
    this.side = 16;
    this.depth = 16;
    this.heightMap = new Array();
    this.trees = new Array();
    this.chunks = new Array();
    this.frame = 0;
  }
  init() {
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;


    this.lightsManager();
    // this.treesManager.spawnTrees(this.camera)
    this.addWater();    
    this.generateTerrain()
    this.addChunk()
    this.addChunk()
    this.addChunk()


    // this.setupAmbientLighting()
    this.setupSky();
    this.effectsManager.init();
    this.effectsManager.updateColors({ r: 0.5, g: 0.5, b: 0.5 });

    this.trees.map((tree) => this.scene.add(tree));
  }
  generateTerrain(){
    
    for(let val=0; val<this.chunks.length; val++){
    for (let i = 0; i < this.side; i++) {
      this.heightMap[i] = [];
    }
    
    // Generate the heightmap using Perlin noise
    for (let i = 0; i < this.side; i++) {
      for (let j = 0; j < this.depth; j++) {
        const x = i / this.side;
        const y = j / this.depth;
        this.heightMap[i][j] = this.simplex.noise(x, y);
      }
    }
    console.log(this.heightMap)

    const matrix = new THREE.Matrix4()
    let index = 0

      val >=1 ?this.chunks[val].position.x = this.chunks[val-1].position.x + 16  :null
    for(let i =0; i<this.side; i++){
      for(let j=0; j<this.depth; j++){
        matrix.setPosition(i, Math.floor(this.heightMap[i][j] * 3.5), j);
        this.chunks[val].setMatrixAt(index , matrix)
        index++
      }
    

      
    this.scene.add(this.chunks[val])
    }
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
    const waterMat = this.loader.load("textures/water/water.jpeg");

    waterMat.wrapS = THREE.RepeatWrapping;
    waterMat.wrapT = THREE.RepeatWrapping;
    waterMat.repeat.set(185, 185);

    this.water = new THREE.Mesh(
      new THREE.PlaneGeometry(this.side, this.side),
      new THREE.MeshPhysicalMaterial({ map: waterMat })
    );
    this.water.position.set(this.side / 2, -3, this.side / 2);
    this.water.rotation.set(-Math.PI / 2, 0, 0);
    this.scene.add(this.water);
  }
  lightsManager() {
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(9, 6, -3);
    light.castShadow = true;

    this.scene.add(light);
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;

    const hemilight = new THREE.HemisphereLight(0xb1e1ff, 0xb97a20, 0.6);
    this.scene.add(hemilight);
  }
  setupSky() {
    const clouds = this.loader.load("textures/sky/clouds.png");

    const cloudConfig = {
      geometry: new THREE.PlaneGeometry(this.side * 2, this.side * 2),
      material: new THREE.MeshBasicMaterial({
        map: clouds,
        side: THREE.DoubleSide,
        transparent: true,
      }),
    };
    const cloudsPlane = new THREE.Mesh(
      cloudConfig.geometry,
      cloudConfig.material
    );
    cloudsPlane.position.set((this.side * 2) / 2, 40, (this.side * 2) / 2);
    cloudsPlane.rotation.x = Math.PI * -0.5;
    cloudConfig.material.color.setRGB(1.5, 1.5, 1.5);
    this.scene.add(cloudsPlane);

    const sun = this.loader.load("textures/sky/sun.png");
    const sunSize = 30;
    const sunConfig = {
      geometry: new THREE.PlaneGeometry(sunSize, sunSize),
      material: new THREE.MeshPhysicalMaterial({
        map: sun,
        side: THREE.DoubleSide,
        transparent: true,
        emissive: true,
        emissiveIntensity: 2,
      }),
    };
    const sunPlane = new THREE.Mesh(sunConfig.geometry, sunConfig.material);
    sunPlane.position.set(sunSize / 2, 40, sunSize / 2);
    sunPlane.rotation.x = Math.PI * 0.25;
    sunConfig.material.color.setRGB(1.5, 1.5, 1.5);
    // this.scene.add(sunPlane)
  }
  setupAmbientLighting() {
    const AO = this.loader.load("textures/AO/roundshadow.png");
    const planeSize = 10;

    const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
    const planeMat = new THREE.MeshBasicMaterial({
      map: AO,
      side: THREE.DoubleSide,
    });
    planeMat.color.setRGB(1.5, 1.5, 1.5);
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.rotation.x = Math.PI * -0.5;
    this.scene.add(mesh);
  }

  addChunk() {
    this.chunks.push(
      new THREE.InstancedMesh(this.mesh.geometry, this.mesh.material, 256)
    );
    console.log(this.chunks)
  }

  update() {
    this.effectsManager.render();
    this.generateTerrain()
   
  }
}
