import { Group, SpotLight, AmbientLight, HemisphereLight, PointLight} from 'three';

class BasicLights extends Group {
    constructor(...args) {
        // Invoke parent Group() constructor with our args
        super(...args);

        const dir = new SpotLight(0xffffff, 6.8, 10, 1.2, 0.5, 0);
        const ambi = new AmbientLight(0x404040, 3.32);
        const sun = new PointLight(0xffff99, 1, 100, 0,5);
        sun.position.set(-15, 100, 100);
        // const hemi = new HemisphereLight(0xffffbb, 0x080820, 0.3);

        dir.position.set(5, 1, 2);
        dir.target.position.set(0, 0, 0);

        this.add(ambi, sun, dir);
    }
}

export default BasicLights;
