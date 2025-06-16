// Ideas of Dave Briccetti with THREE.js
/* import * as THREE from 'three'
import { OrbitControls } from '/three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from '/three/examples/jsm/loaders/GLTFLoader.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js' */

/* import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';
import { GUI } from 'https://cdn.jsdelivr.net/npm/lil-gui@0.20';
 */
import * as THREE from 'three'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';




const gltfLoader = new GLTFLoader();
let CELLS_PER_DIMENSION = 5;
function arrayGen(content,dims,dim1Len,dim2Len,dim3Len) {
		var args = arguments;
		  function loop(dim) {
			var array = [];
			for (var a = 0; a < args[dim + 1]; a++) {
			  if (dims > dim) {
				array[a] = loop(dim + 1);
			  } else if (dims == dim) {
				array[a] = content;
			  }
			}
			return array;
		  }
		var  thisArray = loop(1);
		return thisArray;
	};
class Lee3d {
    constructor(r, c, d) {
        this.ROW = r;
        this.COL = c;
		this.DEPTH = d;
		this.distanse = 0;
    }
    isValid(row, col, depth, segments) {
		let CPD = (CELLS_PER_DIMENSION-1)/2;
        let ret = false;
        // return true if row number and column number is in range
        let forbidden = false;
        let i = segments.length - 1;
        while(i >= 0) {
            if (row == segments[i].y && col == segments[i].x && depth == segments[i].z) {
                forbidden = true;
            }
            i -= 1;
        }
        if ((row >= 0) && (row <= this.ROW) && (depth >= 0)  && (depth <= this.DEPTH) && !forbidden && (col >= 0) && (col <= this.COL)) {
            ret = true;
        }
        return ret;
    }
	
    BFS(segments, dest)  {
		let equals = 0;
		if(segments[0].x === dest.x) equals = 1;
		if(segments[0].y === dest.y) equals = 2;
		if(segments[0].z === dest.z) equals = 3;
        let rowNum = [-1, 0, 0, 1, 0, 0];
        let colNum = [0, -1, 1, 0, 0, 0];
		let depNum = [0,  0, 0, 0, 1, -1];
		let visited = arrayGen(0,this.ROW,this.ROW,this.ROW,this.ROW);
		for(let i = 0; i < this.ROW; i++) {
			for(let j = 0; j < this.ROW; j++) {
				for(let k = 0; k < this.ROW; k++) {
					visited[i][j][k] = 0;
				}
			}
		}
        for(let i = 0; i < segments.length; i++) {
             visited[segments[i].x][segments[i].y][segments[i].z] = -1;
        }
        let q = [];
        let src = {x:segments[0].x,y:segments[0].y,z:segments[0].z};
		let s = {pt:src, dist:0};
        q.push (s); 		
        while (q.length != 0) {
            let curr = q.shift();
            let pt = curr.pt;
            let xold = 0;
            let yold = 0;
			let zold = 0;
            // If we have reached the destination cell, we are done
            if ((pt.x === dest.x) && (pt.y === dest.y) && (pt.z === dest.z)) {
                let x = dest.x;
                let y = dest.y;
				let z = dest.z;
                let d = curr.dist;
                this.distanse = d;
                while (d > 0) {
                    d -= 1
                    xold = x;
                    yold = y;
					zold = z;
                    for (let k = 0; k < 6; k++) {
                        let iy = y - rowNum[k];
						//if(equals === 2) iy = y;
                        let ix = x - colNum[k];
						//if(equals === 1) ix = x;
						let iz = z - depNum[k];
						//if(equals === 3) iz = z;
                        if (iy >= this.ROW || ix >= this.COL || iz >= this.DEPTH) {
                            continue;
                        }
                        if (this.isValid(iy, ix, iz, segments) && (visited[iy][ix][iz] === d)) {
                            x = ix;
                            y = iy;           // переходим в ячейку, которая на 1 ближе к старту
							z = iz;
                            break;
                        }
                    }
                }
                return {x:xold,y:yold,z:zold};
            }
			
			for (let i = 0; i < 6; i++) {
                let row = pt.y + rowNum[i];
			//	if(equals === 2) row = pt.y;
                let col = pt.x + colNum[i];
			//	if(equals === 1) col = pt.x;
				let depth = pt.z + depNum[i];
			//	if(equals === 3) depth = pt.z;
                if (row >= this.ROW || col >= this.COL || depth >= this.DEPTH) {
                    continue;
                }
                if ((this.isValid(row, col, depth, segments)) && (visited[row][col][depth] === 0)) {
                    if(visited[row][col][depth] != -1) {
                        visited[row][col][depth] = curr.dist + 1;
						let nodePlus = {x:col,y:row,z:depth};
                        let Adjcell = {pt:nodePlus, dist:(curr.dist + 1)};
                        q.push (Adjcell);
                    }
                }
            }
        }
        return {x:-100,y:-100,z:-100};
    }
}

