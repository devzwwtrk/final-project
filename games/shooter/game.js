let highScore = 0;
let animationID = null;
let intervalID = null;

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
const scoreel = document.getElementById('scorel')
const recordel = document.querySelector('#recordl')
const startbtn = document.querySelector('#startBtn')
const modal = document.querySelector('.game-modal')
const bigscore = document.getElementById('bigscore')



canvas.width = window.innerWidth - 6;
canvas.height = window.innerHeight - 6;
highScore = localStorage.getItem('shooterrecord') || 0;
recordel.textContent = highScore;

class CircleEntity {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }
    draw() {
        c.beginPath();
        c.fillStyle = this.color;
        c.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        c.fill();
    }
}


class Player extends CircleEntity {
    constructor(x, y, radius, color) {
        super(x, y, radius, color)
        this.score = 0;
    }
}

class Projectile extends CircleEntity {
    constructor (x, y, radius, color, velocity, speed=6) {
        super(x, y, radius, color);
        this.velocity = velocity;
        this.speed = speed;
    }

   update() {
        this.draw();
        this.x = this.x + this.velocity.x  * this.speed;
        this.y = this.y + this.velocity.y * this.speed;
    }
}

class Enemy extends CircleEntity {
    constructor(x, y, radius, color, velocity, speed=2) {
        super(x, y, radius, color);
        this.velocity = velocity;
        this.speed = window.innerWidth < 768 ? 3 : speed;
    }
    update() {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }
}

const friction = 0.99;
class Particle extends CircleEntity {
    constructor(x, y, radius, color, velocity) {
        super(x, y, radius, color);
        this.velocity = velocity;
        this.speed = Math.random() * 10;
        this.alpha = 1;
    }
    draw() {
        c.save();
        c.globalAlpha = this.alpha;
        super.draw()
        c.restore();
    };
      update() {
        this.draw();
        this.velocity.x * friction;
        this.velocity.y * friction;
        this.x = this.x + this.velocity.x * this.speed;
        this.y = this.y + this.velocity.y * this.speed;
        this.alpha -= 0.01;
    }
}


let player = new Player(canvas.width/2, canvas.height/2, 10, '#fff');
let projectiles = [];
let enemies = [];
let particles = [];

function init() {
    player = new Player(canvas.width/2, canvas.height/2, 10, '#fff');
    projectiles = [];
    enemies = [];
    particles = [];
    player.score = 0;
    scoreel.textContent = player.score;
    highScore = localStorage.getItem('shooterrecord') || 0;
    recordel.textContent = highScore;
    bigscore.textContent = player.score;
}


function spawnEnemy() {
    intervalID = setInterval(()=> {
        const radius = 6 + Math.random() * (30 - 6);
        let x; 
        let y;

        if(Math.random() < 0.5) {
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
            y = Math.random() * canvas.height;
        } else {
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
            x = Math.random() * canvas.width
        }

        const angle = Math.atan2(player.y - y, player.x - x)
        const color = `hsl(${Math.random() * 360}, 50%, 50%)`;
        const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }
        enemies.push(new Enemy(x, y, radius, color, velocity));
    }, 1000);
}

function animate() {
    animationID = requestAnimationFrame(animate);
    c.fillStyle = 'rgba(0, 0, 0, 0.2)';
    c.fillRect(0, 0, canvas.width, canvas.height);
    player.draw();

    particles.forEach((particle, particleIndex)=>{
        if (particle.alpha < 0) {
            particles.splice(particleIndex, 1);
        } else {
            particle.update();
        }
    });


    projectiles.forEach((item, projIndex) => {
        item.update();
        if (item.x + item.radius < 0 ||
            item.x - item.radius > canvas.width ||
            item.y + item.radius < 0 ||
            item.y - item.radius > canvas.height) {
                setTimeout(()=> {projectiles.splice(projIndex, 1);}, 1);
            }
    });
    enemies.forEach((enemy, enemyIndex) => {
        enemy.update();

        //clash of enemy and player
        const distance = Math.hypot(player.x - enemy.x, player.y - enemy.y);

        //emd of game
        if(distance - enemy.radius - player.radius < 1) {
            console.log('Game over')
            cancelAnimationFrame(animationID);
            clearInterval(intervalID);
            animationID = intervalID = null;
            if (player.score > highScore) {
                highScore = player.score;
                localStorage.setItem('shooterrecord', highScore);
            }
            scoreel.textContent = player.score;
            recordel.textContent = highScore;
            modal.style.display = 'flex';
            bigscore.textContent = player.score;
        }

        projectiles.forEach((proj, projIndex)=>{
            const distance = Math.hypot(proj.x - enemy.x, proj.y - enemy.y);

            if(distance - enemy.radius - proj.radius < 1) {
                for (let i = 0; i < Math.random() * (enemy.radius * 5); i++) {
                    particles.push(new Particle(
                        proj.x, proj.y,
                        1 + Math.random() * 4,
                        enemy.color,
                        {x: Math.random() - 0.5, y: Math.random() - 0.5}
                    ));
                }
                if (enemy.radius - 10 > 5) {
                    player.score += 10;
                    scoreel.textContent = player.score
                    setTimeout(()=> {
                        gsap.to(enemy, {radius: enemy.radius - 10});
                        projectiles.splice(projIndex, 1);
                    }, 0);
                } else {
                    player.score += 30;
                    scoreel.textContent = player.score;
                    setTimeout(()=> {
                    enemies.splice(enemyIndex, 1);
                    projectiles.splice(projIndex, 1);
                }, 0);
                }
            }
        });
    });

}

function shoot(x, y) {
    const angle = Math.atan2(y - player.y, x - player.x);
    const velocity = {
        x: Math.cos(angle),
        y: Math.sin(angle)
    };
    projectiles.push(new Projectile(
        player.x,
        player.y,
        5,
        '#fff',
        velocity
    ));
}

window.addEventListener('click', (e)=> {
    shoot(e.clientX, e.clientY);
});

window.addEventListener('touchstart', (e)=>{
    const touch = e.touches[0];
    shoot(touch.clientX, touch.clientY);
});


startbtn.addEventListener('click', function() {
    init();
    animate();
    spawnEnemy();
    modal.style.display = 'none';
});
