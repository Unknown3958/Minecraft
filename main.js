noise.seed(Math.random())

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
const textureLoader = new THREE.TextureLoader();
const Renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#bg"),
})
Renderer.setPixelRatio(window.devicePixelRatio);
Renderer.setSize(window.innerWidth, window.innerHeight);

const pointLight = new THREE.PointLight(0xffffff);
const ambientLight = new THREE.AmbientLight(0xffffff);
const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
const Sky = new THREE.TextureLoader().load('Textures/sky.jpg');

pointLight.position.set(100, 100, 100);
scene.add(lightHelper, ambientLight, pointLight, gridHelper)
scene.background = Sky;

const LockMouse = new THREE.PointerLockControls(camera, document.body);

document.body.addEventListener("click", function() {
    LockMouse.lock();
})

var Grass_Block_Textures = [
    new THREE.MeshStandardMaterial({
        map: textureLoader.load("Textures/grass_side.jpg")
    }),
    new THREE.MeshStandardMaterial({
        map: textureLoader.load("Textures/grass_side.jpg")
    }),
    new THREE.MeshStandardMaterial({
        map: textureLoader.load("Textures/grass_top.jpg")
    }),
    new THREE.MeshStandardMaterial({
        map: textureLoader.load("Textures/dirt.jpg")
    }),
    new THREE.MeshStandardMaterial({
        map: textureLoader.load("Textures/grass_side.jpg")
    }),
    new THREE.MeshStandardMaterial({
        map: textureLoader.load("Textures/grass_side.jpg")
    }),
]

function Block(x,y,z,t){
    
    this.x = x;
    this.y = y;
    this.z = z;
    this.Texture = t;
    this.block;
    

    this.disp = function(){
        this.block = new THREE.Mesh(
            new THREE.BoxGeometry(6, 6, 6),
            this.Texture
        );
        scene.add(this.block);
        this.block.position.set(this.x, this.y, this.z);
    }
}