//import {Lee3d} from 'D:\lee3dSnakeWPA\new\lee3d.js';
let tt = prompt("К-во кубиков по одной оси куба (3,5,7,9,11,15,19,21,31)",11);
let tn = Number(tt);
if (tn === 0) 
	CELLS_PER_DIMENSION = 11;
else
	if(tn === 3 || tn === 5 || tn === 7 || tn === 9 || tn === 11 || tn === 15 || tn === 19 || tn === 21 || tn === 31 || tn === 41)
		CELLS_PER_DIMENSION = tn;
	else
		location.reload();
let audio = new Audio('chewing_apple.wav');	
const CELLS_RIGHT_OF_CENTER = (CELLS_PER_DIMENSION - 1) / 2;
const STARTING_NUM_SEGMENTS = 3;
const MS_PER_MOVE = 1000;
const SPEEDUP_FACTOR = 3;

const HEADER_HEIGHT = 100;

let len = Math.min(window.innerWidth - HEADER_HEIGHT, window.innerHeight - HEADER_HEIGHT);
const sizes = {width: len,height: len};
let arenaWidth = Math.round(len * 0.5);                 
let cellWidth = Math.round(arenaWidth / CELLS_PER_DIMENSION);
let rightmostCellCenter = cellWidth * CELLS_RIGHT_OF_CENTER;
let newHeadPos = new THREE.Vector3();
let foodPos = new THREE.Vector3();;
let segments = [];
let segm = [];
let fp = new THREE.Vector3(0,1,0);
let zeroVector = new THREE.Vector3(0, 0, 0);
let pos = new THREE.Vector3();
let direction = new THREE.Vector3();
let newDir = new THREE.Vector3(0, 0, 0);
let dirHead = new THREE.Vector3(0, 0, 0);
let scene = new THREE.Scene();			//window.innerWidth / window.innerHeight
let cube;
let lee = new Lee3d(CELLS_PER_DIMENSION, CELLS_PER_DIMENSION, CELLS_PER_DIMENSION);
let gameScore = 0;
let firstTime = new Date().getTime();
let scoreDiv = document.createElement('div');
let timeDiv = document.createElement('div');
let resultDiv = document.createElement('div2');
const scoreElement = document.querySelector('#score');
const timeElement = document.querySelector('#time');
const resultElement = document.querySelector('#result');
const canvas = document.querySelector('#game-field');
canvas.width = len;
canvas.height = len;
let count1 = 0;
let count2 = 0;
let eater1 = 0;
let eater2 = 0;
let whoEat = 1;
let camera = new THREE.PerspectiveCamera(100, 1, 0.1, 1000);
let renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
let controls = new OrbitControls(camera, renderer.domElement);
renderer.setSize(len, len);
let props = { showGrid: false, depthZ_Fraction: 0.015, barColor: 'gray', barDirection: 'Vertical' };
let prop = { toggleRotation: false, depthZ_Fraction: 0.015, barColor: 'gray', barDirection: 'Vertical' };
let gui = new GUI({ width: 300 });
let showGrid = gui.add(props, 'showGrid').name('Сетка - вкл/откл').listen();
let toggleRotation = gui.add(prop, 'toggleRotation').name('Вращение - вкл/откл').listen();
let prop2 = {autoD:false,depthZ_Fraction:0.015, barColor: 'gray', barDirection:'Vertical'};
let prop3 = {gameStart:false,depthZ_Fraction:0.015, barColor: 'gray', barDirection:'Vertical'};
const loader = new THREE.TextureLoader();
const texture = loader.load( "png/head.png" );
const textureB = loader.load( "png/skin1.png" );
showGrid.onChange(function (newValue) { showGrid = !showGrid });
toggleRotation.onChange(function (newValue) { controls.autoRotate = !controls.autoRotate });
let autoD = gui.add(prop2,'autoD').name('Авто - вкл/откл').listen();
let gameStart = gui.add(prop3,'gameStart').name('Старт - вкл/откл').listen();
autoD.onChange(function(newValue) {autoD = !autoD });
gameStart.onChange(function(newValue) {gameStart = !gameStart });

