// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Vector3, Quaternion } from 'three';

export const DIRECTIONS = ['w', 'a', 's', 'd']

export class CharacterControls {
    // state vars
    toggleRun = false;
    currentAction;

    // constant
    fadeDuration = 0.1 //smaller is smoother

    //temps
    walkDirection = new Vector3();
    rotateAngle = new Vector3(0, 1, 0);
    rotateQuarternion = new Quaternion();
    movequat = new Quaternion();

    constructor(model, mixer, 
        animationsMap, currentAction, camera) {
        this.model = model;
        this.mixer = mixer;
        this.animationsMap = animationsMap;
        this.currentAction = currentAction;
        this.camera = camera
        // var out = new Vector3();
        // if (this.model) {
        //     this.model.getWorldDirection(out)
        //     console.log(out);
        // }
        // console.log('action', currentAction);
        // console.log('model', model);
        if (animationsMap) {
            this.animationsMap.forEach((value, key) => {
                // console.log(animationsMap)
                if (key == currentAction) {
                    value.setEffectiveTimeScale(0.6).play();
                }
            })
        }
    }

    switchRunToggle() {
        this.toggleRun = !this.toggleRun;
    }

    update (delta, keysPressed) {
        const directionPressed = DIRECTIONS.some(key => keysPressed[key] == true)

        var play = '';
        if (directionPressed && this.toggleRun) {
            play = 'Run'
        } else if (directionPressed) {
            play = 'Walk'
        } else {
            play = 'Idle'
        }

        if (this.currentAction != play) {
            const toPlay = this.animationsMap.get(play)
            const current = this.animationsMap.get(this.currentAction)

            current.fadeOut(this.fadeDuration)
            toPlay.reset().fadeIn(this.fadeDuration).setEffectiveTimeScale(0.6).play();

            this.currentAction = play
        }

        this.mixer.update(delta)

        // if (this.currentAction == 'Run' || this.currentAction == 'Walk') {
        //     let angleYCameraDirection = Math.atan2(
        //         (this.camera.position.x - this.model.position.x),
        //         (this.camera.position.z - this.model.position.z))
        //     let directionOffset = this.directionOffset(keysPressed);

        //     this.rotateQuarternion.setFromAxisAngle(this.rotateAngle, angleYCameraDirection + directionOffset);
        //     // console.log('angle', angleYCameraDirection);
        //     // console.log('offset', directionOffset);
        //     this.model.quaternion.rotateTowards(this.rotateQuarternion, 0.1);
            
        // }
        return this.model.quaternion;
    }

    directionOffset(keysPressed) {
        let directionOffset = 0

        if (keysPressed['w']) {
            if (keysPressed['a']) directionOffset = Math.PI / 4;
            else if (keysPressed['d']) directionOffset = -Math.PI / 4
        } else if (keysPressed['s']) {
            if (keysPressed['d']) directionOffset = Math.PI * -3/4;
            else if (keysPressed['a']) directionOffset = Math.PI * 3/4;
            else directionOffset = Math.PI;
        } else if (keysPressed['d']) {
            directionOffset = -Math.PI / 2
        } else if (keysPressed['a']) {
            directionOffset = Math.PI / 2;
        }

        return directionOffset;
    }
}