import *  as THREE from 'three'
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { GlitchPass } from 'three/addons/postprocessing/GlitchPass.js';
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import {SAOPass} from 'three/examples/jsm/postprocessing/SAOPass'
import {HalftonePass} from 'three/examples/jsm/postprocessing/HalftonePass'



export class EffectsManager{
    constructor(renderer , scene, camera){
        this.renderer = renderer
        this.scene = scene
        this.camera = camera
        this.composer = new EffectComposer(renderer)
    }
    init(){
        const renderPass = new RenderPass( this.scene, this.camera );
this.composer.addPass( renderPass );

const glitchPass = new UnrealBloomPass(new THREE.Vector2(0,0), 0.17);
this.composer.addPass( glitchPass );

const saoOptions = {
    output: SAOPass.OUTPUT.SAO,
    saoBias: 0.001,
    saoIntensity: 0.001,
    saoScale: 0.001,
    saoKernelRadius: 0.001,
    saoMinResolution: 0,
    saoBlur: false,
    saoBlurRadius: 1,
    saoBlurStdDev: 1,
    saoBlurDepthCutoff: 0.001
};

const halftone = new HalftonePass()
// this.composer.addPass(halftone)
    }
    render(){
        this.composer.render()
    }
}