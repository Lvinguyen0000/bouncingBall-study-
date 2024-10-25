class Pad {
    constructor(position, width, height, left_border, right_border){
        this.position = position
        this.cur_position = this.position;
        this.width = width;
        this.height = height;
        this.left_border = left_border;
        this.right_border = right_border;
        this.move_dis = 2;

        this.keys = {
            'left': false, 'right': false
        };

        this.hitbox = {
            x: this.position.x,
            y: this.position.y,
            endx: this.position.x + this.width,
            endy: this.position.y + this.height
        };
    }

    updateHitbox(){
        this.hitbox.x = this.position.x;
        this.hitbox.y = this.position.y;
        this.hitbox.endx = this.position.x + this.width;
        this.hitbox.endy = this.position.y + this.height;
    }

    move(){
        this.cur_position = this.position;
        if (this.keys.right && this.hitbox.endx < this.right_border) this.position.x += this.move_dis;
        else if (this.keys.left && this.hitbox.x > this.left_border) this.position.x -= this.move_dis;
        this.updateHitbox();
    }
}


class Ball{
    constructor(position, radius, left_border, right_border, top_border, bot_border, img){
        this.position = position;
        this.cur_position = this.position;
        this.radius = radius;
        this.left_border = left_border;
        this.right_border = right_border;
        this.top_border = top_border;
        this.bot_border = bot_border;
        this.img = img;

        this.hitSurfaceAngle = 0;
        
        this.vector = {
            x: Math.random() - 0.5,
            y: 1
        };

        this.hitbox = {
            x: this.position.x,
            y: this.position.y,
            endx: this.position.x + 2*this.radius,
            endy: this.position.y + 2*this.radius
        };
        this.swapped = false;
        this.passedTop = false;
        this.passedLeft = false;
        this.passedRight = false;

        this.outOfBound = false;
        this.flag = false;
    }

    updateHitbox(){
        this.hitbox.x = this.position.x;
        this.hitbox.y = this.position.y;
        this.hitbox.endx = this.position.x + 2*this.radius;
        this.hitbox.endy = this.position.y + 2*this.radius;
    }

    move (){
        if (this.hitbox.x >= this.left_border - 1 && this.hitbox.y >= this.top_border && this.hitbox.endx <= this.right_border + 1 && this.hitbox.endy <= this.bot_border){
            this.cur_position = this.position;
            this.position.x += this.vector.x;
            this.position.y += this.vector.y;

            if (this.position.x < this.left_border) {
                this.position.x = this.left_border;
                this.vector.x *= -1;
            }
            else if (this.position.x + 2*this.radius > this.right_border) {
                this.position.x = this.right_border - 2*this.radius;
                this.vector.x *= -1
            }

            if (this.position.y < this.top_border) this.position.y = this.top_border;

            this.updateHitbox();
            return true;
        }
        else {
            return false;
        }
    }

    hit(pad){
        if (!this.outOfBound){
            if (this.hitbox.endy >= pad.hitbox.y && this.hitbox.endy <= pad.hitbox.y + 2 && this.hitbox.x > pad.hitbox.x && this.hitbox.endx < pad.hitbox.endx){
                if (this.swapped){
                    let temp = this.vector.x;
                    this.vector.x = this.vector.y;
                    this.vector.y = temp;
                    this.swapped = false;
                }
                this.hitSurfaceAngle = 0 + Math.random() * 0.05;
                this.outOfBound = true;
                return true;
            }
            else if (this.hitbox.endx >= this.right_border - 2 && this.hit.endx <= this.right_border){
                if(!this.swapped){
                let temp = this.vector.x;
                this.vector.x = this.vector.y;
                this.vector.y = temp;
                this.swapped = true;
                }
                this.hitSurfaceAngle = 90 + Math.random() * 0.05;
                this.outOfBound = true;
                return true;                    
            }
            else if (this.hitbox.x <= this.left_border + 2 && this.hitbox.x >= this.left_border){
                if(!this.swapped){
                    let temp = this.vector.x;
                    this.vector.x = this.vector.y;
                    this.vector.y = temp;
                    this.swapped = true;
                }
                this.hitSurfaceAngle = 90 + Math.random() * 0.05;
                this.outOfBound = true;
                return true;
            }
            else if (this.hitbox.y <= this.top_border){
                if (this.swapped){
                    let temp = this.vector.x;
                    this.vector.x = this.vector.y;
                    this.vector.y = temp;
                    this.swapped = false;
                }
                this.hitSurfaceAngle = 0 + Math.random() * 0.05;
                this.outOfBound = true;
                return true;
            }   
            
        }
        return false;
    }
}


