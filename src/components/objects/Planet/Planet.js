import { Group } from 'three';

class Planet extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        this.name = 'planet';
        const geometry = new THREE.SphereGeometry( 15, 32, 16 ); 
        const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } ); 
        const sphere = new THREE.Mesh( geometry, material ); scene.add( sphere );
        cubeA.position.set( 0, 0, 0 );

        this.add(cubeA);

    }
}

export default Planet;