let food;
let gltf = await gltfLoader.loadAsync('png/Apple.glb');
food = gltf.scene;

let wormSegments = [];
let leftEye;
let rightEye;
let keyPressed = ' ';
let geometry;
const quaternion = new THREE.Quaternion();
const axisX = new THREE.Vector3(1, 0, 0);
const axisY = new THREE.Vector3(0, 1, 0);
const axisZ = new THREE.Vector3(0, 0, 1);


function createSegment(color,rad1,rad2) {
    geometry = new THREE.CylinderGeometry(rad1,rad2, cellWidth, 8);
    const material = new THREE.MeshPhongMaterial({ 
        color,
		transparent:true,
		opacity: 0.34,
        flatShading: true
    });
    return new THREE.Mesh(geometry, material);
}
function createSegmentB(color,rad1,rad2,texture) {
    const geometry = new THREE.CylinderGeometry(rad1,rad2, cellWidth, 52);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff,transparent:true,map: texture });
    return new THREE.Mesh(geometry, material);
	/* let seg = new THREE.Mesh(geometry, material);
	seg.rotation.set(rr.x*Math.PI / 2,0,0);
	return seg; */
}

        // Create segments
wormSegments.push(createSegmentB(0xff0000,0.8*cellWidth,cellWidth,texture));

for (let i = 1; i < STARTING_NUM_SEGMENTS-1; i++) {
    wormSegments.push(createSegmentB(0x00ff00,cellWidth,cellWidth,textureB)); // Green body
        }
wormSegments.push(createSegmentB(0x00ff00,cellWidth,0.0*cellWidth,textureB)); // tail
wormSegments.forEach(segment => scene.add(segment));		

let directionalLight = new THREE.DirectionalLight(0xffffff, 3,854 );
directionalLight.position.set(0,0, 700);
//scene.add(directionalLight);	
let light = new THREE.AmbientLight(0x404040); // soft white light (мягкий белый свет)
light.position.set(0, 0, 700);
//scene.add(light);
const lightP = new THREE.PointLight(0xffffff, 1, 100);
        lightP.position.set(0, 10, 10);
//        scene.add(lightP);

init();
setUpState();



async function init() {
	gameStart = false;
	autoD = false;
	showGrid = false;
	controls.autoRotate = false;
	renderer.setClearColor(0xffffff, 1);
	renderer.setSize(len, len);
	camera.position.set(-50, 0, 600);		//-50, 0, 600

	controls.enableKeys = false;
	controls.autoRotate = false;
	controls.autoRotateSpeed = 4
	//controls.maxPolarAngle = Math.PI / 4;
	controls.maxAzimuthAngle = Math.PI / 2;
	controls.update();
}

