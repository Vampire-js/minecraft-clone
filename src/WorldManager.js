import * as THREE from "three";
import { materials } from "./materials";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { SimplexNoise } from "three/examples/jsm/math/SimplexNoise";
import { EffectsManager } from "./EffectsManager";
import { TreesManager } from "./TreesManager";
import { DirtBlock } from "./DirtBlock";
import { LightsManager } from "./LightsManager";
import { SkyManager } from "./SkyManager";

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
    this.depth = 8;
    this.chunks = new Array();
    this.heightmaps = new Array()
    this.trees = new Array();
    this.frame = 0;
  }
  init() {
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;

    
    LightsManager(this.scene)
    SkyManager(this.scene , this.loader)
    // this.treesManager.spawnTrees(this.camera)
    // this.addWater();
    // this.setupAmbientLighting()
    this.addChunk({x:0,y:0})
    this.addChunk({x:-8,y:0})
    this.addChunk({x:-8,y:16})
    this.addChunk({x:-8,y:-16})
    this.addChunk({x:8,y:0})
    this.addChunk({x:0,y:-16})

    this.addChunk({x:0,y:16})
    this.addChunk({x:8,y:16})
    this.addChunk({x:8,y:-16})

    this.effectsManager.init();
    this.effectsManager.updateColors({ r: 0.5, g: 0.5, b: 0.5 });

    this.trees.map((tree) => this.scene.add(tree));
  }
  makeInstancedMesh(pos) {
    this.chunks.map((chunk) => {
      chunk.receiveShadow = true;
      chunk.castShadow = true;
      this.scene.add(chunk);
    });
    this.updateInstancedMesh();
  }

  updateInstancedMesh() {
    for (let i = 0; i < this.chunks.length; i++) {
      
      for (let x = 0; x < this.side; x++) {
        for (let y = 0; y < this.side; y++) {
          let yCoord = Math.floor(
            this.simplex.noise(
              (this.chunks[i].position.x*2 + x) / 50,
              (this.chunks[i].position.z + y) / 50
            ) * this.depth
          );

          this.dummy.position.set(
            x + this.chunks[i].position.x,

            yCoord,
            y + this.chunks[i].position.y
          );
          this.dummy.updateMatrix();
          this.chunks[i].setMatrixAt(x * this.side + y, this.dummy.matrix);
        }
        this.chunks[i].needsUpdate = true;
      }
    }
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

createHeightMap(){
console.log()

for (let i = 0; i < this.chunks.length>=1?this.chunks[this.chunks.length-1].count:null;  i++) {
  const matrix = new THREE.Matrix4();
  this.chunks[this.chunks.length-1].getMatrixAt(i, matrix);

  // Loop through all children of the instanced mesh
  this.chunks[this.chunks.length-1].children.forEach(child => {
    // Get the child's transformation matrix
    const childMatrix = new THREE.Matrix4().multiplyMatrices(matrix, child.matrix);
    console.log(childMatrix)
    // Do something with the child's matrix...
  });
}

}

addChunk(pos){
  let mesh = new THREE.InstancedMesh(
    this.mesh.geometry,
    this.mesh.material,
    256
  )
  mesh.position.set(pos.x , 0, pos.y)
  this.chunks.push(mesh)

  this.createHeightMap()
}
  update() {
    this.effectsManager.render();
    this.makeInstancedMesh();
  }
}
