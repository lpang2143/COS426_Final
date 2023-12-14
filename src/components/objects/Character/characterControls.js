// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export const DIRECTIONS = ['w', 'a', 's', 'd']

export class CharacterControls {
    // state vars
    toggleRun = false;
    currentAction;

    // constant
    fadeDuration = 0.1

    constructor(model, mixer, 
        animationsMap, currentAction, camera) {
        this.model = model;
        this.mixer = mixer;
        this.animationsMap = animationsMap;
        this.currentAction = currentAction;
        this.camera = camera
        console.log('action', currentAction);
        console.log('model', model);
        if (animationsMap) {
            this.animationsMap.forEach((value, key) => {
                // console.log(animationsMap)
                if (key == currentAction) {
                    value.play();
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
            toPlay.reset().fadeIn(this.fadeDuration).play();

            this.currentAction = play
        }

        this.mixer.update(delta)

        if (this.currentAction == 'Run' || this.currentAction == 'Walk') {
            angleYCameraDirection = Math.atan2(
                (this.camera.position.x - this.model.position.x),
                (this.camera.position.z - this.model.position.z))
            // var directionOffset = this.directionOffset(keysPressed);
        }

        if (this.mixer) {
            this.mixer.update(delta);
        }
    }
}