function setUpState() {
	renderer.setClearColor(0xffffff, 1);
	while (segments.length > 0)
		scene.remove(segments.shift().mesh)
	const n = scene.children.length - 1;
	for (var i = n; i > -1; i--) {
		scene.remove(scene.children[i]);
	}    
	
	for (let i = 0; i < STARTING_NUM_SEGMENTS; i++) {
		let tmp2 = new THREE.Vector3(0, -i * cellWidth, 0);		//(0, 0, cellWidth -i * cellWidth)
		segments.push(tmp2);
    }
	newHeadPos = segments[0].clone();
	foodPos = newFoodPosition();
}

function newFoodPosition() {
	while(true) {
		const m = CELLS_RIGHT_OF_CENTER;
		const c = () => Math.round(m * (Math.random() * 2 - 1)) * cellWidth;
		let fp = new THREE.Vector3(c(), c(), c());
		if(!checkConect(fp,0)) 
			return fp;
	}
}
function checkConect(toCheck, st) {
	let ret = false;
	for (let i = st; i < segments.length; i++) {
		if (toCheck.equals(segments[i])) {
			ret = true;
		}
	}
	return ret;
}

function render() {
	let ret = 0;
	const n = scene.children.length - 1;
	for (var i = n; i > -1; i--) {
		scene.remove(scene.children[i]);
	};
	scene.background = new THREE.Color(0xffffff);
	if(autoD) { 
		let c, r, z;
		segm.length = 0;
		let dst = foodPos.clone ();
		dst.addScalar(rightmostCellCenter); 
		dst.divideScalar(cellWidth);	//переход от пикселей к ячейкам
		//изменение начала координат
		for (let i = 0; i < segments.length; i++) {
			c = (segments[i].x + rightmostCellCenter)/cellWidth;
			r = (segments[i].y + rightmostCellCenter)/cellWidth;		//r = segments[i].y/cellWidth + CPD;
			z = (segments[i].z + rightmostCellCenter)/cellWidth;
			let tmp = new THREE.Vector3(c, r, z);
			segm.push(tmp);
		}
		let dest = lee.BFS(segm, dst);
		if((dest.x != -100 && dest.y != -100) && dest.z != -100)
		{
			dest.x -= (CELLS_PER_DIMENSION-1)/2;
			dest.y -= (CELLS_PER_DIMENSION-1)/2;
			dest.z -= (CELLS_PER_DIMENSION-1)/2;
			let destV = new THREE.Vector3(dest.x, dest.y, dest.z);
			destV.multiplyScalar(cellWidth);
			direction = destV.sub(segments[0]);
			whoEat = 1;
			count1++;
		}
		else {
				let toFoodDistances = 9999999999;
				let validDirs = validMoveDirections(segments[0]);
				let tmpHead;
				if(validDirs.length ) {	
					let tt, segm;
					for (let i = 0; i < validDirs.length; i++) {
						segm = segments[0].clone();
						tt = (segm.add(validDirs[i])).distanceToSquared(foodPos);
						if(toFoodDistances > tt) {
							tmpHead = i;
							toFoodDistances = tt;
						}
					}				
					direction = validDirs[tmpHead];
					whoEat = 2;
					count2++;
				} else {
					let currentTime = new Date().getTime();
					let deltaTime = Math.floor((currentTime - firstTime) / 1000);
					if (deltaTime > 0) {
						const result = Math.round(gameScore / deltaTime * 1000) / 100;
						resultElement.innerHTML = result;
					}
					autoD =false;
					direction = zeroVector.clone();
					newDir = zeroVector.clone();
					console.log("Lee3d is impossible to choose direction!");
					console.log("count1/count2 - ",count1,"-",eater1,"/",count2,"-",eater2);
					return 1;
				}
		}
    }
	if(gameStart) {
		ret = moveSnake();
		let currentTime = new Date().getTime();
		let deltaTime = currentTime - firstTime;
		scoreDiv.innerHTML = `(Найдено: ${gameScore}`;
		timeDiv.innerHTML = `Играем: ${Math.floor(deltaTime/1000)} сек.)`;
    }
	if(ret == 0) {
		drawFood();
		drawSnake();
		drawBox();
		let directionalLight = new THREE.DirectionalLight(0xffffff, 3,854 );
		directionalLight.position.set(0,0, 700);
		scene.add(directionalLight);	
		let light = new THREE.AmbientLight(0x404040); // soft white light (мягкий белый свет)
		light.position.set(0, 0, 700);
		scene.add(light);
		let light2 = new THREE.AmbientLight(0xffffff); // soft white light (мягкий белый свет)
		light2.position.set(0, 0, -300);
		scene.add(light2);
		const lightP = new THREE.PointLight(0xffffff, 1, 100);
        lightP.position.set(0, 10, 100);
        scene.add(lightP)
		if(showGrid)	{
			drawArena();
		}
	}
	directionalLight.position.set(foodPos.x-50,foodPos.y-50,foodPos.z-650);		//2.173, 4.017, -3.112
	directionalLight.castShadow = true;
  controls.enableZoom = false;   
  if (
    controls.getAzimuthalAngle() >= Math.PI / 12 ||
    controls.getAzimuthalAngle() <= -Math.PI / 8  ) {
	controls.autoRotateSpeed *= -1;
  }
   if(!autoD) {
	  direction.x = 0;
	  direction.y = 0;
	  direction.z = 0;
  }
  controls.update();
  renderer.render( scene, camera );
//  requestAnimationFrame(render);
}

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function validMoveDirections(head) {
	const validDirs = [];
	let tmpHead, candidateDir;
    [-1, 1].forEach(n => {
    for (let axis = 0; axis < 3; axis++) {
		tmpHead = head.clone();
        const dirArray = [0, 0, 0];
        dirArray[axis] = n;
        candidateDir = new THREE.Vector3(dirArray[0], dirArray[1], dirArray[2]);
        const candidatePos = tmpHead.add(candidateDir.multiplyScalar(cellWidth));
        if (!collides(candidatePos))
          validDirs.push(candidateDir);
    }
  });
  return validDirs;
}

