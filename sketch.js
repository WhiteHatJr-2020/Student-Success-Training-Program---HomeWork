var splashScreen, gameState="wait";
var playButton, aboutButton;
var health = 100, max_health = 100;
var score=0;
var fruitsGroup, bombsGroup, coinsGroup;
var gameOver;
var FruitSound;
function preload(){
    splashScreen = loadImage("Fruit Splasher.gif");
    bgScreen1 = loadImage("bgScreen1.png");
    fruit1 = loadImage("Apple.png");
    fruit2 = loadImage("Gauva.png");
    fruit3 = loadImage("Grapes.png");
    fruit4 = loadImage("Orange.png");
    fruit5 = loadImage("Strawberry.png");

    FruitSound = loadSound("Sound.mp3");
    BombSound = loadSound("BombSound.mp3");

    obstacleImage = loadImage("Bomb.png");
    knifeImage = loadImage("Knife.png");

    bgScreen2 = loadImage("LevelUpBackground.png");
    coinsImage = loadImage("Coins.png");

    // gameOverImg = loadImage("GameOver.png");
}

function setup(){
    createCanvas(windowWidth, windowHeight);

    fruitsGroup = new Group();
    bombGroup = new Group();
    coinsGroup = new Group(); 
    //playButton = createButton("PLAY");
    playButton = createImg("playButton.png");
    playButton.position(550, 400);
    playButton.size(200, 70);
    playButton.hide();

    aboutButton = createImg("about.png");
    aboutButton.position(40, 10);
    aboutButton.size(100, 100);
    aboutButton.hide();

    knife = createSprite(50,180,20,50);
    knife.addImage(knifeImage);
    knife.scale = 0.6;
    knife.visible = false;
    // gameOver = createSprite(300,100);
    // gameOver.addImage(gameOverImg);
    // gameOver.visible = false;
}

function draw(){
    if(gameState == "wait"){
        background(splashScreen);
        playButton.show();
        aboutButton.show();
        //refresh();
    }
    
    playButton.mousePressed(()=>{
        background(bgScreen1)
        gameState="play";
        playButton.hide();
        aboutButton.hide();
    });

    if(gameState == "play"){
        background(bgScreen1)
        noStroke()
        fill("White")
        text("Score: "+ score, 1200,50);
        text("Score 1000 points to move to the next level", 600,50);
        knife.visible = true;
        healthLevel();
        knife.x = mouseX;
        knife.y = mouseY;
        spawnFruits();
        spwanBomb();

        for(var i=0;i<bombGroup.length; i++){
            if(knife.isTouching(bombGroup.get(i))){
                BombSound.play();
                health -= 10
                bombGroup.get(i).remove()
                // knife.destroy();
            }
        }

        for(var i=0;i<fruitsGroup.length; i++){
            if(knife.isTouching(fruitsGroup.get(i))){
                // health -= 10
                FruitSound.play();
                fruitsGroup.get(i).remove()
                score = score + 50;
                // knife.destroy();
            }
        }

        if(health == 0){
            gameState = "end"
        }
        // knife.collide(fruitsGroup, removeFruits);

        // if(fruitsGroup.isTouching(knife)){
        //     //fruitsGroup.hide();
        //     score = score + 5;
        // }
        
        if(score == 1000){
            gameState = "Level up";
            background("lightblue")
            fruitsGroup.destroyEach();
            bombGroup.destroyEach();
            knife.visible = false;
            alert("Congratulations !!", "Splash the Fruits and hit the coins to Gain More Power!","LevelUp.png", "Level up");
        }
        // if(bombGroup.isTouching(knife)){
        //     gameState = "end"
        // }
    }

    if(gameState == "Level up"){
        image(bgScreen2, -36000, 0, 45000, 1700);
        noStroke()
        fill("Black")
        text("Score: "+ score, 1200,50);
        text("Score 1000 more points to win", 600,50);
        knife.visible = true;
        healthLevel();
        knife.x = mouseX;
        knife.y = mouseY;
        spawnFruits();
        spwanBomb();
        spwanCoins();

        for(var i=0;i<bombGroup.length; i++){
            if(knife.isTouching(bombGroup.get(i))){
                BombSound.play();
                health -= 10
                bombGroup.get(i).remove()
                // knife.destroy();
            }
        }

        for(var i=0;i<fruitsGroup.length; i++){
            if(knife.isTouching(fruitsGroup.get(i))){
                // health -= 10
                FruitSound.play();
                fruitsGroup.get(i).remove()
                score = score + 50;
                // knife.destroy();
            }
        }

        for(var i=0;i<coinsGroup.length; i++){
            if(knife.isTouching(coinsGroup.get(i))){
                if(health == 100){
                    health = 100
                }
                else{
                    health += 10
                }
                coinsGroup.get(i).remove()
                // score = score + 50;
                // knife.destroy();
            }
        }

        if(health == 0){
            gameState = "end"
        }
        
        if(score == 2000){
            gameState = "won";
        }
    }

    if(gameState == "end"){
        // End game
        background("lightblue")
        fruitsGroup.destroyEach();
        bombGroup.destroyEach();
        knife.visible = false;
        alert("You Lost !!", "Better Luck Next Time !","GameOver.png", "reload");
    }

    if(gameState == "won"){
        background("lightblue")
        fruitsGroup.destroyEach();
        bombGroup.destroyEach();
        knife.visible = false;
        alert("You Won !!", "You splashed all the fruits !","GameWon.png", "reload");
    }

    aboutButton.mousePressed(()=>{
        background("lightblue")
        gameState="about"
    });

    if(gameState == "about"){
        //aboutGame();
        alert("Game Info !!", "Splash the fruits !!", "FruitSplasher.png", "wait");
    }

    drawSprites();
}

