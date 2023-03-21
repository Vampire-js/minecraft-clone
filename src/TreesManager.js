import * as THREE from "three";
import { materials } from "./materials";
import { SimplexNoise } from "three/examples/jsm/math/SimplexNoise";

export class TreesManager {
  constructor(scene, terrain) {
    this.scene = scene;
    this.tree = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), materials.debug);
    this.instancedMesh = new THREE.InstancedMesh(
      this.tree.geometry,
      this.tree.material,
      100
    );
    this.simplex = new SimplexNoise();
    this.raycaster = new THREE.Raycaster()
    this.terrain = terrain;
    this.dummy = new THREE.Object3D();
    this.side = 10;
  }
  spawnTrees(camera) {
    console.log(this.raycaster)
    this.scene.add(this.instancedMesh);
    this.updateInstancedMesh();
  }
  updateInstancedMesh() {
    for (let i = 0; i < this.instancedMesh.count; i++) {


        const indices = this.randomIntArray(0 , 25600 ,100)
        for(let index = 0; index< indices.length; index++){
          let coords = {x:Math.floor(Math.random()*160) , y:Math.floor(Math.random()*160)}
            this.dummy.position.set(coords.x ,20 ,coords.y)
            this.raycaster.ray.origin.set(coords.x , 20 , coords.y)
          this.intersections = this.raycaster.intersectObjects(this.tree)
          console.log(this.intersections)
          }
        this.dummy.updateMatrix()
        this.instancedMesh.setMatrixAt(i , this.dummy.matrix)
    }
    this.instancedMesh.needsUpdate = true
  }
  randomIntArray = (min, max, n = 1) =>
    Array.from(
      { length: n },
      () => Math.floor(Math.random() * (max - min + 1)) + min
    );
}