function collides(pos) {
	let a = checkConect(pos, 1)
	let b = newPositionWouldLeaveArena(pos)
	if (a || !b)  
		return true;
	return false;
}

function drawBox() {
	let width = cellWidth * CELLS_PER_DIMENSION;
	let geometry = new THREE.BoxGeometry(width, width, width);
	const edges = new THREE.EdgesGeometry(geometry);
	const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 'lightblue' }));
	line.position.set(0, 0, 0)
	scene.add(line);
}

function calRotation(direction) {
	let newDir;
	if(direction.z == -1) newDir = new THREE.Vector3(-1,0,0);
	if(direction.z == 1)	newDir = new THREE.Vector3(1,0,0);
	if(direction.y == -1)	newDir = new THREE.Vector3(2,0,0);
	if(direction.y == 1)	newDir = new THREE.Vector3(0,0,0);
	if(direction.x == -1)	newDir = new THREE.Vector3(0,0,1);
	if(direction.x == 1)	newDir = new THREE.Vector3(0,0,-1);
	if(direction.equals(zeroVector)) newDir = new THREE.Vector3(0,0,0);
	return newDir;
}

function drawSnake() {
	const segmentWidth = cellWidth * 0.9;
	let color = 'green';
	let points = [];
	for (let i = 0; i < segments.length; i++) {	
		let seg = wormSegments[i];
		seg.position.set(segments[i].x,segments[i].y,segments[i].z);
		if(i == 0) {
			if(zeroVector !== newDir) {
				seg.rotation.set(0,0,0);
				let rr = calRotation(newDir);
				seg.rotation.set(rr.x*Math.PI / 2,rr.y*Math.PI / 2,rr.z*Math.PI / 2);
			}
			scene.add(seg);
			const bottomLocal = new THREE.Vector3(0, -seg.geometry.parameters.height / 2, 0);
			seg.updateMatrixWorld();
			let bottomWorld = bottomLocal.clone().applyMatrix4(seg.matrixWorld);
			points.push(bottomWorld);
		}
		if(i > 0 && i < segments.length-1) {
			const topLocal = new THREE.Vector3(segments[i].x,segments[i].y,segments[i].z);
			let topWorld = topLocal.clone().applyMatrix4(seg.matrixWorld);
			points.push(topWorld);
		}
		if(i == segments.length-1) {
			const topLocal = new THREE.Vector3(0, seg.geometry.parameters.height / 2, 0);
			seg.updateMatrixWorld();
			let topWorld = topLocal.clone().applyMatrix4(seg.matrixWorld);
			points.push(topWorld);
			let path = new THREE.CatmullRomCurve3(points);
			let geometry = new THREE.TubeGeometry( path, 64, cellWidth, 8, false );
			let material = new THREE.MeshBasicMaterial( { color: 0xffffff,transparent:true,map: textureB } );
			//Create a mesh
			let tube = new THREE.Mesh( geometry, material );
			//Add tube into the scene
			scene.add( tube );
			scene.add(seg);
		}		
	}	
	keyPressed = ' ';	
	if (showGrid)
		drawReferenceStructures(segments[0], segmentWidth, 'green');
}

