import { Group, SphereGeometry, MeshPhongMaterial, Mesh } from 'three';

class Planet extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        this.name = 'planet';
        const geometry = new SphereGeometry( 10, 35, 20 ); 
        const material = new MeshPhongMaterial( { color: 0xffff00 } ); 
        const sphere = new Mesh( geometry, material ); 
        sphere.position.set( 0, 0, 0 );

        this.add(sphere);

    }
}

export default Planet;
