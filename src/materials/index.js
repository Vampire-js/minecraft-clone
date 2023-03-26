import * as THREE from 'three'

const loader = new THREE.TextureLoader();



export const materials = {
    grass:[
        new THREE.MeshPhysicalMaterial({
          map: loader.load("textures/grass/grass-side.jpg"),
        }), //right side
        new THREE.MeshPhysicalMaterial({
          map: loader.load("textures/grass/grass-side.jpg"),
        }), //top side
        new THREE.MeshPhysicalMaterial({ map: loader.load("textures/grass/grass.png") }), //bottom side
        new THREE.MeshPhysicalMaterial({
          map: loader.load("textures/grass/grass-side.jpg"),
        }), //front side
        new THREE.MeshPhysicalMaterial({
          map: loader.load("textures/grass/grass-side.jpg"),
        }), //back side
        new THREE.MeshPhysicalMaterial({
          map: loader.load("textures/grass/grass-side.jpg"),
        }), //left side
      ],
      debug: new THREE.MeshPhysicalMaterial({color:0xffffff})
}