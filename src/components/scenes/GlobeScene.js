import { Scene, Color, MathUtils, BufferGeometry, Float32BufferAttribute, PointsMaterial, Points} from 'three';
import { Planet } from 'objects';
import { BasicLights } from 'lights';

class GlobeScene extends Scene {

    timestamp;

    constructor() {
        super()

        this.background = new Color(0x000000);

        var stars = new Array(0);
        for ( var i = 0; i < 20000; i ++ ) {
            let x = MathUtils.randFloatSpread( 1000 );
            let y = MathUtils.randFloatSpread( 1000 );
            let z = MathUtils.randFloatSpread( 1000 );
            if (Math.abs(x) < 30 && x > 0) {
                x += 30;
            } else {
                x -= 30;
            }
            if (Math.abs(y) < 30 && y > 0) {
                y += 30;
            } else {
                y -= 30;
            }
            if (Math.abs(z) < 30 && z > 0) {
                z += 30;
            } else {
                z -= 30;
            }
            stars.push(x, y, z);
        }
        var starsGeometry = new BufferGeometry();
        starsGeometry.setAttribute(
            "position", new Float32BufferAttribute(stars, 3)
        );
        var starsMaterial = new PointsMaterial( { color: 0x888888 } );
        var starField = new Points( starsGeometry, starsMaterial );
        this.add( starField );

        const planet = new Planet();
        const lights = new BasicLights();
        // const soldier = new Character();
        // soldier.position.set( 0, 10, 0 );
        // zombie.scale(0.1, 0.1, 0.1);
        this.add(planet, lights);
    }

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