function ChangeBlock(Block, Face) {
    var Textures = [
        new THREE.MeshStandardMaterial({
            map: textureLoader.load("Textures/grass_side.jpg")
        }),
        new THREE.MeshStandardMaterial({
            map: textureLoader.load("Textures/grass_side.jpg")
        }),
        new THREE.MeshStandardMaterial({
            map: textureLoader.load("Textures/grass_top.jpg")
        }),
        new THREE.MeshStandardMaterial({
            map: textureLoader.load("Textures/dirt.jpg")
        }),
        new THREE.MeshStandardMaterial({
            map: textureLoader.load("Textures/grass_side.jpg")
        }),
        new THREE.MeshStandardMaterial({
            map: textureLoader.load("Textures/digrass_sidert.jpg")
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
        var E = new Block(Block.position.x, Block.position.y, Block.position.z, Textures)
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
        var BlockCreated = new Block(x * 6, noisev, z * 6, Grass_Block_Textures);
        BlocksPlaced.push(BlockCreated);
        xoff = xoff + inc;
    }
    zoff = zoff + inc;
}
*/

let add = 0
let addd = 0

let BlocksPlaced = [];

var chuncks = [];
var xoff = 0;
var zoff = 0;
var inc = 0.05;
var amplitude = 30 + (Math.random() * 70);
var RenderDistance = 3;
var ChunckSize = 10;
for (var i = 0; i < RenderDistance; i++) {
    for (var j = 0; j < RenderDistance; j++) {
        var chunk = [];
        for (var x = -0 + i * ChunckSize; x < (i * ChunckSize) + ChunckSize; x++) {
            for (var z = -0 + j * ChunckSize; z < (j * ChunckSize) + ChunckSize; z++) {
                xoff = inc * x;
                zoff = inc * z;
                var v = Math.round(noise.perlin2(xoff, zoff) * amplitude / 6) * 6;
                var BlockCreated = new Block(x * 6, v, z * 6, Grass_Block_Textures);
                BlockCreated.disp()
                BlocksPlaced.push(BlockCreated);
                chunk.push(BlockCreated)
            }
        }
        chuncks.push(chunk)
    }
}


var keys = [];
document.addEventListener("keydown", function(e) {
    keys.push(e.key);
    if (e.key == " " && canJump == true) {
        ySpeed = -0.8;
        canJump = false;
    }
});

document.addEventListener("keyup", function(e) {
    var newArr = [];
    for (var i = 0; i < keys.length; i++) {
        if (keys[i] != e.key) {
            newArr.push(keys[i]);
        }
    }
    keys = newArr;
});

var moveSpeed = 0.6;
var ySpeed = 0;
var acc = 0.05;
var canJump = true;
var Detected = false;

function update() {
    if (keys.includes("w")) {
        LockMouse.moveForward(moveSpeed);
        for (var i = 0; i < BlocksPlaced.length; i++) {
            if (camera.position.x <= BlocksPlaced[i].x + 3 && camera.position.x >= BlocksPlaced[i].x - 3 && camera.position.z <= BlocksPlaced[i].z + 3 && camera.position.z >= BlocksPlaced[i].z - 3) {
                if (camera.position.y <= BlocksPlaced[i].y + 9) {
                    LockMouse.moveForward(-1 * moveSpeed);
                }
            }
        }
    }
    if (keys.includes("a")) {
        LockMouse.moveRight(-1 * moveSpeed);
        for (var i = 0; i < BlocksPlaced.length; i++) {
            if (camera.position.x <= BlocksPlaced[i].x + 3 && camera.position.x >= BlocksPlaced[i].x - 3 && camera.position.z <= BlocksPlaced[i].z + 3 && camera.position.z >= BlocksPlaced[i].z - 3) {
                if (camera.position.y <= BlocksPlaced[i].y + 9) {
                    LockMouse.moveRight(moveSpeed);
                }
            }
        }
    }
    if (keys.includes("d")) {
        LockMouse.moveRight(moveSpeed);
        for (var i = 0; i < BlocksPlaced.length; i++) {
            if (camera.position.x <= BlocksPlaced[i].x + 3 && camera.position.x >= BlocksPlaced[i].x - 3 && camera.position.z <= BlocksPlaced[i].z + 3 && camera.position.z >= BlocksPlaced[i].z - 3) {
                if (camera.position.y <= BlocksPlaced[i].y + 9) {
                    LockMouse.moveRight(-1 * moveSpeed);
                }
            }
        }
    }
    if (keys.includes("s")) {
        LockMouse.moveForward(-1 * moveSpeed);
        for (var i = 0; i < BlocksPlaced.length; i++) {
            if (camera.position.x <= BlocksPlaced[i].x + 3 && camera.position.x >= BlocksPlaced[i].x - 3 && camera.position.z <= BlocksPlaced[i].z + 3 && camera.position.z >= BlocksPlaced[i].z - 3) {
                if (camera.position.y <= BlocksPlaced[i].y + 9) {
                    LockMouse.moveForward(moveSpeed);
                }
            }
        }
    }

    camera.position.y = camera.position.y - ySpeed;
    ySpeed = ySpeed + acc;

    for (var i = 0; i < BlocksPlaced.length; i++) {
        if (camera.position.x <= BlocksPlaced[i].x + 3 && camera.position.x >= BlocksPlaced[i].x - 3 && camera.position.z <= BlocksPlaced[i].z + 3 && camera.position.z >= BlocksPlaced[i].z - 3) {
            if (camera.position.y <= BlocksPlaced[i].y + 15 && camera.position.y >= BlocksPlaced[i].y - 15) {
                camera.position.y = BlocksPlaced[i].y + 15
                ySpeed = 0;
                canJump = true;
                Detected = true;
                break;
            }
        }
    }
    if (camera.position.z <= LowestZ() + 60) {
        for (var i = 0; i < chuncks.length; i++) {
            if ((i + 1) % RenderDistance == 0) {
                for (var j = 0; j < chuncks[i].length; j++) {
                    scene.remove(chuncks[i][j].block);
                }
            }
        }

        var newChuncks = [];
        for (var i = 0; i < chuncks.length; i++) {
            if ((i + 1) % RenderDistance != 0) {
                newChuncks.push(chuncks[i]);
            }
        }

        
        var lowestX = LowestX();
        var lowestZ = LowestZ();
        for (var i = 0; i < RenderDistance; i++) {
            var chunk = [];
            for (var xxx = lowestX + (i * ChunckSize * 6); xxx < lowestX + (i * ChunckSize * 6) + (ChunckSize * 6); xxx = xxx + 6) {
                for (var zxx = lowestZ - (ChunckSize * 6); zxx < lowestZ; zxx = zxx + 6) {
                    xoff = inc * xxx / 6;
                    zoff = inc * zxx / 6;
                    var v = Math.round(noise.perlin2(xoff, zoff) * amplitude / 6) * 6;
                    var BlockCreated = new Block(xxx, v, zxx, Grass_Block_Textures);
                    BlockCreated.disp();
                    BlocksPlaced.push(BlockCreated);
                    chunk.push(BlockCreated)
                }
            }
            newChuncks.splice(i * RenderDistance, 0, chunk);
        }
        chuncks = newChuncks;
        
    }

    if (camera.position.z >= HighestZ() - 60) {
        for (var i = 0; i < chuncks.length; i++) {
            if (i % RenderDistance == 0) {
                for (var j = 0; j < chuncks[i].length; j++) {
                    scene.remove(chuncks[i][j].block);
                }
            }
        }

        var newChuncks = [];
        for (var i = 0; i < chuncks.length; i++) {
            if (i % RenderDistance != 0) {
                newChuncks.push(chuncks[i]);
            }
        }

        
        var lowestX = LowestX();
        var highestZ = HighestZ();
        for (var i = 0; i < RenderDistance; i++) {
            var chunk = [];
            for (var xxx = lowestX + (i * ChunckSize * 6); xxx < lowestX + (i * ChunckSize * 6) + (ChunckSize * 6); xxx = xxx + 6) {
                for (var zxx = highestZ + 6; zxx < highestZ + 6  + (ChunckSize * 6); zxx = zxx + 6) {
                    xoff = inc * xxx / 6;
                    zoff = inc * zxx / 6;
                    var v = Math.round(noise.perlin2(xoff, zoff) * amplitude / 6) * 6;
                    var BlockCreated = new Block(xxx, v, zxx, Grass_Block_Textures);
                    BlocksPlaced.push(BlockCreated);
                    chunk.push(BlockCreated)
                }
            }
            newChuncks.splice((i * RenderDistance) + 2, 0, chunk);
        }
        chuncks = newChuncks;
        
        for (var i = 0; i < chuncks.length; i++) {
            if ((i + 1) % RenderDistance == 0) {
                for (var j = 0; j < chuncks[i].length; j++) {
                    chuncks[i][j].disp();
                }
            }
        }
    }


    if (camera.position.x >= HighestX() - 60) {
        for (var i = 0; i < RenderDistance; i++) {
            for (var j = 0; j < chuncks[i].length; j++) {
                scene.remove(chuncks[i][j].block);
            }
        }

        var newChuncks = [];
        for (var i = RenderDistance; i < chuncks.length; i++) {
            newChuncks.push(chuncks[i]);
        }

        
        var highestX = HighestX();
        var lowestZ = LowestZ();
        for (var i = 0; i < RenderDistance; i++) {
            var chunk = [];
            for (var zxx = lowestZ + (ChunckSize * i * 6); zxx < lowestZ + (ChunckSize * i * 6) + (ChunckSize * 6); zxx = zxx + 6) {
                for (var xxx = highestX + 6; xxx < highestX + 6 + (ChunckSize * 6); xxx = xxx + 6) {
                    xoff = inc * xxx / 6;
                    zoff = inc * zxx / 6;
                    var v = Math.round(noise.perlin2(xoff, zoff) * amplitude / 6) * 6;
                    var BlockCreated = new Block(xxx, v, zxx, Grass_Block_Textures);
                    BlocksPlaced.push(BlockCreated);
                    chunk.push(BlockCreated)
                }
            }
            newChuncks.splice(chuncks.length - (RenderDistance - i), 0, chunk);
        }
        chuncks = newChuncks;
        
        for (var i = chuncks.length - RenderDistance; i < chuncks.length; i++) {
            for (var j = 0; j < chuncks[i].length; j++) {
                chuncks[i][j].disp();
            }
        }
    }

    if (camera.position.x <= LowestX() + 60) {
        for (var i = chuncks.length - RenderDistance; i < chuncks.length; i++) {
            for (var j = 0; j < chuncks[i].length; j++) {
                scene.remove(chuncks[i][j].block);
            }
        }

        var newChuncks = [];
        for (var i = 0; i < chuncks.length - RenderDistance; i++) {
            newChuncks.push(chuncks[i]);
        }

        
        var lowestX = LowestX();
        var lowestZ = LowestZ();
        for (var i = 0; i < RenderDistance; i++) {
            var chunk = [];
            for (var zxx = lowestZ + (ChunckSize * i * 6); zxx < lowestZ + (ChunckSize * i * 6) + (ChunckSize * 6); zxx = zxx + 6) {
                for (var xxx = lowestX - (ChunckSize * 6); xxx < lowestX; xxx = xxx + 6) {
                    xoff = inc * xxx / 6;
                    zoff = inc * zxx / 6;
                    var v = Math.round(noise.perlin2(xoff, zoff) * amplitude / 6) * 6;
                    var BlockCreated = new Block(xxx, v, zxx, Grass_Block_Textures);
                    BlocksPlaced.push(BlockCreated);
                    chunk.push(BlockCreated)
                }
            }
            newChuncks.splice(i, 0, chunk);
        }
        chuncks = newChuncks;
        
        for (var i = 0; i < RenderDistance; i++) {
            for (var j = 0; j < chuncks[i].length; j++) {
                chuncks[i][j].disp();
            }
        }
    }
}

function LowestX() {
    var xPosArray = [];
    for (var i = 0; i < chuncks.length; i++) {
        for (var j = 0; j < chuncks[i].length; j++) {
            xPosArray.push(chuncks[i][j].x);
        }
    }
    return Math.min.apply(null, xPosArray);
}

function HighestX() {
    var xPosArray = [];
    for (var i = 0; i < chuncks.length; i++) {
        for (var j = 0; j < chuncks[i].length; j++) {
            xPosArray.push(chuncks[i][j].x);
        }
    }
    return Math.max.apply(null, xPosArray);
}

function LowestZ() {
    var zPosArray = [];
    for (var i = 0; i < chuncks.length; i++) {
        for (var j = 0; j < chuncks[i].length; j++) {
            zPosArray.push(chuncks[i][j].z);
        }
    }
    return Math.min.apply(null, zPosArray);
}

function HighestZ() {
    var zPosArray = [];
    for (var i = 0; i < chuncks.length; i++) {
        for (var j = 0; j < chuncks[i].length; j++) {
            zPosArray.push(chuncks[i][j].z);
        }
    }
    return Math.max.apply(null, zPosArray);
}

camera.position.x = chuncks[0][0].x + RenderDistance * ChunckSize / 2;
camera.position.y = 50;
camera.position.z = chuncks[0][0].z + RenderDistance * ChunckSize / 2;

function animate() {
    requestAnimationFrame(animate);
    update()
    Renderer.render(scene, camera);
}

animate();
