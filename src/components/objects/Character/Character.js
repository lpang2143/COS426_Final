import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
// import MODEL from './Timmy.fbx'
// import MODEL from './Felix_07.gltf'
import MODEL from './zombie.gltf';

class Character extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        // Load object
        const loader = new GLTFLoader();

        this.name = 'zombie';
        loader.load(MODEL, (gltf) => {
            gltf.scene.scale.set(0.01, 0.01, 0.01);
            this.add(gltf.scene);
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
}

export default Character;