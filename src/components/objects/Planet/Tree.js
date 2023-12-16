import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './tree1.gltf';

class Tree extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        const loader = new GLTFLoader();

        this.name = 'tree';

        loader.load(MODEL, (gltf) => {
            gltf.scene.scale.set(0.5,0.5,0.5),
            this.add(gltf.scene);
        });
    }
}

export default Tree;
