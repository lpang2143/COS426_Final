import { Group, SphereGeometry, MeshStandardMaterial, Mesh } from 'three';

class Planet extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        this.name = 'planet';
        const geometry = new SphereGeometry( 10, 35, 20 ); 
        const material = new MeshStandardMaterial( { color: 0x249c30 } ); 
        const sphere = new Mesh( geometry, material ); 
        sphere.position.set( 0, 0, 0 );

        this.add(sphere);

    }
}

export default Planet;
