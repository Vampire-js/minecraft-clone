import * as THREE from 'three'
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";

export class FPSCamera {
  constructor(camera) {
    this.camera = camera;
    this.controls = new PointerLockControls(camera, document.body);
    this.speed = 0.05
}
  init(scene) {
    scene.add(this.controls.getObject());
    this.togglePointerLock();
    this.togglePlayerMovement()
  }
  togglePointerLock() {
    if (document.pointerLockElement === document.body) {
      document.addEventListener("mousemove", (e) => this.onMouseMove(e));
    } else {
      document.removeEventListener("mousemove", (e) => this.onMouseMove(e));
    }

    document.body.addEventListener("click", () => {
      document.body.requestPointerLock();
    });
  }
  togglePlayerMovement() {
    document.onkeydown = (e) => {
        switch (e.key) {
            case "w":
                this.camera.position.add(this.camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(this.speed));
            break;
        }
    }
  }
  onMouseMove(e) {
    const movementX = e.movementX;
    const movementY = e.movementY;
    this.controls.rotateX(-movementY * 0.002);
    this.controls.rotateY(-movementX * 0.002);
  }
}

/*
let delta = clock.getDelta()
  document.addEventListener('keydown', (event) => {
    switch (event.code) {
      case 'KeyW': // Move forward
        camera.position.add(camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(speed*clock.getDelta()));
        break;
      case 'KeyS': // Move backward
        camera.position.add(camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(-speed*clock.getDelta()));
        break;
      case 'KeyA': // Move left
        camera.position.add(camera.getWorldDirection(new THREE.Vector3(-1, 0, 0)).multiplyScalar(speed));
        break;
      case 'KeyD': // Move right
        camera.position.add(camera.getWorldDirection(new THREE.Vector3(1, 0, 0)).multiplyScalar(speed));
        break;
    }
  });
*/
