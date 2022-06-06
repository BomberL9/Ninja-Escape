var PLAY = 1;
var END = 0;
var gameState = PLAY;

var score;

var gameOver, gameOverImg;
var restart, restartImg;

var jungleImg, jungle;

var ninja, ninja_running, ninja_jumping;

var explosion, explosion_animation, explosion_sound;
var gambiarra;

var enemyR, enemyB, enemyG;
var red_running, blue_running, green_running;
var redGroup, blueGroup, greenGroup;

var invisibleGround;

var themeSound, jumpSound;

function preload(){
    jungleImg = loadImage("background.png");
    gameOverImg = loadImage("gameOver.png");
    restartImg = loadImage("restart.png");
    
    ninja_running = loadAnimation("ninja-running1.png","ninja-running2.png","ninja-running3.png","ninja-running4.png","ninja-running5.png","ninja-running6.png");
    ninja_jumping = loadAnimation("ninja-jumping.png");
    explosion_animation = loadAnimation("explosion1.png","explosion2.png","explosion3.png","explosion4.png","explosion5.png","explosion6.png","explosion7.png");
    red_running = loadAnimation("Red1.png","Red2.png","Red3.png","Red4.png");
    blue_running = loadAnimation("Blue1.png","Blue2.png","Blue3.png","Blue4.png");
    green_running = loadAnimation("Green1.png","Green2.png","Green3.png","Green4.png");

    explosion_sound = loadSound("explosion.mp3");
    themeSound = loadSound("theme.mp3");
    jumpSound = loadSound("jump.mp3");
}

function setup() {
    createCanvas(1200, 300);
    
    score = 0;

    //toca a música tema
    themeSound.play();

    jungle = createSprite(600, 150);
    jungle.addImage("jungle", jungleImg);
    jungle.scale = 2;
    jungle.velocityX = -2;

    
    ninja = createSprite(100, 200);
    ninja.addAnimation("running", ninja_running);
    ninja.addAnimation("jumping", ninja_jumping);
    
    ninja.setCollider("circle", 0, 0, 60);
    ninja.debug = false;

    
    explosion = createSprite(ninja.x, ninja.y);
    explosion.visible = false;
    
    gambiarra = createSprite(100, 180, 5, 5);
    gambiarra.visible = false;

    invisibleGround = createSprite(200, 290, 600, 20);
    invisibleGround.visible = false;

    
    gameOver = createSprite(600, 50);
    gameOver.addImage("gameOver", gameOverImg);
    gameOver.visible = false;

    restart = createSprite(600, 170);
    restart.addImage("restart", restartImg);
    restart.scale = 0.3;
    restart.visible = false;


    redGroup = new Group();
    blueGroup = new Group();
    greenGroup = new Group();
}

function draw() {
    background(0);
    
    //ninja colide com o chão invisível
    ninja.collide(invisibleGround);    
    
    if (gameState == PLAY){
    
        score = score + Math.round(getFrameRate()/60);

        //adiciona o movimento da floresta
        if(jungle.x < 230){
            jungle.x = 600;
        }
        
        //cria o pulo do ninja
        if(keyDown("space") && ninja.y >= 100){
            ninja.velocityY = -12;
            jumpSound.play();
        }

        //cria a troca de animações entre correr e pular
        if(ninja.y < 200){
            ninja.changeAnimation("jumping", ninja_jumping)
        }
        else{
            ninja.changeAnimation("running", ninja_running);
        }
        
        //dá gravidade ao ninja
        ninja.velocityY = ninja.velocityY + 0.8;



        //variável de escolha aleatória
        var select_enemy = Math.round(random(1,3));
        //escolha aleatória
        if(World.frameCount % 150 === 0){
            if(select_enemy === 1){
                spawRed();
            }
            if(select_enemy === 2){
                spawBlue();
            }
            if(select_enemy === 3){
                spawGreen();
            }
        }
        
        //fim de jogo
        if(redGroup.isTouching(ninja)||blueGroup.isTouching(ninja)||greenGroup.isTouching(ninja)){
            //toca a animação de explosão
            explosion.addAnimation("animation", explosion_animation);
            explosion.visible = true;
            
            gambiarra.velocityY = 1;
            
            gameState = END;
        }
    }
    
    if(gameState == END){
        themeSound.stop();
        
        gameOver.visible = true;
        restart.visible = true;

        redGroup.setVelocityXEach(0);
        blueGroup.setVelocityXEach(0);
        greenGroup.setVelocityXEach(0);
        
        redGroup.setLifetimeEach(-1);
        blueGroup.setLifetimeEach(-1);
        greenGroup.setLifetimeEach(-1);

        jungle.velocityX = 0;

        ninja.visible = false;

        if(gambiarra.y > 260){
            explosion_sound.stop();
        }else{
            explosion_sound.play();
        }

        if(mousePressedOver(restart)){
            reset();
        }
    }
    drawSprites();
    
    //mostra a pontuação
    textSize(20);
    textFont("Papyrus");
    fill("yellow");
    text("Score: "+score, 1075, 30);
}

function spawRed(){
    enemyR = createSprite(1000, 250);
    enemyR.addAnimation("running", red_running);
    enemyR.velocityX = -8;
    enemyR.lifetime = 150;
    redGroup.add(enemyR);
}

function spawBlue(){
    enemyB = createSprite(1000, 250);
    enemyB.addAnimation("running", blue_running);
    enemyB.velocityX = -12;
    enemyB.lifetime = 150;
    blueGroup.add(enemyB);
}


function spawGreen(){
    enemyG = createSprite(1000, 250);
    enemyG.addAnimation("running", green_running);
    enemyG.velocityX = -20;
    enemyG.lifetime = 150;
    greenGroup.add(enemyG);
}

function reset(){
    gameState = PLAY;

    score = 0;
    
    themeSound.play();

    gameOver.visible = false;
    restart.visible = false;

    redGroup.destroyEach();
    blueGroup.destroyEach();
    greenGroup.destroyEach();

    ninja.visible = true;
    
    explosion.visible = false;

    jungle.velocityX = -2;

    gambiarra.y = 180;
}