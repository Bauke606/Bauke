const oudCanvas = document.getElementById("multiplayerCanvas");
if (oudCanvas) oudCanvas.remove();

// Canvas aanmaken
const canvas = document.createElement('canvas');
canvas.id = "multiplayerCanvas";
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);

// Fullscreen instellen
canvas.style.position = "fixed";
canvas.style.top = "0";
canvas.style.left = "0";
canvas.style.width = "100vw";
canvas.style.height = "100vh";
canvas.style.zIndex = "99999";
canvas.style.background = "#0c0f1d";

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// 3 Spelers instellen met eigen besturing en kleuren
const players = [
    {
        id: 1,
        x: 150,
        y: canvas.height / 2,
        w: 30,
        h: 30,
        color: "#00ffcc", // Neon blauw/groen
        score: 0,
        cooldown: 0,
        leftKey: "a",
        rightKey: "d",
        shootKey: "w",
        bulletDir: -1 // Schiet omhoog/opzij afhankelijk van setup, hier maken we het een arena: ze schieten naar waar ze kijken (omhoog)
    },
    {
        id: 2,
        x: canvas.width / 2,
        y: canvas.height / 2,
        w: 30,
        h: 30,
        color: "#ff0055", // Neon rood/roze
        score: 0,
        cooldown: 0,
        leftKey: "ArrowLeft",
        rightKey: "ArrowRight",
        shootKey: "ArrowUp",
        bulletDir: -1
    },
    {
        id: 3,
        x: canvas.width - 150,
        y: canvas.height / 2,
        w: 30,
        h: 30,
        color: "#ffcc00", // Neon geel
        score: 0,
        cooldown: 0,
        leftKey: "j",
        rightKey: "l",
        shootKey: "i",
        bulletDir: -1
    }
];

let bullets = [];
const keys = {};

window.addEventListener("keydown", e => keys[e.key] = true);
window.addEventListener("keyup", e => keys[e.key] = false);

// Game Loop
function loop() {
    if (!document.getElementById("multiplayerCanvas")) return;

    // Achtergrond wissen met een lichte sleep-effect
    ctx.fillStyle = "rgba(12, 15, 29, 0.4)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Teken scorebord bovenaan
    ctx.fillStyle = "#ffffff";
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.fillText(`P1 (A-D + W): ${players[0].score}  |  P2 (Pijltjes): ${players[1].score}  |  P3 (J-L + I): ${players[2].score}`, canvas.width / 2, 40);

    // Update en teken spelers
    players.forEach(p => {
        // Besturing toepassen
        if (keys[p.leftKey] && p.x > 0) p.x -= 6;
        if (keys[p.rightKey] && p.x < canvas.width - p.w) p.x += 6;

        // Schieten
        if (keys[p.shootKey] && p.cooldown <= 0) {
            bullets.push({
                x: p.x + p.w / 2 - 3,
                y: p.y - 10,
                w: 6,
                h: 15,
                vy: -10, // Kogel gaat omhoog
                playerId: p.id,
                color: p.color
            });
            p.cooldown = 15; // Tijd tussen schoten
        }
        if (p.cooldown > 0) p.cooldown--;

        // Schip tekenen (Driehoek)
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.moveTo(p.x + p.w / 2, p.y);
        ctx.lineTo(p.x, p.y + p.h);
        ctx.lineTo(p.x + p.w, p.y + p.h);
        ctx.closePath();
        ctx.fill();
    });

    // Update en teken kogels
    bullets.forEach((b, bIdx) => {
        b.y += b.vy;

        ctx.fillStyle = b.color;
        ctx.fillRect(b.x, b.y, b.w, b.h);

        // Check of kogel buiten het scherm vliegt
        if (b.y < 0 || b.y > canvas.height) {
            bullets.splice(bIdx, 1);
            return;
        }

        // Check of kogel een andere speler raakt
        players.forEach(p => {
            // Je kunt jezelf niet neerschieten
            if (b.playerId !== p.id) {
                if (b.x < p.x + p.w && b.x + b.w > p.x && b.y < p.y + p.h && b.y + b.h > p.y) {
                    // Raak! Geef punten aan de schutter
                    const schutter = players.find(pl => pl.id === b.playerId);
                    if (schutter) schutter.score++;
                    
                    // Reset de geraakte speler naar een willekeurige plek
                    p.x = Math.random() * (canvas.width - 50) + 20;
                    
                    // Verwijder kogel
                    bullets.splice(bIdx, 1);
                }
            }
        });
    });

    requestAnimationFrame(loop);
}

// Start de multiplayer chaos
loop();
console.log("3-Player game gestart! Klik op het scherm om te spelen.");