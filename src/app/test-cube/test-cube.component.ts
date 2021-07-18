import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three'
import { IShip } from '../interface/ship.model';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { IProjectile } from '../interface/cannon.model';
import { IPoint } from '../interface/general-3d.model';
import { distanceVector } from '../function/calculations-3D';

@Component({
  selector: 'test-cube',
  templateUrl: './test-cube.component.html',
  styleUrls: ['./test-cube.component.scss']
})
export class TestCubeComponent implements OnInit {
  offset: THREE.BufferGeometry;
  constructor() { }

  ngOnInit(): void {
    let width = document.documentElement.clientWidth
    let height = document.documentElement.clientHeight
    this.wtf.nativeElement.style.width = width + "px";
    this.wtf.nativeElement.style.height = height + "px";
    this.canvasRef.nativeElement.style.width = width + "px";
    this.canvasRef.nativeElement.style.height = height + "px";

    this.loader.load('assets/ship.glb', 
      glb => {
        console.log(glb)
        //glb.scene.rotateX(90);
        //glb.scene.scale.set(10,10,10);
        glb.scene.position.x = 0;
        glb.scene.position.y = 0;
        glb.scene.position.z = 0;

        this.scene.add(glb.scene);
        this.createPlayer(glb.scene);
        this.startRenderingLoop();
      },
      xhr => {
        console.log(xhr.loaded / xhr.total * 100 + '% loaded')
      },
      err => console.log(err)
    );
  }

  @ViewChild("canvas", {static: true}) canvasRef: ElementRef;
  @ViewChild("wtf", {static: true}) wtf: ElementRef;

    /* HELPER PROPERTIES (PRIVATE PROPERTIES) */
    private camera: THREE.PerspectiveCamera;
    private playerShip: IShip;

    private get canvas() : HTMLCanvasElement {
      return this.canvasRef.nativeElement;
    }
  
    private renderer: THREE.WebGLRenderer;
  
    private scene: THREE.Scene;
    private loader = new GLTFLoader();
    private light: THREE.DirectionalLight = new THREE.DirectionalLight(0xffffff,1);
    private controls: OrbitControls;

  
    @Input()
    public fieldOfView: number = 70;
  
    @Input('nearClipping')
    public nearClippingPane: number = 1;
  
    @Input('farClipping')
    public farClippingPane: number = 1000; 
  
    private moveShip() {
      this.playerShip.model.children.forEach((ch,i) => {
        console.log(ch.position);
        ch.position.x += this.playerShip.velocity.x;
        ch.position.y += this.playerShip.velocity.y;
        ch.position.z += this.playerShip.velocity.z;
      })
    }

    @HostListener('window:keydown', ['$event']) keyEvent(event: KeyboardEvent) {
      console.log(event.code);
      switch (event.code) {
        case "ArrowUp":
          this.playerShip.velocity.z += -0.01; 
          break;
        case "ArrowDown":
          this.playerShip.velocity.z += +0.01;
          break;
        case "ArrowLeft":
          this.playerShip.model.children[0].rotation.y += 0.05;
          break;
        case "ArrowRight":
          this.playerShip.model.children[0].rotation.y += -0.05;
          break;
        case "Space":
          this.fire();
          break;
        default:
          break;
      }
  }
  
  private createPlayer(ship: THREE.Group) {

    
    this.playerShip = {
      model: ship,
      velocity: {x: 0, y: 0, z: 0}
    };

    this.scene.add(this.playerShip.model);
  }

  private lightning() {
    this.light.position.set(2,2,5);
    this.scene.add(this.light);
  }

  private createScene() {
    /* Scene */
    this.scene = new THREE.Scene();

    /* Camera */
    let aspectRatio = this.getAspectRatio();
    this.camera = new THREE.PerspectiveCamera(
      this.fieldOfView,
      aspectRatio,
      this.nearClippingPane,
      this.farClippingPane
    );
    this.camera.position.z = 50;
    this.lightning();
  }

  private createOrbitControls() {
    this.controls = new OrbitControls( this.camera, this.renderer.domElement );
  }

  private getAspectRatio() {
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  /**
   * Start the rendering loop
   */
  private startRenderingLoop() {
    /* Renderer */
    // Use canvas element in template
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.createOrbitControls();

    let component: TestCubeComponent = this;
    (function render() {
      requestAnimationFrame(render);
      component.moveShip();
      component.controls.update();
      component.renderer.render(component.scene, component.camera);
    }());
  }



  /* EVENTS */

  /**
   * Update scene after resizing. 
   */
  public onResize() {
    this.camera.aspect = this.getAspectRatio();
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
  }

  public ngAfterViewInit() {
    this.createScene();
  }

  fire() {
    const geometry = new THREE.SphereGeometry( .1, 8, 8 );
    const material = new THREE.MeshBasicMaterial( {color: 0xffffff} );
    const rightCannon = new THREE.Mesh( geometry, material );
    const leftCannon = new THREE.Mesh( geometry, material );

    rightCannon.position.set(this.playerShip.model.children[1].position.x,this.playerShip.model.children[1].position.y,this.playerShip.model.children[1].position.z);
    leftCannon.position.set(this.playerShip.model.children[2].position.x,this.playerShip.model.children[2].position.y,this.playerShip.model.children[2].position.z);

    const leftProjectile: IProjectile = {
      model: leftCannon,
      lenght: 28,
      origin: {...leftCannon.position},
      position: leftCannon.position,
      destination: {
        x: this.playerShip.velocity.x * 3,
        y: this.playerShip.velocity.y * 3,
        z: this.playerShip.velocity.z * 3
      },
    }

    const rightProjectile: IProjectile = {
      model: rightCannon,
      lenght: 28,
      origin: {...rightCannon.position},
      position: rightCannon.position,
      destination: {
        x: this.playerShip.velocity.x * 3,
        y: this.playerShip.velocity.y * 3,
        z: this.playerShip.velocity.z * 3
      },
    }

    this.scene.add( rightCannon );
    this.scene.add( leftCannon );
    this.projectileMove(leftProjectile);
    this.projectileMove(rightProjectile);
  }

  projectileMove(projectile: IProjectile): void {
    const newPosition: IPoint = {
      x: projectile.position.x + projectile.destination.x,
      y: projectile.position.y + projectile.destination.y,
      z: projectile.position.z + projectile.destination.z
    }
    const newLenght: number = distanceVector(projectile.origin ,newPosition)
    if (newLenght > projectile.lenght) {
      this.scene.remove(projectile.model);
      return;
    }
    projectile.model.position.set(newPosition.x,newPosition.y,newPosition.z);
    projectile.position = newPosition;
    requestAnimationFrame(() => this.projectileMove(projectile));
  }

}
