import * as THREE from "three"

export function LightsManager(scene){
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(9, 6, -3);
    light.castShadow = true;

    scene.add(light);
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;

    const hemilight = new THREE.HemisphereLight(0xb1e1ff, 0xb97a20, 0.6);
    scene.add(hemilight);
}