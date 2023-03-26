import * as THREE from 'three'

export function SkyManager(scene , loader){
    const clouds = loader.load("textures/sky/clouds.png");

    const cloudConfig = {
      geometry: new THREE.PlaneGeometry(100 * 2, 100 * 2),
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
    cloudsPlane.position.set(100/2 , 30, 100/2);
    cloudsPlane.rotation.x = Math.PI * -0.5;
    cloudConfig.material.color.setRGB(1.5, 1.5, 1.5);
    scene.add(cloudsPlane);

    const sun = loader.load("textures/sky/sun.png");
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
}