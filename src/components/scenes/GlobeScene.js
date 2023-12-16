import { Scene, Color, MathUtils, BufferGeometry, Float32BufferAttribute, PointsMaterial, Points, Vector3 } from 'three';
import { Planet, Clouds } from 'objects';
import { BasicLights } from 'lights';

class GlobeScene extends Scene {

    timestamp;
    
    constructor() {
        super()

        // Init state
        this.state = {
            updateList: [],
        };

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

        const clouds = new Clouds();
        clouds.position.set(15,0,0);
        this.attach(clouds);
        // const soldier = new Character();
        // soldier.position.set( 0, 10, 0 );
        // zombie.scale(0.1, 0.1, 0.1);
        this.add(this.planet, this.lights);
    }
    
    get Planet() {
        return this.planet;
    }

    update(timeStamp) {
        const {  updateList } = this.state;
        // console.log(backgroundTime * timeStamp);
        // SETS BACKGROUND COLOR TO CHANGE WITH TIME

        var day = new Color(0x91BFCF);
        var duskdawn = new Color(0xFF571F);
        var night = new Color(0x0f001e);

        var color = night.lerp(day, Math.abs(Math.sin(timeStamp / 100000)));
        const obj = this.getObjectByName( "clouds" );
        // console.log(Math.abs(Math.sin(timeStamp / 500)));
        // console.log(0.5*Math.sin(timeStamp / 20000) + 1);

        if ((Math.abs(Math.sin(timeStamp / 100000))) < 0.5) {
            obj.visible = false;
        } else {
            obj.visible = true;
        }
        // console.log(obj);

        this.background = color;
        // this.background = new Color(0x000000);

        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update(timeStamp);
        }
    }

    
}

export default GlobeScene;