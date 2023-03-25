import * as THREE from "three";


export function DirtBlock(){
    const textureloader = new THREE.TextureLoader();
    const texture = textureloader.load("/textures/grass/grass-side.jpg");
    const grassTop = textureloader.load("/textures/grass/grass.png");

    const bottomColor = new THREE.Color(0x222222);
    const topColor = new THREE.Color(0xffffff);
    const gradientOffset = 0.00005;
    const gradientSharpness = 0.8;

    const faceMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: texture },
        bottomColor: { value: bottomColor },
        topColor: { value: topColor },
        gradientOffset: { value: gradientOffset },
        gradientSharpness: { value: gradientSharpness },
      },
      vertexShader: `
              varying vec2 vUv;
              void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              }
            `,
      fragmentShader: `
            varying vec2 vUv;
            uniform sampler2D uTexture;
            uniform vec3 bottomColor;
            uniform vec3 topColor;
            uniform float gradientOffset;
            uniform float gradientSharpness;
            
            void main() {
              vec4 texelColor = texture2D(uTexture, vUv);
              
              // Calculate the distance from the bottom edge of the texture
              float distanceFromBottom = vUv.y - gradientOffset;
              float gradient = smoothstep(0.0, gradientSharpness, distanceFromBottom);
              
              // Mix the bottom color and top color based on the gradient
              vec3 color = mix(bottomColor, topColor, gradient);
              gl_FragColor = vec4(color * texelColor.rgb, texelColor.a);
            }
            `,
    });

    const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), [
      faceMaterial,
      faceMaterial,
      new THREE.MeshBasicMaterial({ map: grassTop }),
      faceMaterial,
      faceMaterial,
      faceMaterial,
    ]);
    
    return box
}