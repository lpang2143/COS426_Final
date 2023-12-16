import { Color, Group, SphereGeometry, Float32BufferAttribute, Vector3, Mesh, Sphere, PlaneGeometry, DodecahedronGeometry, ImageLoader, TextureLoader, MeshBasicMaterial, MeshStandardMaterial, Matrix3, Matrix4, MeshNormalMaterial } from 'three';
import { Tree, Daisies } from 'objects';

class Planet extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        this.name = 'planet';
        const RADIUS = 10; 

        const geometry = new DodecahedronGeometry( RADIUS, 60 );
        // const geometry = new SphereGeometry(RADIUS);
        // const geometry = new PlaneGeometry(10,10);

        // // const material = new MeshStandardMaterial({ vertexColors: true, flatShading: true, });
        // const material = new MeshStandardMaterial( { map: texture, flatShading: true, } );  
        const material = new MeshNormalMaterial( {flatShading: true, });

        // // const texture = new TextureLoader().load('https://i.imgur.com/nsJSVXe.png');
        // // material.map = texture;

        // heightmap
        const displacementMap = new TextureLoader().load('https://i.imgur.com/Gxst91o.jpg');
        // const displacementMap = new TextureLoader().load('https://i.imgur.com/C7dA9la.png');

        // https://i.imgur.com/C7dA9la.png - perlin noise
        material.displacementMap = displacementMap;
        material.displacementScale = 3;
        // material.displacementBias = -10;
        
        // const positionAttribute = geometry.getAttribute( 'position' );
        
        // const colors = [];
        // const color = new Color();
        // // console.log(positionAttribute.array[0]);

        // // const data = generateTexture(positionAttribute.count);

        // // for ( let i = 0; i < positionAttribute.count; i += 1 ) {
        // //     // READ COLOR 
        // //     const vec = new Vector3(positionAttribute.getX(i), positionAttribute.getY(i), positionAttribute.getZ(i)); 
        // //         vec.add(vec.clone().normalize().multiplyScalar(2));

        // //         positionAttribute.setX(i, vec.x);
        // //         positionAttribute.setY(i, vec.y);
        // //         positionAttribute.setZ(i, vec.z);
        // // }
        
        // // for ( let i = 0; i < positionAttribute.count; i += 3 ) {
        // //         // ALTERNATIVELY read colors directly from map 

        // //         // check (vertex distance from center - radius)
        // //         // .getX(index)

        // //         let x1 = positionAttribute.getX(i);
        // //         let y1 = positionAttribute.getY(i); 
        // //         let z1 = positionAttribute.getZ(i);

        // //         let x2 = positionAttribute.getX(i+1);
        // //         let y2 = positionAttribute.getY(i+1);
        // //         let z2 = positionAttribute.getZ(i+1);

        // //         let x3 = positionAttribute.getX(i+2);
        // //         let y3 = positionAttribute.getY(i+2);
        // //         let z3 = positionAttribute.getZ(i+2);

        // //         let dist1 = Math.sqrt(x1*x1 + y1*y1 + z1*z1) - RADIUS;
        // //         let dist2 = Math.sqrt(x2*x2 + y2*y2 + z2*z2) - RADIUS;
        // //         let dist3 = Math.sqrt(x3*x3 + y3*y3 + z3*z3) - RADIUS;
        // //         let dist = Math.max(dist1,Math.max(dist2,dist3)); 

        // //         // dist *= 100000000;

        // //         if(dist <=15) color.set( 0x228800 );
        // //         if(dist <=12) color.set(0x013220);
        // //         if(dist <= 5) color.set(0x90EE90);
        // //         if(dist <=0)   color.set( 0x44ccff );
                
                
        // //         // define the same color for each vertex of a triangle
                
        // //         colors.push( color.r, color.g, color.b );
        // //         colors.push( color.r, color.g, color.b );
        // //         colors.push( color.r, color.g, color.b );
            
        // // }
        
        // // // define the new attribute
        // // geometry.setAttribute( 'color', new Float32BufferAttribute( colors, 3 ) );

        const sphere = new Mesh( geometry, material ); 
        // // const sphere2 = new Mesh( geometry2, material );
        // // sphere.castShadow = true;

        const tree = new Tree();
        const tree1 = new Tree();
        const tree2 = new Tree();
        tree.position.set(0, 10, 0);
        sphere.attach(tree);

        tree1.position.set(-RADIUS, 0, 0);
        tree1.rotateZ(Math.PI / 2);
        sphere.attach(tree1);
        tree1.scale.set(0.5, 0.5, 0.5);

        const rootrad = Math.sqrt(RADIUS);

        tree2.position.set(rootrad + 3, rootrad + 2, 0);
        tree2.scale.set(0.5, 0.5, 0.5);
        rotateToSphere(tree2);
        sphere.attach(tree2);

        const daisies = new Daisies(this);
        daisies.position.set(0,9.5,-2);
        sphere.attach(daisies);


        sphere.receiveShadow = true;
        sphere.position.set( 0, 0, 0 );

        this.add(sphere);

    }
}

export default Planet;


function rotateToSphere(obj) {
    const vec = obj.position.clone().normalize();
    const up = new Vector3(0, 0, 1);
    
    const s = vec.length();
    const c = vec.clone().dot(up);
    vec.cross(up);

    let m = new Matrix3();
    m.set( 1, 0, 0,
           0, 1, 0,
           0, 0, 1 );
    
    let vx = new Matrix3();
    vx.set(0, -vec.z,  vec.y, 
        vec.z, 0, -vec.x,
        -vec.y, vec.x, 0 );

    let R = new Matrix3().multiplyMatrices(vx, vx);
    R.multiplyScalar(1 / (1 + c));

    let rotate = new Matrix3();
    rotate.set(R.elements[0] + m.elements[0] + vx.elements[0],
        R.elements[1] + m.elements[1] + vx.elements[1],
        R.elements[2] + m.elements[2] + vx.elements[2],
        R.elements[3] + m.elements[3] + vx.elements[3],
        R.elements[4] + m.elements[4] + vx.elements[4],
        R.elements[5] + m.elements[5] + vx.elements[5],
        R.elements[6] + m.elements[6] + vx.elements[6],
        R.elements[7] + m.elements[7] + vx.elements[7],
        R.elements[8] + m.elements[8] + vx.elements[8]);
    
    let rotation4 = new Matrix4().setFromMatrix3(rotate);
    
    obj.applyMatrix4(rotation4);

    

}