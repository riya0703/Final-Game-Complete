const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;

var engine, world;
var blocks, monsters, player, ground
var size = 1
var count = 0

var score = 0

var lives = 3

var gameState = "play"


function preload() {
    groundImg = loadImage("img.jpg")
    blockImg = loadImage("stages.png")
    playerImg = loadImage("player.png")
    monster1Img = loadImage("monster.png")

    monster3Img = loadImage("monster3.png")

    powerImg = loadImage("magic.png")

}

function setup() {
    var canvas = createCanvas(displayWidth, displayHeight);
    engine = Engine.create();
    world = engine.world;

    ground = createSprite(400, 400, 20, 20)
    ground.addImage(groundImg)
    ground.velocityY = 3
    ground.y = ground.height / 2

    ground.scale = 3

    blocksGroup = createGroup()
    powerGroup = createGroup()
    monsterGroup = createGroup()

    player = createSprite(50, displayHeight - 250, 30, 30)
    player.addImage(playerImg)
    player.scale = 0.29

    invisibleGround = createSprite(displayWidth / 2, displayHeight - 140, displayWidth, 10)
    invisibleGround.visible = false

    player.debug = false

}

function draw() {
    if (gameState === "play") {
        if (ground.y > 400) {
            ground.y = ground.height / 2
        }
        if (keyDown(LEFT_ARROW)) {
            player.x = player.x - 20
        }

        if (keyDown(RIGHT_ARROW)) {
            player.x = player.x + 20
        }

        if (keyDown(UP_ARROW)) {
            player.velocityY = -8
        }

        player.velocityY = player.velocityY + 0.5

        if (player.x < 50) {
            player.x = 50
        }

        spawnBlocks()
        if (player.isTouching(blocksGroup)) {
            player.velocityY = 0
        }
        spawnMonsters()

        player.collide(invisibleGround)

        spawnPowerBlocks()
        if (player.isTouching(powerGroup)) {
            powerGroup.destroyEach()
            var x = Math.round(random(1, 10))
            if (x === 10) {
                player.scale = 0.2
            }
            else {
                player.scale = 0.3
            }

        }

        if (player.isTouching(monsterGroup)) {
            // count=count+1
            lifeOver()
        }
        score = score + Math.round(frameCount / 100)
        if (score >= 10000) {
            gameState = "end"
        }
    }

    else if (gameState === "end") {
        ground.velocityY = 0
        player.velocityY = 0
        blocksGroup.setVelocityYEach(0)
        monsterGroup.setVelocityYEach(0)
        powerGroup.setVelocityYEach(0)
        blocksGroup.destroyEach()
        monsterGroup.destroyEach()
        powerGroup.destroyEach()
        player.destroy()


    }

    else if (gameState === "over") {
        ground.velocityY = 0
        player.velocityY = 0
        blocksGroup.setVelocityYEach(0)
        monsterGroup.setVelocityYEach(0)
        powerGroup.setVelocityYEach(0)
        blocksGroup.destroyEach()
        monsterGroup.destroyEach()
        powerGroup.destroyEach()
        player.destroy()
    }

    // player.scale=0.2
    drawSprites()
    fill("white")
    textSize(35)
    text("Dist : " + score, ground.width + 550, ground.height - 400)
    text("Lives : " + lives, ground.width + 550, ground.height - 350)

    if (gameState === "end") {
        background("white")
        textSize(50)
        fill("black")
        text("GAME WON :) :)", 750, 300)
    }

    if (gameState === "over") {
        background("white")
        textSize(50)
        fill("black")
        text("GAME OVER", 750, 300)
    }
}





function spawnMonsters() {
    if (frameCount % 100 === 0) {
        monster = createSprite(100, 0, 10, 10)
        monster.velocityY = 16
        monster.scale = 0.3
        monster.x = random(100, 1000)

        var x = Math.round(random(1, 2))
        if (x === 1) {
            monster.addImage(monster1Img)
        }
        else {
            monster.addImage(monster3Img)
        }
        monsterGroup.add(monster)
    }


}
function spawnBlocks() {
    if (frameCount % 50 === 0) {
        blocks = createSprite(100, 0, 10, 10)
        blocks.addImage(blockImg)
        blocks.velocityY = 6
        blocks.scale = 0.4
        blocks.x = random(100, 800)
        blocksGroup.add(blocks)
        blocks.debug = true
        blocks.setCollider("rectangle", 0, 0, 120, 50)
        blocks.depth = player.depth
        player.depth = player.depth + 1
    }
}

function spawnPowerBlocks() {
    if (frameCount % 200 === 0) {
        power = createSprite(100, 30, 10, 10)
        power.x = random(100, 800)
        power.addImage(powerImg)
        power.scale = 0.2
        power.velocityY = 7
        powerGroup.add(power)
    }
}

function lifeOver() {
    lives = lives - 1
    reset()
    if (lives >= 1) {
        gameState = "play"

    }
    else {
        gameState = "over"
    }
}

function reset() {
    player.x = 500
    player.y = displayHeight - 240
    player.scale = 0.2
}

