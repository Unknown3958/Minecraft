//ae
noise.seed(Math.random())
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);

const Renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#bg"),
})

const textureLoader = new THREE.TextureLoader();

Renderer.setPixelRatio(window.devicePixelRatio);
Renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

Renderer.render(scene, camera);

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(100, 100, 100);
const ambientLight = new THREE.AmbientLight(0xffffff);

const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, ambientLight, pointLight, gridHelper)

const Sky = new THREE.TextureLoader().load('./Textures/sky.jpg');
scene.background = Sky;

const LockMouse = new THREE.PointerLockControls(camera, document.body);

document.body.addEventListener("click", function(){
    LockMouse.lock();
})

let add = 0
let addd = 0

let BlocksPlaced = [];

var CubeTextures = [
    new THREE.MeshStandardMaterial({
        map: textureLoader.load("./Textures/grass_side.jpg")
    }),
    new THREE.MeshStandardMaterial({
        map: textureLoader.load("./Textures/grass_side.jpg")
    }),
    new THREE.MeshStandardMaterial({
        map: textureLoader.load("./Textures/grass_top.jpg")
    }),
    new THREE.MeshStandardMaterial({
        map: textureLoader.load("./Textures/dirt.jpg")
    }),
    new THREE.MeshStandardMaterial({
        map: textureLoader.load("./Textures/grass_side.jpg")
    }),
    new THREE.MeshStandardMaterial({
        map: textureLoader.load("./Textures/grass_side.jpg")
    }),
]

function placeBlock(x, y, z, Texture) {
    const BlockTexture = new THREE.TextureLoader().load(Texture);
    const Block = new THREE.Mesh(
        new THREE.BoxGeometry(6, 6, 6),
        Texture
    );
    scene.add(Block);
    Block.position.set(x, y, z);
    return Block;
}

function ChangeBlock(Block, Face) {
    var Textures = [
        new THREE.MeshStandardMaterial({
            map: textureLoader.load("./Textures/grass_side.jpg")
        }),
        new THREE.MeshStandardMaterial({
            map: textureLoader.load("./Textures/grass_side.jpg")
        }),
        new THREE.MeshStandardMaterial({
            map: textureLoader.load("./Textures/grass_top.jpg")
        }),
        new THREE.MeshStandardMaterial({
            map: textureLoader.load("./Textures/dirt.jpg")
        }),
        new THREE.MeshStandardMaterial({
            map: textureLoader.load("./Textures/grass_side.jpg")
        }),
        new THREE.MeshStandardMaterial({
            map: textureLoader.load("./Textures/digrass_sidert.jpg")
        }),
    ]
    if (Face == "Right") {
        Textures[0] = 0;
    }
    if (Face == "Left") {
        Textures[1] = 0;
    }
    if (Face == "Top") {
        Textures[2] = 0;
    }
    if (Face == "Bottom") {
        Textures[3] = 0;
    }
    if (Face == "Front") {
        Textures[4] = 0;
    }
    if (Face == "Back") {
        Textures[5] = 0;
    }
    if (Face == "None") {

    }
    setTimeout(() => {
        var E = placeBlock(Block.position.x, Block.position.y, Block.position.z, Textures)
        scene.add(E)
        BlocksPlaced.push(E);
        scene.remove(Block);
    }, 100);
}
/*
var xoff = 0;
var zoff = 0;
var inc = 0.05;
var amplitude = 50;
for (var x = -15; x < 15; x++){
    xoff = 0;
    for (var z = -15; z < 15; z++){
        var noisev = Math.round(noise.perlin2(xoff, zoff) * amplitude / 6) * 6
        var BlockCreated = placeBlock(x * 6, noisev, z * 6, CubeTextures);
        BlocksPlaced.push(BlockCreated);
        xoff = xoff + inc;
    }
    zoff = zoff + inc;
}
*/
var chuncks = [];
var xoff = 0;
var zoff = 0;
var inc = 0.05;
var amplitude = 30 + (Math.random() * 70);
var RenderDistance = 3;
var ChunckSize = 10;
for (var i = 0; i < RenderDistance; i++){
    for (var j = 0; j < RenderDistance; j++){
        var chunk = [];
        for (var x = i * ChunckSize; x < (i * ChunckSize) + ChunckSize; x++){
            for (var z = j * ChunckSize; z < (j * ChunckSize) + ChunckSize; z++){
                xoff = inc * x;
                zoff = inc * z;
                var v = Math.round(noise.perlin2(xoff, zoff) * amplitude / 6) * 6;
                var BlockCreated = placeBlock(x * 6, v, z * 6, CubeTextures);
                BlocksPlaced.push(BlockCreated);
                chunk.push(BlockCreated)
            }
        }
        chuncks.push(chunk)
    }
}


