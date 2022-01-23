import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'model-import';
  public loader = new GLTFLoader();
  private textLoader = new FontLoader();
  public rose = [];
  public heartMesh;
  public garmonicArray = [];
  public textFlag = false;
  public container;

  ngOnInit(): void {
    let scene = new THREE.Scene();
    this.container = document.getElementById('scene');

    this.cameraCreator(scene, this);
    this.lightCreator(scene);
    this.heartsCreator(scene, this);
     this.backgroundCreator(scene);
    this.textCreator(this);

    setTimeout(() => { this.mainHeartCreator(scene) }, 3000);
    setTimeout(() => { this.planeCreator(scene, this) }, 5000);
    setTimeout(() => { this.roseCreator(scene, this) }, 10000);
    this.garmonic();
  }

  cameraCreator(scene, component) {
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;
    camera.position.y = 6;
    camera.position.x = 5;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.update();
    controls.enableDamping = true;
    component.container.appendChild(renderer.domElement)

    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      if (camera.position.z > 15) {
        camera.position.z -= 0.07;
      }
      renderer.render(scene, camera)
    }
    animate()
  }

  lightCreator(scene) {
    const ambient = new THREE.AmbientLight(0xffffff);
    ambient.intensity = 0.5;
    scene.add(ambient)

    const light = new THREE.PointLight(0xffffff, 2, 100)
    light.position.set(10, 20, 10)
    scene.add(light)

    const light3 = new THREE.PointLight(0xffffff, 2, 100)
    light3.position.set(20, -5, 20)
    scene.add(light3)
  }

  heartsCreator(scene, component) {
    let heartGroup = [];
    this.loader.load('../assets/model/heart.gltf', gltf => {
      const material = new THREE.MeshLambertMaterial({ color: 0xFF2911 });

      gltf.scene.traverse(function (child) {
        if ((child as THREE.Mesh).isMesh) {
          child.material = material;
          component.heartMesh = child.clone();
          child.scale.set(0.03, 0.03, 0.03);
          child.rotateX(-1.6)
          for (let i = -30; i < 50; i++) {
            let heartCopy = child.clone();
            heartGroup.push(heartCopy)
            heartCopy.position.set(i, getRandomInt(-50, 50), getRandomInt(-20, 10))
            scene.add(heartCopy)
          }
        }
      })
    },
      function (error) {
        console.log('Error: ' + error)
      }
    )

    let step = 0;
    let directionTop = true;
    function animate() {
      requestAnimationFrame(animate);
      const now = Date.now() / 1000;
      let delta;

      if (heartGroup.length) {
        step++;

        if (directionTop) {
          delta = 0.3
        } else {
          delta = -0.3
        }
        if (step > 170) {
          directionTop = !directionTop
          step = 0;
        }

        for (let i = 0; i < 80; i++) {
          if (i % 2) {
            heartGroup[i].position.y += delta;
          } else {
            heartGroup[i].position.y -= delta;
          }

          heartGroup[i].rotation.y = Math.cos(now) * 0.6;
        }
      }
    }
    animate();
  }

  roseCreator(scene, component) {
    let bucket = [];
    let itemCopy1;
    let itemCopy2;

    this.loader.load('../assets/model/rose.gltf', gltf => {
      gltf.scene.children[0].children.forEach(element => {
        this.rose.push(element)
      });
      this.rose.forEach(item => {
        item.position.set(5, 1, 20);
        itemCopy1 = item.clone();
        itemCopy2 = item.clone();
        item.rotateZ(0.2)
        itemCopy1.rotateZ(0.1)
        itemCopy2.rotateZ(-0.2)
        itemCopy1.position.set(6, 1, 20);
        itemCopy2.position.set(7, 1, 20);
        scene.add(item, itemCopy1, itemCopy2);
        bucket.push(item, itemCopy1, itemCopy2);
      })
    })
    let deltaZ = 0;
    let step = 0;

    function animate() {
      requestAnimationFrame(animate);
      if (deltaZ < 14.5) {
        deltaZ += 0.2;
        bucket.forEach((item) => {
          item.position.z -= 0.2;
        })
      } else {
        step++;
        bucket.forEach((item) => {
          if (step < 100) {
            item.position.y += component.garmonicArray[step];
          } else {
            step = 0;
          }
        })
      }
    }
    animate();
  }

  planeCreator(scene, component) {
    const geometry = new THREE.PlaneGeometry(6.5, 5);
    const texture = THREE.ImageUtils.loadTexture('../assets/img/girl.jpg');
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const plane = new THREE.Mesh(geometry, material);
    plane.position.set(5, 5, 0)
    scene.add(plane, component.textMesh1, component.textMesh2);
    component.textFlag = true;

    let zDelta = 0;

    function animate() {
      requestAnimationFrame(animate);
      const now = Date.now() / 1000;
      if (zDelta < 5) {
        zDelta += 0.06
        plane.position.z += 0.06;
      }
    }
    animate();
  }

  mainHeartCreator(scene) {
    let heart = this.heartMesh;
    this.heartMesh.position.set(5, 5, 0)
    this.heartMesh.scale.set(0.13, 0.13, 0.13);
    this.heartMesh.rotateX(-1.6);
    scene.add(this.heartMesh)

    function animate() {
      requestAnimationFrame(animate);
      const now = Date.now() / 1000;
      const scale = Math.abs(Math.sin(now)) / 5

      if (scale > 0.13) {
        heart.scale.set(scale, scale, scale);
      }
    }
    animate();
  }

  backgroundCreator(scene) {
    const geometry = new THREE.PlaneGeometry(150, 100);
    const texture = THREE.ImageUtils.loadTexture('../assets/img/background3.jpg');
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const plane = new THREE.Mesh(geometry, material);
    plane.position.set(0, 0, -40)
    plane.rotateY(0.2)
    plane.rotateX(-0.3)
    scene.add(plane);
  }

  textCreator(component) {
    this.textLoader.load('../assets/fonts/Pattaya_Regular.json',
      // onLoad callback
      function (font) {
        const text1 = new TextGeometry('Darling Emma !', {
          font: font,
          size: 0.8,
          height: 0.2
        })
        const text2 = new TextGeometry('Happy Valentine`s \n      Day !', {
          font: font,
          size: 0.7,
          height: 0.2
        })

        const textMesh1 = new THREE.Mesh(text1, [
          new THREE.MeshPhongMaterial({ color: 0xE2C462 }), // front
          new THREE.MeshPhongMaterial({ color: 0x5c2301 }), // side
        ])

        const textMesh2 = new THREE.Mesh(text2, [
          new THREE.MeshPhongMaterial({ color: 0xE2C462 }), // front
          new THREE.MeshPhongMaterial({ color: 0x5c2301 }), // side
        ])

        textMesh1.position.set(-1, 4, 9);
        textMesh1.castShadow = true;

        textMesh2.position.set(-1, 3, 10);
        textMesh2.castShadow = true;

        component.textMesh1 = textMesh1;
        component.textMesh2 = textMesh2;
        let step = 0;

        function animate() {
          requestAnimationFrame(animate);
          if (step < 100 && component.textFlag) {
            step++;
            textMesh1.position.y += component.garmonicArray[step];
            textMesh2.position.y += component.garmonicArray[step];
          } else {
            step = 0;
          }
        }
        animate();
      },

      // onProgress callback
      function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
      },

      // onError callback
      function (err) {
        console.log('An error happened', err);
      }
    )
  }

  garmonic() {
    for (let i = 0; i < 51; i++) {
      this.garmonicArray.push(-0.02)
    }
    for (let i = 0; i < 51; i++) {
      this.garmonicArray.push(0.02)
    }
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
