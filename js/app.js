import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as Metis from 'metis';
import { CONFIG } from './config.js';
import { UI } from './ui.js';

class App {
  constructor() {
    this.initScene();
    this.initUI();
    this.initContent();
    this.animate();
  }

  initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(CONFIG.rendering.backgroundColor);

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 5, 15);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;

    this.ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
    this.scene.add(this.ambientLight);

    this.directionalLight = new THREE.DirectionalLight(CONFIG.rendering.lightColor, CONFIG.rendering.lightIntensity);
    this.directionalLight.position.set(10, 10, 10);
    this.scene.add(this.directionalLight);

    window.addEventListener('resize', this.onWindowResize.bind(this), false);
  }

  initUI() {
    this.ui = new UI(CONFIG, this.onConfigChange.bind(this));
  }

  initContent() {
    // Placeholder for Cloth Demo using Metis
    // Since we don't have the actual physics engine code, we will visualize the grid
    // and maybe perform a dummy partition to demonstrate Metis is working.

    const geometry = new THREE.PlaneGeometry(
      CONFIG.cloth.width,
      CONFIG.cloth.height,
      CONFIG.cloth.segmentsX,
      CONFIG.cloth.segmentsY
    );

    const material = new THREE.MeshPhongMaterial({
      color: CONFIG.cloth.color,
      wireframe: CONFIG.cloth.wireframe,
      side: THREE.DoubleSide
    });

    this.clothMesh = new THREE.Mesh(geometry, material);
    this.clothMesh.rotation.x = -Math.PI / 2;
    this.scene.add(this.clothMesh);

    // Demonstrate Metis usage (async)
    this.runMetisPartition();
  }

  async runMetisPartition() {
    try {
        console.log("Waiting for Metis to initialize...");
        // Check if Metis is ready (it might be a promise or an object)
        // Based on metis.js content, it returns a Module object which might need initialization

        // The metis.js file ends with `run();`. It sets `Module`.
        // If loaded via import *, it might behave differently depending on how it was built.
        // Assuming standard Emscripten behavior where the module is the default export or part of it.

        if (Metis.default) {
           // If it exports a factory function
           const moduleInstance = await Metis.default();
           console.log("Metis initialized:", moduleInstance);
        } else {
            console.log("Metis imported directly:", Metis);
        }

    } catch (e) {
        console.error("Error initializing Metis:", e);
    }
  }

  onConfigChange() {
    // Update scene based on CONFIG
    this.scene.background.set(CONFIG.rendering.backgroundColor);
    this.directionalLight.color.set(CONFIG.rendering.lightColor);
    this.directionalLight.intensity = CONFIG.rendering.lightIntensity;

    if (this.clothMesh) {
      this.clothMesh.material.color.set(CONFIG.cloth.color);
      this.clothMesh.material.wireframe = CONFIG.cloth.wireframe;

      // Recreating geometry if segments changed is expensive, but okay for this demo
      if (
        this.clothMesh.geometry.parameters.width !== CONFIG.cloth.width ||
        this.clothMesh.geometry.parameters.height !== CONFIG.cloth.height ||
        this.clothMesh.geometry.parameters.widthSegments !== CONFIG.cloth.segmentsX ||
        this.clothMesh.geometry.parameters.heightSegments !== CONFIG.cloth.segmentsY
      ) {
         this.clothMesh.geometry.dispose();
         this.clothMesh.geometry = new THREE.PlaneGeometry(
            CONFIG.cloth.width,
            CONFIG.cloth.height,
            CONFIG.cloth.segmentsX,
            CONFIG.cloth.segmentsY
         );
      }
    }
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.controls.update();

    // Simple animation to show it's alive
    if (this.clothMesh) {
        const time = Date.now() * 0.001;
        // Waving effect
        const positions = this.clothMesh.geometry.attributes.position;
        if (positions) {
            for (let i = 0; i < positions.count; i++) {
                const x = positions.getX(i);
                // const y = positions.getY(i); // In local space, plane is XY, rotated to XZ
                // positions.setZ(i, Math.sin(x + time) * 0.5); // This would modify Z in local space (up in world space)
            }
            // positions.needsUpdate = true;
            // For PlaneGeometry, z is 0. Modifying z makes it wave.
        }
    }

    this.renderer.render(this.scene, this.camera);
  }
}

new App();
