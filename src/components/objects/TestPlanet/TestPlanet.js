import { Group, SphereGeometry, MeshStandardMaterial, Mesh, TextureLoader } from 'three';
import IMAGE from './assets/uvmap.png';

class TestPlanet extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        this.name = 'planet';
        const geometry = new SphereGeometry( 10, 35, 20 ); 
        const texture = new TextureLoader().load(IMAGE);
        const material = new MeshStandardMaterial( { color: 0x249c30, map: texture } ); 
        const sphere = new Mesh( geometry, material ); 
        // sphere.castShadow = true;
        sphere.receiveShadow = true;
        sphere.position.set( 0, 0, 0 );

        this.add(sphere);

    }

}

export default TestPlanet;