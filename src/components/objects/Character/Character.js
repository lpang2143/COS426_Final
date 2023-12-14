import { Group, AnimationMixer } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { CharacterControls } from './characterControls.js'
// import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
// import MODEL from './Timmy.fbx'
// import MODEL from './Felix_07.gltf'
import MODEL from './soldier.glb';

class Character extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        // Load object
        var controls;
        const loader = new GLTFLoader();

        this.name = 'soldier';
        loader.load(MODEL, (gltf) => {
            gltf.scene.scale.set(1, 1, 1);
            const model = gltf.scene
            model.traverse(function (object) {
                if (object.isMesh) object.castShadow = true;
            });
            this.add(model);

            const anim = gltf.animations;
            const mixer = new AnimationMixer(model);
            const animationsMap = new Map();
            anim.filter(a => a.name != 'TPose').forEach((a) => {
                animationsMap.set(a.name, mixer.clipAction(a));
            })

            controls = new CharacterControls(model, mixer, animationsMap, 'Idle');
        });

        // this.name = 'Character';
        // const loader = new FBXLoader();
        // // loader.setPath('../../resources/');
        // loader.load(MODEL, (fbx) => {
        //     fbx.scale.setScalar(1);
        //     fbx.traverse(c => {
        //         c.castShadow = true;
        //     });

        //     const anim = new FBXLoader();
        //     anim.setPath('../../resources/animations/');
        //     anim.load('start_walking.fbx', (anim) => {
        //         this._mixer = new THREE.AnimationMixer(fbx);
        //         const idle = this._mixer.clipAction(anim.animations[0]);
        //         idle.play();
        //     })
        // this.add(fbx);
        // })
    }

    get controls(){
        return this.controls;
    }
}

export default Character;