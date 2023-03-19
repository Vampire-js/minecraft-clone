import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { GlitchPass } from "three/addons/postprocessing/GlitchPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { SAOPass } from "three/examples/jsm/postprocessing/SAOPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";

const saoOptions = {
  output: SAOPass.OUTPUT.Beauty,
  saoBias: 0,
  saoIntensity: 0,
  saoScale: 0,
  saoKernelRadius: 0,
  saoMinResolution: 0,
  saoBlur: false,
  saoBlurRadius: 0,
  saoBlurStdDev: 0,
  saoBlurDepthCutoff: 0,
};

export class EffectsManager {
  constructor(renderer, scene, camera) {
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    this.color = {r:.5 , g:.5 , b:.5}
    this.composer = new EffectComposer(renderer);
  }
  init() {
    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);

    const bloom = new UnrealBloomPass(new THREE.Vector2(0, 0), 0.17);
    this.composer.addPass(bloom);

  this.colorGrade = new ShaderPass(this.colorGradeShader())
    this.colorGrade.renderToScreen = true
    // this.colorGrade.uniforms.color.value.g = this.color.g
    // this.colorGrade.uniforms.color.value.r = this.color.r
    // this.colorGrade.uniforms.color.value.b = this.color.b

    // this.composer.addPass(this.colorGrade)
  
    const SAO = new SAOPass(this.scene,this.camera,saoOptions)
    // this.composer.addPass(SAO)
  }
  updateColors(colors){
    this.colorGrade.uniforms.color.value.g = colors.g
    this.colorGrade.uniforms.color.value.r = colors.r
    this.colorGrade.uniforms.color.value.b = colors.b
    this.color= {r:colors.r , g:colors.g , b:colors.b}
    this.composer.addPass(this.colorGrade)

  }
  colorGradeShader(){
    const colorShader = {
        uniforms: {
          tDiffuse: { value: null },
          color:    { value: new THREE.Color(0x88CCFF) },
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1);
          }
        `,
        fragmentShader: `
          uniform vec3 color;
          uniform sampler2D tDiffuse;
          varying vec2 vUv;
          void main() {
            vec4 previousPassColor = texture2D(tDiffuse, vUv);
            gl_FragColor = vec4(
                previousPassColor.rgb * color,
                previousPassColor.a);
          }
        `,
      }
      return colorShader
  }
  render() {
    this.composer.render();
  }
}