function drawFood() {
	const itemWidth = cellWidth * 0.6;
	food.scale.set( 200, 200, 200 );
	food.position.set(foodPos.x,foodPos.y,foodPos.z-50);
	food.castShadow = true;
	scene.add( food );
  if(showGrid)
	drawReferenceStructures(foodPos, itemWidth, 0xff0000);
}

function drawReferenceStructures(pos, objWidth, colore) {
	const l = arenaWidth / 2; // Largest coordinate value
	const s = -l; // Smallest
	const { x, y, z } = pos;
	let vector1 = new THREE.Vector3(l, y, z);
	let vector2 = new THREE.Vector3(x, -l, z);
	let vector3 = new THREE.Vector3(x, y, s);
	drawLine(colore, pos, vector1);
	drawLine(colore, pos, vector2);
	drawLine(colore, pos, vector3);

	const w = objWidth;
	const f = 0.1; // Length on flat dimension
	box(colore, objWidth, f, w, w, l, -y, z, 2);
	box(colore, objWidth, w, f, w, x, l, z, 2);
	box(colore, objWidth, w, w, f, x, -y, s, 2);
}

function box(colore, d, a, b, c, k, m, n, pr) {
	let geometry;
	let material;
	if (pr === 1) {
		geometry = new THREE.BoxGeometry(d, d, d);
		const edges = new THREE.EdgesGeometry(geometry);
		const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: colore, }));
		line.position.set(a, b, c)
		scene.add(line);
	}
	if (pr === 2) {
		geometry = new THREE.BoxGeometry(d, d, 0);
	}
	material = new THREE.MeshBasicMaterial({ wireframe: false, color: colore, transparent: true, opacity: 0.1 });
	cube = new THREE.Mesh(geometry, material);
	if (pr === 1) {
		cube.position.set(a, b, c);
	} else {
		cube.position.set(k, -m, n);
	}
	scene.add(cube);
}

