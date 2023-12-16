import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import MODEL from './daisies.gltf';

class Daisies extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

         // Init state
         this.state = {
            bob: true,
        };

        const loader = new GLTFLoader();

        this.name = 'daisies';

        loader.load(MODEL, (gltf) => {
            this.add(gltf.scene);
        });

    }

    update(timeStamp) {
        if (this.state.bob) {
            // Bob back and forth
            this.rotation.z = 0.05 * Math.sin(timeStamp / 300);
        }
        // Advance tween animations, if any exist
        TWEEN.update();
    }
}

export default Daisies;
