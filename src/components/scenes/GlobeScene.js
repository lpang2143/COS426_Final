import { Scene, Color, MathUtils, BufferGeometry, Float32BufferAttribute, PointsMaterial, Points, Vector3 } from 'three';
import { Planet } from 'objects';
import { BasicLights } from 'lights';

class GlobeScene extends Scene {

    timestamp;
    
    constructor() {
        super()

        this.background = new Color(0x111122);
        this.up = new Vector3(0, 1, 0);
        this.rot = new Vector3();
        var origin = new Vector3(0, 0, 0);
        var stars = new Array(0);
        for ( var i = 0; i < 20000; i ++ ) {
            let x = MathUtils.randFloatSpread( 1000 );
            let y = MathUtils.randFloatSpread( 1000 );
            let z = MathUtils.randFloatSpread( 1000 );
            let pos = new Vector3(x, y, z);
            // console.log(pos);
            // console.log(pos.distanceTo(origin));
            if (pos.distanceTo(origin) > 40) {
                stars.push(pos.x, pos.y, pos.z);
            }
        }
        var starsGeometry = new BufferGeometry();
        starsGeometry.setAttribute(
            "position", new Float32BufferAttribute(stars, 3)
        );
        var starsMaterial = new PointsMaterial( { color: 0x888888 } );
        var starField = new Points( starsGeometry, starsMaterial );
        this.add( starField );

        this.planet = new Planet();
        this.lights = new BasicLights();
        // const soldier = new Character();
        // soldier.position.set( 0, 10, 0 );
        // zombie.scale(0.1, 0.1, 0.1);
        this.add(this.planet, this.lights);
    }
    
    get Planet() {
        return this.planet;
    }

    // update(velocity, dir) {
    //     // console.log(velocity);
    //     // console.log(dir);
    //     if (!(velocity && dir)) return;
    //     console.log(dir);
    //     // this.rot = dir.copy().cross(this.up);

        
    // }

    // update(newstamp) {
    //     if (this.timestamp && newstamp) {
    //     this.controls.update(this.timestamp-newstamp, keysPressed);
    //     }
    //     this.timestamp = newstamp
    // }

    // get soldier() {
    //     return this.soldier;
    // }
}

export default GlobeScene;