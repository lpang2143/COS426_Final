import { Group, SphereGeometry, MeshStandardMaterial, Mesh, Sphere } from 'three';

class Planet extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        this.name = 'planet';
        const geometry = new SphereGeometry( 10, 35, 20 );
        const geometry2 = new SphereGeometry( 2, 6, 6); 
        // console.log(geometry.attributes.normal);s
        const material = new MeshStandardMaterial( { color: 0x249c30 } ); 
        const sphere = new Mesh( geometry, material ); 
        const sphere2 = new Mesh( geometry2, material );
        // sphere.castShadow = true;
        sphere.receiveShadow = true;
        sphere.position.set( 0, 0, 0 );
        sphere2.position.set( -10, 0, 0);
        sphere.attach(sphere2);

        this.add(sphere);

    }
}

export default Planet;