function moveSnake() {
	let tmp2 = newHeadPos.clone();
	if (!direction.equals(zeroVector)) {
		newHeadPos.add(direction);
		let xx = Math.abs(direction.x) > 0 ? 1 : 0;
		let yy = Math.abs(direction.y) > 0 ? 1 : 0;
		let zz = Math.abs(direction.z) > 0 ? 1 : 0;
		if(xx == 1 && direction.x < 0) xx = -1;
		if(yy == 1 && direction.y < 0) yy = -1;
		if(zz == 1 && direction.z < 0) zz = -1;
		newDir = new THREE.Vector3(xx,yy,zz);
		let a = checkConect(newHeadPos, 1);
		let b = newPositionWouldLeaveArena(newHeadPos);
		if (a || !b) {  //удар по своему телу или выход за границу
			let currentTime = new Date().getTime();
			let deltaTime = Math.floor((currentTime - firstTime) / 1000);
			if (deltaTime > 0) {
				const result = Math.round(gameScore / deltaTime * 1000) / 100;
				resultElement.innerHTML = result;
			}
			autoD =false;
			direction = zeroVector.clone();
			alert( "Удар по телу или выход за границу!" );
			console.log("удар по своему телу или выход за границу");
			console.log("2 - count1/count2 - ",count1,"/",count2);
			console.log("2 -count1/count2 - ",count1,"-",eater1,"/",count2,"-",eater2);
			return 1;
		} else {
			if (newHeadPos.equals(foodPos)) {
				audio.play();
				foodPos = newFoodPosition();
				gameScore += 1;
				if(whoEat == 1)
					eater1++;
				else
					eater2++;
					scoreElement.innerHTML = gameScore;
					segments.unshift(newHeadPos.clone()); // Put new head on front
					let ttt = createSegmentB(0x00ff00,cellWidth,cellWidth,textureB);
					wormSegments.splice(1, 0, ttt);
					let rr = wormSegments[0].rotation; //added segment has got rotation of previous first
					wormSegments[1].rotation.set(rr.x,rr.y,rr.z);
				for (let i = 0; i < segments.length; i++) {
					for (let j = i+1; j < segments.length; j++) {
						if(segments[i].x == segments[j].x && segments[i].y == segments[j].y && segments[i].z == segments[j].z) {
							console.log("i - ",i, " ",segments[i]," j - ",j, " ",segments[j]);
							segments[j] = tmp2;
							alert("1-дубликат", j);
							break;
						}
					}
				}			
			} else {
				segments.pop(); // Discard last
				let tmp1 = newHeadPos.clone();
				segments.splice(0,0,tmp1);
				for (let i = wormSegments.length - 1; i > 0; i--) {
					let rr = wormSegments[i-1].rotation;
					wormSegments[i].rotation.set(rr.x,rr.y,rr.z);
				}
				for (let i = 0; i < segments.length; i++) {
					for (let j = i+1; j < segments.length; j++) {
						if(segments[i].x == segments[j].x && segments[i].y == segments[j].y && segments[i].z == segments[j].z) {
							console.log("i - ",i, " ",segments[i]," j - ",j, " ",segments[j]);
							segments[j] = tmp2;							
							alert("2-дубликат");
							break;
						}
					}
				}
			}
		}																
	}
	return 0;
}

/* function tubeSegment(startPoint,endPoint,radius) {
						// Создаем контрольные точки для плавного изгиба
	const points = [
		startPoint,
		new THREE.Vector3(startPoint.x + 2, 1, startPoint.z),
		new THREE.Vector3(endPoint.x - 2, 4, endPoint.z - 1),
		endPoint
	];
						// Создаем кривую CatmullRomCurve3
	const curve = new THREE.CatmullRomCurve3(points);
						// Создаем геометрию трубы
	const geometry = new THREE.TubeGeometry(
		curve,   // путь (кривая)
		64,      // tubularSegments (количество сегментов трубы)
		radius,     // radius (радиус трубы)
		8,       // radialSegments (количество сегментов на срезе)
		false    // closed (замкнута ли труба)
	);	
	const material = new THREE.MeshBasicMaterial({ color: 0xffffff,transparent:true,map: textureB });
	const tube = new THREE.Mesh(geometry, material);
	return tube;
//	scene.add(tube);	
} */

function newPositionWouldLeaveArena(pos) {
	let dim = cellWidth * (CELLS_PER_DIMENSION - 1)/2;
	if (Math.abs(pos.x) <= dim && Math.abs(pos.y) <= dim && Math.abs(pos.z) <= dim) {
		return true;
	}
	return false;
}

