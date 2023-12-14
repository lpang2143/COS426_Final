// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export const DIRECTIONS = ['w', 'a', 's', 'd']

export class CharacterControls {
    // state vars
    toggleRun = false;
    currentAction;
    constructor(model, mixer, 
        animationsMap, currentAction) {
        this.model = model;
        this.mixer = mixer;
        this.animationsMap = animationsMap;
        this.currentAction = currentAction;
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

        if (this.mixer) {
            this.mixer.update(delta);
        }
    }
}