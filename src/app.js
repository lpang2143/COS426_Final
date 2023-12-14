/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import { WebGLRenderer, PerspectiveCamera, Vector3, AnimationMixer, Clock } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { SeedScene, GlobeScene } from 'scenes';
import { CharacterControls } from './components/objects/Character';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import MODEL from './components/objects/Character/soldier.glb'
// import { FBXLoader } from 'three-fbx-loader';

// Initialize core ThreeJS components
const scene = new GlobeScene();
const camera = new PerspectiveCamera();
const renderer = new WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = true;

// Set up camera
camera.position.set(-30, 30, 0);
camera.lookAt(new Vector3(0, 0, 0));

// Set up renderer, canvas, and minor CSS adjustments
renderer.setPixelRatio(window.devicePixelRatio);
const canvas = renderer.domElement;
canvas.style.display = 'block'; // Removes padding below canvas
document.body.style.margin = 0; // Removes margin around page
document.body.style.overflow = 'hidden'; // Fix scrolling
document.body.appendChild(canvas);

// Set up controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 3;
controls.maxDistance = 30;
controls.update();

// create character model
var characterControls;
new GLTFLoader().load(MODEL, (gltf) => {
    gltf.scene.scale.set(1, 1, 1);
    const model = gltf.scene
    model.traverse(function (node) {
        // console.log(node.type);
        if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
        }
    })
    model.scale.set(1, 1, 1);
    model.position.set(0, 10, 0);
    model.lookAt(100, 0, 0);
    scene.add(model);

    const anim = gltf.animations;
    const mixer = new AnimationMixer(model);
    const animationsMap = new Map();
    anim.filter(a => a.name != 'TPose').forEach((a) => {
        animationsMap.set(a.name, mixer.clipAction(a));
    })

    characterControls = new CharacterControls(model, mixer, animationsMap, 'Idle', camera);
});

// keyboard controls
const keysPressed = {    }
document.addEventListener('keydown', (event) => {
    if (event.shiftKey && characterControls) {
        characterControls.switchRunToggle()
    } else {
        (keysPressed)[event.key.toLowerCase()] = true
    }
}, false);
document.addEventListener('keyup', (event) => {
    (keysPressed)[event.key.toLowerCase()] = false;
}, false);

// Render loop
const clock = new Clock();
const onAnimationFrameHandler = (timeStamp) => {
    if (characterControls) {
        characterControls.update(clock.getDelta(), keysPressed);
    }
    controls.update(timeStamp);
    renderer.render(scene, camera);
    scene.update && scene.update(timeStamp);
    window.requestAnimationFrame(onAnimationFrameHandler);
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
