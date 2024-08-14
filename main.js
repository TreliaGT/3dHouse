import './style.css'
import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
scene.background = new THREE.Color(0x1E1E2F);
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('app').appendChild(renderer.domElement);

// Set up camera position
camera.position.set(0, 0, 5);

// Add lights
const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

let loadedObject;
let isshowFloorplan = false;
let isshowHouse = false;
let isRotating = true;
let roof, chimneys, ridge, windowRoof;


// Load the OBJ model
const loader = new OBJLoader();
loader.load(
    '/Bambo_House.obj', // Replace with the path to your OBJ file
    function (object) {
      const pivot = new THREE.Group();
        
      // Calculate the bounding box of the object
      const box = new THREE.Box3().setFromObject(object);
      const center = box.getCenter(new THREE.Vector3());

      // Adjust the position of the object to center it
      object.position.sub(center);

      // Add the object to the pivot group
      pivot.add(object);

      // Position the pivot group (if needed)
      pivot.position.set(0,2, -8);

      // Add the pivot group to the scene
      scene.add(pivot);
      
      // Store the pivot group for rotation
      loadedObject = pivot;
      
      roof = object.getObjectByName('roof_roof_metal_dark');
      chimneys = object.getObjectByName('chimneys_chimneys_plaster_grey');
      ridge = object.getObjectByName('ridge_ridge_metal_dark');
      windowRoof = object.getObjectByName('window_roof_window_roof_glass_window');
    },
    function (xhr) {
        // Called during loading (for progress monitoring)
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
        // Called if there's an error
        console.error('An error occurred:', error);
    }
);


// Handle window resize
window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function toggleRotation() {
  isRotating = !isRotating;
}

// Function to show the floorplan (remove the roof, ridge, chimneys)
function showFloorplan() {
  loadedObject.position.set(0,2, -8);

  if (roof) roof.visible = false;
  if (chimneys) chimneys.visible = false;
  if (ridge) ridge.visible = false;
  if (windowRoof) windowRoof.visible = false;
  isshowFloorplan = true;
  toggleRotation();
}

// Function to show the house (add the roof, ridge, chimneys)
function showHouse() {
  if (roof) roof.visible = true;
  if (chimneys) chimneys.visible = true;
  if (ridge) ridge.visible = true;
  if (windowRoof) windowRoof.visible = true;
  isshowHouse = true;
  toggleRotation();
}


document.getElementById('floorplan').addEventListener('click', showFloorplan);
document.getElementById('house').addEventListener('click', showHouse);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    if(isshowHouse){
      if( loadedObject.rotation.x <= 0){
        isshowHouse = false;
      }else{
        loadedObject.rotation.x -= 0.005;
      }
    }

    if(isshowFloorplan){
      if( loadedObject.rotation.x >= 1.8 && loadedObject.rotation.y <= 0.5){
        isshowFloorplan = false;
      }else{
        loadedObject.rotation.x += 0.005;
        loadedObject.rotation.y -= 0.005
        console.log( loadedObject.rotation.x);
      }
    }

    if (loadedObject && isRotating) {
      loadedObject.rotation.y += 0.005;
    }

    renderer.render(scene, camera);
}

animate();
