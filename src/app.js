/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import { WebGLRenderer, PerspectiveCamera, Vector3, AnimationMixer, Clock, Quaternion, LoadingManager } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GlobeScene } from 'scenes';
// import { CharacterControls } from './components/objects/Character';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// import { ThirdCamera } from './components/cameras';
import MODEL from './components/objects/Character/soldier.glb';
// import { FBXLoader } from 'three-fbx-loader';

class CharControlProxy {
    constructor(anims) {
        this._anims = anims;
    }

    get anims() {
        return this._anims
    }
};

class CharControl {
    constructor(params) {
        this.params = params;
        this.decceleration = new Vector3(-0.01, 0, -7);
        // this.decceleration = new Vector3(0, 0, 0);
        this.acceleration = new Vector3(0.5, 0.2, 15);
        // this.acceleration = new Vector3(0, 0, 0);
        this.velocity = new Vector3(0, 0, 0);
        this.position = new Vector3(0, 10, 0);

        this.animations = {};
        this.input = new CharControlInput();
        this.fsm = new CharFSM(
            new CharControlProxy(this.animations));
        
        this.loadModels();
    }

    loadModels() {
        const loader = new GLTFLoader();
        loader.load(MODEL, (gltf) => {
            gltf.scene.scale.set(1, 1, 1);
            gltf.scene.position.set(0, 10, 0);
            gltf.scene.traverse(c => {
              c.castShadow = true;
            });
      
            this.target = gltf.scene;
            this.params.scene.add(this.target);
        
            this.anim = gltf.animations;
            this.mixer = new AnimationMixer(gltf.scene);
            // this.animations = new Map();
            this.anim.filter(a => a.name != 'TPose').forEach((a) => {
                this.animations[a.name] = this.mixer.clipAction(a);
            });
            console.log(this.animations);
            this.fsm.SetState('Idle');
        });
    }

    get Position() {
        return this.position;
    }

    get Rotation() {
        if (!this.target) {
            return new Quaternion();
        }
        return this.target.quaternion;
    }

    update(time) {
        if (!this.fsm.current) {
            return;
        }

        this.fsm.Update(time, this.input);

        const velocity = this.velocity;
        const frameDecceleration = new Vector3(
            velocity.x * this.decceleration.x,
            velocity.y * this.decceleration.y,
            velocity.z * this.decceleration.z
        );
        frameDecceleration.multiplyScalar(time);
        frameDecceleration.z = Math.sign(frameDecceleration.z) * Math.min(
            Math.abs(frameDecceleration.z), Math.abs(velocity.z));

        velocity.add(frameDecceleration);

        const controlObject = this.target;
        const _Q = new Quaternion();
        const _A = new Vector3();
        const _R = controlObject.quaternion.clone();

        const acc = this.acceleration.clone();
        if (this.input.keys.shift) {
            acc.multiplyScalar(2.0);
        }

        if (this.fsm.current.Name == 'dance') {
            acc.multiplyScalar(0.0);
        }

        if (this.input.keys.forward) {
            //swapped sign because the model is weird
        velocity.z -= acc.z * time;
        }
        if (this.input.keys.backward) {
            //here as well
        velocity.z += acc.z * time;
        }
        if (this.input.keys.left) {
        _A.set(0, 1, 0);
        _Q.setFromAxisAngle(_A, 4.0 * Math.PI * time * this.acceleration.y);
        _R.multiply(_Q);
        }
        if (this.input.keys.right) {
        _A.set(0, 1, 0);
        _Q.setFromAxisAngle(_A, 4.0 * -Math.PI * time * this.acceleration.y);
        _R.multiply(_Q);
        }

        controlObject.quaternion.copy(_R);

        const oldPosition = new Vector3();
        oldPosition.copy(controlObject.position);

        const forward = new Vector3(0, 0, 1);
        forward.applyQuaternion(controlObject.quaternion);
        forward.normalize();

        const sideways = new Vector3(1, 0, 0);
        sideways.applyQuaternion(controlObject.quaternion);
        sideways.normalize();

        sideways.multiplyScalar(velocity.x * time);
        forward.multiplyScalar(velocity.z * time);

        controlObject.position.add(forward);
        controlObject.position.add(sideways);

        this.position.copy(controlObject.position);

        if (this.mixer) {
        this.mixer.update(time);
        }
    }
};

