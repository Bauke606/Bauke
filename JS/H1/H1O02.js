let player;
let gravity = 0.6;

// Level design: platformen [x, y, breedte, hoogte]
let platforms = [,
 ,
 ,
 ,
 ,
  [350, 80, 40, 20] // Laatste platform voor de finish
];

// Finish doel [x, y, breedte, hoogte]
let goal =;

let gameState = "PLAYING"; // PLAYING, WIN, LOSE

function setup() {
  createCanvas(600, 400);
  resetGame();
}

function draw() {
  background(135, 206, 235); // Mooie blauwe lucht

  if (gameState === "PLAYING") {
    // Speler updaten en tekenen
    player.update();
    player.show();

    // Platformen tekenen en botsingen controleren
    fill(34, 139, 34); // Grasgroen
    noStroke();
    for (let p of platforms) {
      rect(p[0], p[1], p[2], p[3], 4);
      player.checkCollision(p);
    }

    // Finish tekenen
    fill(255, 215, 0); // Goud/Geel
    rect(goal[0], goal[1], goal[2], goal[3]);
    
    // Check of finish is bereikt
    if (player.hitsGoal(goal)) {
      gameState = "WIN";
    }

    // Check of speler af is (uit het scherm gevallen)
    if (player.y > height) {
      gameState = "LOSE";
    }

    // Controls uitleg in beeld
    fill(0);
    textSize(14);
    textAlign(LEFT);
    text("Besturing: Pijltjes / A-D + W/Spatie om te springen", 10, 25);

  } else if (gameState === "WIN") {
    drawEndScreen("GEWONNEN! 🎉", color(0, 128, 0));
  } else if (gameState === "LOSE") {
    drawEndScreen("GAME OVER 😢", color(178, 34, 34));
  }
}

// Controls afhandeling
function keyPressed() {
  if ((key === ' ' || keyCode === UP_ARROW || key === 'w') && player.isGrounded) {
    player.jump();
  }
  if ((gameState === "WIN" || gameState === "LOSE") && key === 'r') {
    resetGame();
  }
}

function resetGame() {
  player = new Player();
  gameState = "PLAYING";
}

function drawEndScreen(message, textColor) {
  textAlign(CENTER, CENTER);
  textSize(40);
  fill(textColor);
  text(message, width / 2, height / 2 - 20);
  
  textSize(20);
  fill(0);
  text("Druk op 'R' om opnieuw te spelen", width / 2, height / 2 + 30);
}

// Speler Klasse
class Player {
  constructor() {
    this.x = 80;
    this.y = 300;
    this.w = 20;
    this.h = 20;
    this.vx = 0;
    this.vy = 0;
    this.speed = 5;
    this.jumpForce = -12;
    this.isGrounded = false;
  }

  update() {
    // Horizontale beweging
    this.vx = 0;
    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) { // Pijltje links of A
      this.vx = -this.speed;
    }
    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) { // Pijltje rechts of D
      this.vx = this.speed;
    }

    this.x += this.vx;

    // Zwaartekracht toepassen
    this.vy += gravity;
    this.y += this.vy;

    // Reset grounded status (wordt gecheckt bij platform botsingen)
    this.isGrounded = false;
  }

  jump() {
    this.vy = this.jumpForce;
    this.isGrounded = false;
  }

  show() {
    fill(220, 20, 60); // Crimson rood
    rect(this.x, this.y, this.w, this.h, 3);
  }

  checkCollision(p) {
    // Check of de speler overlapt met het platform
    if (this.x + this.w > p[0] && this.x < p[0] + p[2]) {
      if (this.y + this.h > p[1] && this.y + this.h - this.vy <= p[1] + 10) {
        // Landen op het platform
        this.y = p[1] - this.h;
        this.vy = 0;
        this.isGrounded = true;
      }
    }
  }

  hitsGoal(g) {
    return (this.x + this.w > g[0] && this.x < g[0] + g[2] &&
            this.y + this.h > g[1] && this.y < g[1] + g[3]);
  }
}