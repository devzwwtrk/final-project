const toggleAqua = document.createElement('button')
toggleAqua.textContent = '🌊';
toggleAqua.id = 'toggle-aquarium';
document.body.append(toggleAqua)


const canvas = document.createElement('canvas');
canvas.id = 'aquarium-canvas';
document.body.append(canvas);

canvas.width = innerWidth - 4;
canvas.height = innerHeight - 4;

let circleArray;
const c = canvas.getContext('2d');
const colors = ['#F8F7FF', 'B8B8FF', '#9381FF', '#cdb4db', '#b3b7ee'];
let animeteId = null;
let active = false;

const animationSpeed = window.innerWidth <= 768 ? 1.5 : 3;
const minSize = window.innerWidth <= 760 ? 5 : 10;
const maxSize = window.innerWidth <= 768 ? 12 : 30;
const count = window.innerWidth <= 768 ? 2000 : 2500;

function Circle(x,y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = `${colors[Math.floor(Math.random() * colors.length)]}`;
    this.direction = {
        dx: (Math.random() - 0.5) * animationSpeed,
        dy: (Math.random() - 0.5) * animationSpeed    
    };
    this.changeColor = function() {
        this.color = `${colors[Math.floor(Math.random() * colors.length)]}`;
    };
    this.draw = function() {
        c.beginPath();  
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = this.color;
        c.lineWidth = 4;
        c.fill ();
    };
    this.update = function() {
        if(this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.direction.dx = -this.direction.dx;
            // this.changeColor();
        }

        if(this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.direction.dy = -this.direction.dy;
            // this.changeColor();
        }

        this.x += this.direction.dx;
        this.y += this.direction.dy;
        this.draw();
    };
}


function createcircles() {
    
    circleArray = [];
        for(let i = 0; i < count; i++) {
            const radius = minSize + (Math.random() * maxSize);
            circleArray.push(new Circle(
                Math.random() * (canvas.width - radius * 2) + radius,
                Math.random() * (canvas.height - radius * 2) + radius,
                radius
            ));
        }
    }

function start() {
    canvas.classList.remove('hide');
    canvas.classList.add('show');
    createcircles();
    animate();
    canvas.style.display = 'block';
}

function stopABQ() {
    canvas.classList.remove('show');
    canvas.classList.add('hide');
    setTimeout(function(){
        cancelAnimationFrame(animeteId);
        canvas.style.display = 'none';
    }, 600);
}

function animate() {
    animeteId = requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);
    circleArray.forEach(function(item) { 
        item.update();
    });
}

toggleAqua.addEventListener('click', ()=> {
    active = !active;
    active ? start() : stopABQ()
});