var keys = [];
document.addEventListener("keydown", function(e){
    keys.push(e.key);
    if (e.key == " " && canJump == true){
        ySpeed = -0.8;
        canJump = false;
    }
});

document.addEventListener("keyup", function(e){
    var newArr = [];
    for (var i = 0; i < keys.length; i++){
        if (keys[i] != e.key){
            newArr.push(keys[i]);
        }
    }
    keys = newArr;
});

var moveSpeed = 0.3;
var ySpeed = 0;
var acc = 0.05;
var canJump = true;
var Detected = false;
function update(){
    if (keys.includes("w")){
        LockMouse.moveForward(moveSpeed);
        for (var i = 0; i < BlocksPlaced.length; i++){
            if (camera.position.x <= BlocksPlaced[i].position.x + 3 && camera.position.x >= BlocksPlaced[i].position.x - 3 && camera.position.z <= BlocksPlaced[i].position.z + 3 && camera.position.z >= BlocksPlaced[i].position.z - 3){
                if (camera.position.y <= BlocksPlaced[i].position.y + 9){
                    LockMouse.moveForward(-1 * moveSpeed);
                }
            }
        }
    }
    if (keys.includes("a")){
        LockMouse.moveRight(-1 * moveSpeed);
        for (var i = 0; i < BlocksPlaced.length; i++){
            if (camera.position.x <= BlocksPlaced[i].position.x + 3 && camera.position.x >= BlocksPlaced[i].position.x - 3 && camera.position.z <= BlocksPlaced[i].position.z + 3 && camera.position.z >= BlocksPlaced[i].position.z - 3){
                if (camera.position.y <= BlocksPlaced[i].position.y + 9){
                    LockMouse.moveRight(moveSpeed);
                }
            }
        }
    }
    if (keys.includes("d")){
        LockMouse.moveRight(moveSpeed);
        for (var i = 0; i < BlocksPlaced.length; i++){
            if (camera.position.x <= BlocksPlaced[i].position.x + 3 && camera.position.x >= BlocksPlaced[i].position.x - 3 && camera.position.z <= BlocksPlaced[i].position.z + 3 && camera.position.z >= BlocksPlaced[i].position.z - 3){
                if (camera.position.y <= BlocksPlaced[i].position.y + 9){
                    LockMouse.moveRight(-1 * moveSpeed);
                }
            }
        }
    }
    if (keys.includes("s")){
        LockMouse.moveForward(-1 * moveSpeed);
        for (var i = 0; i < BlocksPlaced.length; i++){
            if (camera.position.x <= BlocksPlaced[i].position.x + 3 && camera.position.x >= BlocksPlaced[i].position.x - 3 && camera.position.z <= BlocksPlaced[i].position.z + 3 && camera.position.z >= BlocksPlaced[i].position.z - 3){
                if (camera.position.y <= BlocksPlaced[i].position.y + 9){
                    LockMouse.moveForward(moveSpeed);
                }
            }
        }
    }

    camera.position.y = camera.position.y - ySpeed;
    ySpeed = ySpeed + acc;

    for (var i = 0; i < BlocksPlaced.length; i++){
        if (camera.position.x <= BlocksPlaced[i].position.x + 3 && camera.position.x >= BlocksPlaced[i].position.x - 3 && camera.position.z <= BlocksPlaced[i].position.z + 3 && camera.position.z >= BlocksPlaced[i].position.z - 3){
            if (camera.position.y <= BlocksPlaced[i].position.y + 15 && camera.position.y >= BlocksPlaced[i].position.y - 15){
                camera.position.y = BlocksPlaced[i].position.y + 15
                ySpeed = 0;
                canJump = true;
                Detected = true;
                break;
            }
        }
    }

}

camera.position.set(RenderDistance * ChunckSize / 2,50,RenderDistance * ChunckSize / 2)

function animate() {
    requestAnimationFrame(animate);
    update()
    Renderer.render(scene, camera);
}

animate();