class CharControlInput {
    constructor() {
        this.keys = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            space: false,
            shift: false,
        };
        document.addEventListener('keydown', (e) => this.onKeyDown(e), false);
        document.addEventListener('keyup', (e) => this.onKeyUp(e), false);
    }

    onKeyDown(event) {
        switch (event.keyCode) {
            case 87: // w
                this.keys.forward = true;
                break;
            case 65: // a
                this.keys.left = true;
                break;
            case 83: // s
                this.keys.backward = true;
                break;
            case 68: // d
                this.keys.right = true;
                break;
            case 32: // SPACE
                this.keys.space = true;
                break;
            case 16: // SHIFT
                this.keys.shift = true;
                break;
        }
    }

    onKeyUp(event) {
        switch(event.keyCode) {
            case 87: // w
                this.keys.forward = false;
                break;
            case 65: // a
                this.keys.left = false;
                break;
            case 83: // s
                this.keys.backward = false;
                break;
            case 68: // d
                this.keys.right = false;
                break;
            case 32: // SPACE
                this.keys.space = false;
                break;
            case 16: // SHIFT
                this.keys.shift = false;
                break;
        }
    }
};

class FSM {
    constructor() {
        this.states = {};
        this.current = null;
    }

    AddState(name, type) {
        this.states[name] = type;
    }

    SetState(name) {
        const prevState = this.current;

        if (prevState) {
            if(prevState.Name == name) {
                return;
            }
            prevState.Exit();
        }

        const state = new this.states[name](this);

        this.current = state;
        state.Enter(prevState);
    }

    Update(time, input) {
        if(this.current) {
            this.current.Update(time, input);
        }
    }
}

class CharFSM extends FSM {
    constructor(proxy) {
      super();
      this.proxy = proxy;
      this._Init();
    }
  
    _Init() {
      this.AddState('Idle', IdleState);
      this.AddState('Walk', WalkState);
      this.AddState('Run', RunState);
    //   this.AddState('dance', DanceState);
    }
  };

class State {
    constructor(parent) {
      this._parent = parent;
    }
  
    Enter() {}
    Exit() {}
    Update() {}
};

class WalkState extends State {
    constructor(parent) {
      super(parent);
    }
  
    get Name() {
      return 'Walk';
    }
  
    Enter(prevState) {
        const curAction = this._parent.proxy.anims['Walk'];
        if (prevState) {
            const prevAction = this._parent.proxy.anims[prevState.Name];
    
            curAction.enabled = true;
    
            if (prevState.Name == 'Run') {
                const ratio = curAction.getClip().duration / prevAction.getClip().duration;
                curAction.time = prevAction.time * ratio;
            } else {
                curAction.time = 0.0;
                curAction.setEffectiveTimeScale(1.0);
                curAction.setEffectiveWeight(1.0);
            }
    
            curAction.crossFadeFrom(prevAction, 0.5, true);
            curAction.play();
        } else {
            curAction.play();
        }
    } Exit() {
    }
  
    Update(timeElapsed, input) {
        if (input.keys.forward || input.keys.backward) {
            if (input.keys.shift) {
                this._parent.SetState('Run');
            }
            return;
        }
  
        this._parent.SetState('Idle');
    }
};


class RunState extends State {
constructor(parent) {
    super(parent);
}

get Name() {
    return 'Run';
}

Enter(prevState) {
    const curAction = this._parent.proxy.anims['Run'];
    if (prevState) {
        const prevAction = this._parent.proxy.anims[prevState.Name];

        curAction.enabled = true;

        if (prevState.Name == 'Walk') {
            const ratio = curAction.getClip().duration / prevAction.getClip().duration;
            curAction.time = prevAction.time * ratio;
        } else {
            curAction.time = 0.0;
            curAction.setEffectiveTimeScale(1.0);
            curAction.setEffectiveWeight(1.0);
        }

        curAction.crossFadeFrom(prevAction, 0.5, true);
        curAction.play();
        } else {
            curAction.play();
        }
    } Exit() {
    }

    Update(timeElapsed, input) {
        if (input.keys.forward || input.keys.backward) {
            if (!input.keys.shift) {
                this._parent.SetState('Walk');
            }
        return;
        }

        this._parent.SetState('Idle');
    }
};

class IdleState extends State {
    constructor(parent) {
        super(parent);
    }
  
    get Name() {
        return 'Idle';
    }
  
    Enter(prevState) {
        console.log(this._parent.proxy.anims);
        const idleAction = this._parent.proxy.anims['Idle'];
        if (prevState) {
            const prevAction = this._parent.proxy.anims[prevState.Name];
            idleAction.time = 0.0;
            idleAction.enabled = true;
            idleAction.setEffectiveTimeScale(1.0);
            idleAction.setEffectiveWeight(1.0);
            idleAction.crossFadeFrom(prevAction, 0.5, true);
            idleAction.play();
        } else {
            idleAction.play();
        }
    } Exit() {
    }
  
    Update(_, input) {
        if (input.keys.forward || input.keys.backward) {
            this._parent.SetState('Walk');
        } else if (input.keys.space) {
            this._parent.SetState('dance');
        }
    }
};

class ThirdCamera {
    constructor(params) {
        this.params = params;
        this.camera = params.camera;

        this.currentPos = new Vector3();
        this.currentLook = new Vector3();
    }