function drawArena() {
	const cMax = rightmostCellCenter + cellWidth / 2;
	const cMin = -cMax;

	[
		'⊤↑I', // Right  horizontal
		'⊤I↑', //        vertical
		'I↑⊥', // Back   horizontal
		'↑I⊥', //        vertical
		'I⊤↑', // Bottom “horizontal”
		'↑⊤I'  //        “vertical”
	].forEach(codeSet => {
		let aa = codeSet;
		if (aa === 'I⊤↑' || aa === '↑⊤I') {
			let b = aa;
		}
		for (let v = cMin; v <= cMax; v += cellWidth) {
			const coords = [0, 0, 0, 0, 0, 0];

			codeSet.split('').forEach((code, i) => {
				switch (code) {
					case '⊤':
						coords[i] =
							coords[i + 3] = cMax;
						break;
					case '⊥':
						coords[i] =
							coords[i + 3] = cMin;
						break;
					case '↑':
						coords[i] =
							coords[i + 3] = v;
						break;
					case 'I':
						coords[i] = cMin;
						coords[i + 3] = cMax;
						break;
				}
			});
			if (aa === 'I⊤↑' || aa === '↑⊤I') {
				let vector1 = new THREE.Vector3(coords[0], -coords[1], coords[2]);
				let vector2 = new THREE.Vector3(coords[3], -coords[4], coords[5]);
				drawLine(0xc0c0c0, vector1, vector2)
			} else {
				let vector1 = new THREE.Vector3(coords[0], coords[1], coords[2]);
				let vector2 = new THREE.Vector3(coords[3], coords[4], coords[5]);
				drawLine(0xc0c0c0, vector1, vector2)
			}			
		}
	});
}

function drawLine(color, vector1, vector2) {
	const points = [];
	points.push(vector1);
	points.push(vector2);
	let lineGeometry = new THREE.BufferGeometry().setFromPoints(points);//Производная фигура
	let lineMaterial = new THREE.LineBasicMaterial({ color: color, linewidth: 1 });
	let line = new THREE.Line(lineGeometry, lineMaterial);//Создаем линию из созданной геометрии	//line.rotation.set(new THREE.Vector3(-Math.PI/2, 0,0));
	scene.add(line);//Добавляем объект на сцену
}

render();

document.addEventListener("keydown", e => {
	switch (e.key) {
		case 'w':
			direction.z = -cellWidth;
			newDir = new THREE.Vector3(0,0,-1);
			keyPressed = 'w';
			break
		case 's':
			direction.z = cellWidth;
			newDir = new THREE.Vector3(0,0,1);
			keyPressed = 's';
			break
		case "ArrowDown":
			direction.y = -cellWidth;
			newDir = new THREE.Vector3(0,-1,0);
			keyPressed = "ArrowDown";
			break
		case "ArrowUp":
			direction.y = cellWidth;										
			newDir = new THREE.Vector3(0,1,0);								
			keyPressed = "ArrowUp";
			break
		case "ArrowLeft":
			direction.x = -cellWidth;
			newDir = new THREE.Vector3(-1,0,0);
			keyPressed = "ArrowLeft";
			break
		case "ArrowRight":
			direction.x = cellWidth;
			newDir = new THREE.Vector3(1,0,0);
			keyPressed = "ArrowRight";
			break
		case 'g':
			gameStart = true;
			break;
		case 'p':
			gameStart = false;
			break;
	}
})

window.addEventListener('resize', () => {
	let len = Math.min(window.innerWidth - 10, window.innerHeight -50);
	let arenaWidth = Math.round(len * 0.5);	
    renderer.setSize(arenaWidth, arenaWidth)
    camera.updateProjectionMatrix()
})

let nIntervId = setInterval(render,100);
//export { CELLS_PER_DIMENSION };