function alert(title, text, image, gamestate){
    swal({
        title: title,
        text: text,
        textAlign: "center",
        imageUrl: image,
        imageSize: "200x200",
        confirmButton: "Splash",
        confirmButtonColor: "Red"
    },
    function(){
        if(gamestate == "reload"){
            window.location.reload();
        }
        else{
            gameState = gamestate;
        }
    }
    )
}

function healthLevel(){
    stroke("lightblue")
    strokeWeight(7)
    noFill()
    //rectMode(CENTER)
    rect(200, 80, 200, 20)

    noStroke()
    fill("blue")
    //rectMode(CENTER)
    rect(200, 80, map(health, 0, max_health, 0, 200), 20)
}

function spwanBomb(){
    if (frameCount % 100 == 0) {
        var bomb = createSprite(1200,1200,10,40);
        // bomb.y = Math.round(random(10,1200));
        bomb.x = Math.round(random(100, 1200));
        bomb.velocityY = -(6 + 3*score/100);
        bomb.addImage(obstacleImage);

        bomb.scale = 0.25;

        bombGroup.add(bomb);
    }
}

function spwanCoins(){
    if (frameCount % 100 == 0) {
        var coins = createSprite(1200,1200,10,40);
        // coins.y = Math.round(random(10,1200));
        coins.x = Math.round(random(100, 1200));
        coins.velocityY = -(6 + 3*score/100);
        coins.addImage(coinsImage);

        coins.scale = 0.6;

        coinsGroup.add(coins);
    }
}

function spawnFruits() {
    if (frameCount % 100 == 0) {
      var fruit = createSprite(1200,1200,10,40);
      // fruit.y = Math.round(random(10,1200));
      fruit.x = Math.round(random(100, 1200));
      fruit.velocityY = -(6 + 3*score/100);
      
      //generate random obstacles
      var rand = Math.round(random(1,5));
      switch(rand) {
        case 1: fruit.addImage(fruit1);
                break;
        case 2: fruit.addImage(fruit2);
                break;
        case 3: fruit.addImage(fruit3);
                break;
        case 4: fruit.addImage(fruit4);
                break;
        case 5: fruit.addImage(fruit5);
                break;
        default: break;
      }
      
      //assign scale and lifetime to the obstacle           
      fruit.scale = 0.5;

      //fruit.lifetime = 300;
      //add each obstacle to the group
      fruitsGroup.add(fruit);

    }
    
  }