    CalcIdealOff(rotation) {
        // console.log(rotation);
        const idealOff = new Vector3(2, 1.5, 4);
        // console.log(this.params.target.Rotation);
        const quat = this.params.target.Rotation;
        // console.log(quat);
        quat.w = -quat.w;
        idealOff.applyQuaternion(this.params.target.Rotation.invert());
        // console.log(idealOff);
        idealOff.add(this.params.target.Position);
        return idealOff;
    }

    CalcIdealLook(rotation) {
        const idealLook = new Vector3(0, -3, -20);
        // console.log(this.position);
        // console.log(rotation);
        const quat = this.params.target.Rotation;
        quat.w = -quat.w;
        idealLook.applyQuaternion(this.params.target.Rotation.invert());
        idealLook.add(this.params.target.Position);
        return idealLook;
    }

    update(delta, rotation) {
        const idealOff = this.CalcIdealOff(rotation);
        const idealLook = this.CalcIdealLook(rotation);
        // console.log("off", idealOff);
        // console.log("look", idealLook);
        const delay = 1 - Math.pow(0.001, delta);


        this.currentPos.lerp(idealOff, delay);
        this.currentLook.lerp(idealLook, delay);

        this.camera.position.copy(this.currentPos);
        console.log(this.currentPos);
        this.camera.lookAt(this.currentLook);
    }
}

// Initialize core ThreeJS components
const scene = new GlobeScene();
const camera = new PerspectiveCamera();
const renderer = new WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = true;

// Set up camera
// camera.position.set(2, 12, 4);
// camera.lookAt(new Vector3(0, 0, -20));

// Set up renderer, canvas, and minor CSS adjustments
renderer.setPixelRatio(window.devicePixelRatio);
const canvas = renderer.domElement;
canvas.style.display = 'block'; // Removes padding below canvas
document.body.style.margin = 0; // Removes margin around page
document.body.style.overflow = 'hidden'; // Fix scrolling
document.body.appendChild(canvas);

// Set up controls
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;
// controls.enablePan = false;
// controls.minDistance = 1;
// controls.maxDistance = 100;
// controls.update();

const mixers = [];

const params = {
    camera: camera,
    scene: scene,
}

const charControl = new CharControl(params);

const thirdCamera = new ThirdCamera({
        camera: camera,
        target: charControl,
    });

// new GLTFLoader().load(MODEL, (gltf) => {
//     gltf.scene.scale.set(1, 1, 1);
//     model = gltf.scene;
//     model.traverse(function (node) {
//         // console.log(node.type);
//         if (node.isMesh) {
//             node.castShadow = true;
//             node.receiveShadow = true;
//         }
//     })
//     model.scale.set(1, 1, 1);
//     model.position.set(0, 10, 0);
//     model.lookAt(100, 0, 0);
//     scene.add(model);

//     const anim = gltf.animations;
//     const mixer = new AnimationMixer(model);
//     const animationsMap = new Map();
//     anim.filter(a => a.name != 'TPose').forEach((a) => {
//         animationsMap.set(a.name, mixer.clipAction(a));
//     })

//     characterControls = new CharacterControls(model, mixer, animationsMap, 'Idle', camera);
//     thirdCamera = new ThirdCamera({
//         camera: camera, 
//         position: model.position,
//     });
// });

// // keyboard controls
// const keysPressed = {    }
// document.addEventListener('keydown', (event) => {
//     if (event.shiftKey && characterControls) {
//         characterControls.switchRunToggle()
//     } else {
//         (keysPressed)[event.key.toLowerCase()] = true
//     }
// }, false);
// document.addEventListener('keyup', (event) => {
//     (keysPressed)[event.key.toLowerCase()] = false;
// }, false);

// Render loop
const clock = new Clock();
const onAnimationFrameHandler = (timeStamp) => {
    // if (characterControls) {
    //     var delta = clock.getDelta();
    //     thirdCamera.update(delta, characterControls.update(delta, keysPressed));
    //     // thirdCamera.update(delta, model.rotation);
    // }
    // controls.update(timeStamp);
    renderer.render(scene, camera);
    scene.update && scene.update(timeStamp);
    window.requestAnimationFrame(onAnimationFrameHandler);
    var timeElapsedS = clock.getDelta();
    if (mixers) {
        mixers.map(m => m.update(timeElapsedS));
    }

    if (charControl) {
        charControl.update(timeElapsedS);
    }

    thirdCamera.update(timeElapsedS);

};
window.requestAnimationFrame(onAnimationFrameHandler);

// Resize Handler
const windowResizeHandler = () => {
    const { innerHeight, innerWidth } = window;
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
};
windowResizeHandler();
window.addEventListener('resize', windowResizeHandler, false);