function loadKeyDownEvents(pad){
    window.addEventListener('keydown', (event) =>{
        switch (event.key){
            case 'd':
                pad.keys.right = true;
                break;
            case 'a':
                pad.keys.left = true;
                break;
        }
    });
}

function loadKeyUpEvents(pad){
    window.addEventListener('keyup', (event) =>{
        switch (event.key){
            case 'd':
                pad.keys.right = false;
                break;
            case 'a':
                pad.keys.left = false;
                break;
        }
    });
}

function getNormal (a){
    return {
        x: Math.sin(a),
        y: -Math.cos(a)
    };
}

function dot(surface, ball){
    return surface.x * ball.vector.x + surface.y * ball.vector.y;
}

function reflect (surface, ball){
    let d = 2*dot(surface, ball);
    ball.vector.x -= d * surface.x;
    ball.vector.y -= d * surface.y;
}

function toFloat(val){
    
}

function animate(pad, ball1, ball2){
    ctx.clearRect(2,0,canvas.width-4,canvas.height);

    if (pad.keys.right || pad.keys.left){
        ctx.clearRect(pad.cur_position.x, pad.cur_position.y, pad.width, pad.height);
        pad.move();
    }

    if (ball1.hit(pad)){
        let normal = getNormal(ball1.hitSurfaceAngle);
        reflect(normal, ball1);
    }
    let check1 = ball1.move();
    
    if (ball1.hitbox.endx < ball1.right_border && ball1.hitbox.x > ball1.left_border) ball1.outOfBound = false; 

    
    if (ball2.hit(pad)){
        let normal = getNormal(ball2.hitSurfaceAngle);
        reflect(normal, ball2);
    }
    let check2 = ball2.move();
    
    if (ball2.hitbox.endx < ball2.right_border && ball2.hitbox.x > ball2.left_border) ball2.outOfBound = false; 


    ctx.fillStyle = "red";
    ctx.fillRect(pad.position.x, pad.position.y, pad.width, pad.height);
    
    //ctx.drawImage(img, ball.position.x, ball.position.y, 2*ball.radius, 2*ball.radius);
    ctx.fillStyle = "green";
    ctx.fillRect (ball1.position.x, ball1.position.y, ball1.radius, ball1.radius);

    ctx.fillStyle = "purple";
    ctx.fillRect (ball2.position.x, ball2.position.y, ball2.radius, ball2.radius);

    if (check1 || check2){
        score++;
        displayScore(score);
    }
    else{
        document.getElementById("display").textContent = "You lost";
        score = 0;
        clearInterval(interval);
    }
}

function displayScore (score){
    document.getElementById("display").textContent = "Score: " + score;
}

function init(){
    let img = new Image();
    img.src = "assets/circle.svg";

    window.addEventListener('keydown', (event) => {
        if (event.key == " "){
            
            ctx.fillStyle = "blue";
            ctx.fillRect (0, 0, 2, canvas.height*5/6);
            ctx.fillRect (canvas.width - 2, 0, 2, canvas.height*5/6);

            let a = new Pad({x: canvas.width/2, y: canvas.height*5/6}, 50, 2, 0, canvas.width);
            let b = new Ball({x: canvas.width/2, y: canvas.height/2}, 2, 0,canvas.width, 0, canvas.height, img);
            let c = new Ball({x: canvas.width/2, y: canvas.height/2}, 2, 0,canvas.width, 0, canvas.height, img);
            loadKeyDownEvents(a);
            loadKeyUpEvents(a);
            interval = setInterval(animate, 10, a, b, c);
        }
    });
}

