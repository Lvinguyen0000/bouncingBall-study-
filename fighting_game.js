class Fighter {
    constructor(name, position, width, height, velocity, widthBorder, heightBorder, img, img_f){
        this.name = name;
        this.health = 100;
        this.position = position;

        this.cur_position = this.position;

        this.width = width;
        this.height = height;

        this.widthBorder = widthBorder;
        this.heightBorder = heightBorder;

        this.keys = {
                'left': false,
                'right': false,
                'up': false,
                'attack': false
        };

        this.img = img;
        this.img_f = img_f;

        this.velocity = velocity;
        this.upG = 1;
        this.downG = 1;
        this.maxG = 50;
        this.inAir = false;

        this.hitbox = {
            x: this.position.x,
            y: this.position.y,
            endx: this.position.x + this.width,
            endy: this.position.y + this.height
        }

        this.attacking = false;
    }
    
    updateHitbox(){
        this.hitbox.x = this.position.x;
        this.hitbox.y = this.position.y;
        this.hitbox.endx = this.position.x + this.width;
        this.hitbox.endy = this.position.y + this.height;
    }

    touched (enemy, toLeft){
        let leftHit = this.position.x - this.width;
        let rightHit = this.position.x + this.width*2;

        let topHit = this.position.y + this.height/2
        let botHit = topHit + 3;

        if(toLeft){
            if (((leftHit == enemy.hitbox.x) ||
                ((leftHit > enemy.hitbox.x) && (leftHit < enemy.hitbox.endx)) ||
                ((this.hitbox.x > enemy.hitbox.x) && (this.hitbox.x < enemy.hitbox.endx)))
                &&
                (((topHit > enemy.hitbox.y) && (topHit < enemy.hitbox.endy)) ||
                ((botHit > enemy.hitbox.y) && (botHit < enemy.hitbox.endy))))
            {
                return true;
            }
        }
        else if(((rightHit == enemy.hitbox.x) ||
                ((rightHit > enemy.hitbox.x) && (rightHit < enemy.hitbox.endx)) ||
                ((this.hitbox.endx > enemy.hitbox.x) &&(this.hitbox.endx < enemy.hitbox.endx)))
                &&
                (((topHit > enemy.hitbox.y) && (topHit < enemy.hitbox.endy)) ||
                ((botHit > enemy.hitbox.y) && (botHit < enemy.hitbox.endy))))
        {
            return true;
        }
        return false;
    }

    move(){
        this.cur_position = this.position;
        if (this.keys.right && this.hitbox.endx < this.widthBorder) this.position.x += this.velocity;
        else if (this.keys.left && this.hitbox.x > 0) this.position.x -= this.velocity;
        this.updateHitbox();
    }

    jump(){
        if (this.upG < this.maxG){
            this.upG++;
            this.position.y--;
            this.updateHitbox();
        }
        else if(this.downG < this.maxG){
            this.downG++;
            this.position.y++;
            this.updateHitbox();
        }
        else {
            this.upG = 1;
            this.downG = 1;
            this.inAir = false;
        }
    }
}

function drawHealthandName(f1Health, f2Health, f1Name, f2Name, borderW){
    ctx.globalAlpha = 1.0;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 1, borderW, 20);
    ctx.fillStyle = "red";
    ctx.fillRect(0, 1, borderW/2 * f1Health/100, 20);
    ctx.fillStyle = 'blue';
    ctx.fillRect(borderW/2 + (borderW/2 - borderW/2 * f2Health/100), 1, borderW/2 * f2Health/100, 20);

    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "#fff";
    ctx.font = "10px serif";
    ctx.fillText(f1Name, borderW/4, 15);
    ctx.fillText(f2Name,  borderW*3/4, 15);
}

function switchSide(fighter1, fighter2){
    if(fighter1.hitbox.endx > fighter2.hitbox.endx) return true;
    else return false
}

function drawAttack(fighter, toLeft){
    fighter.attacking = true;
    if(toLeft){
        ctx.fillStyle = '#000';
        ctx.fillRect(fighter.position.x - fighter.width/2, fighter.position.y + fighter.height/2, fighter.width/2, 3);
        setTimeout(function(){
            ctx.fillStyle = '#000';
            ctx.fillRect(fighter.position.x - fighter.width, fighter.position.y + fighter.height/2, fighter.width, 3);
        }, 50);
        setTimeout(function(){
            ctx.clearRect(fighter.position.x - fighter.width, fighter.position.y + fighter.height/2, fighter.width, 3);
            ctx.fillStyle = '#000';
            ctx.fillRect(fighter.position.x - fighter.width/2, fighter.position.y + fighter.height/2, fighter.width/2, 3);
        }, 100);
        setTimeout(function(){
            ctx.clearRect(fighter.position.x - fighter.width, fighter.position.y + fighter.height/2 - 1, fighter.width, 5);
        }, 150);
    }
    else{
        ctx.fillStyle = '#000';
        ctx.fillRect(fighter.position.x + fighter.width, fighter.position.y + fighter.height/2, fighter.width/2, 3);
        setTimeout(function(){
            ctx.fillStyle = '#000';
            ctx.fillRect(fighter.position.x + fighter.width, fighter.position.y + fighter.height/2, fighter.width, 3);
        }, 50);
        setTimeout(function(){

            ctx.clearRect(fighter.position.x + fighter.width, fighter.position.y + fighter.height/2, fighter.width, 3);
            ctx.fillStyle = '#000';
            ctx.fillRect(fighter.position.x + fighter.width, fighter.position.y + fighter.height/2, fighter.width/2, 3);
        }, 100);
        setTimeout(function(){
            ctx.clearRect(fighter.position.x + fighter.width, fighter.position.y + fighter.height/2 - 1, fighter.width, 5);
        }, 150)
    }
    setTimeout(function(){
        fighter.attacking = false;
    }, 200);
}

function endGame(fighter){
    if(fighter.health == 0) return true;
    return false;
}

function mainDraw(fighter1, fighter2){
    if(fighter1.keys.right || fighter1.keys.left){
        ctx.clearRect(fighter1.cur_position.x, fighter1.cur_position.y, fighter1.width, fighter1.height);
        fighter1.move();
        sideSwitch = switchSide(fighter1, fighter2);
    }
    if(fighter2.keys.right || fighter2.keys.left){
        ctx.clearRect(fighter2.cur_position.x, fighter2.cur_position.y, fighter2.width, fighter2.height);
        fighter2.move();
        sideSwitch = switchSide(fighter1, fighter2);
    }

    if(fighter1.keys.up && !fighter1.inAir) {fighter1.inAir = true;}
    if(fighter1.inAir){fighter1.jump();}
    if(fighter2.keys.up && !fighter2.inAir) {fighter2.inAir = true;}
    if(fighter2.inAir){fighter2.jump();}

    if(fighter1.keys.attack && !fighter1.attacking) {
        drawAttack(fighter1, sideSwitch);
        if(fighter1.touched(fighter2, sideSwitch)){
            fighter2.health-=5;
            drawHealthandName(fighter1.health, fighter2.health,fighter1.name,fighter2.name,  fighter1.widthBorder);
            if(endGame(fighter2)) {
                clearInterval(interval);
                document.getElementById("anoc").textContent = "Player " + fighter1.name + " wins!";
            }
        }
    }
    if(fighter2.keys.attack && !fighter2.attacking) {
        drawAttack(fighter2, !sideSwitch);
        if(fighter2.touched(fighter1, !sideSwitch)){
            fighter1.health-=5;
            drawHealthandName(fighter1.health, fighter2.health,fighter1.name,fighter2.name,  fighter2.widthBorder);
            if(endGame(fighter1)) {
                clearInterval(interval);
                document.getElementById("anoc").textContent = "Player " + fighter2.name + " wins!";
            }
        }
    }

    //clear any attack if the fighter is moving too fast
    ctx.clearRect(0, 21, fighter1.widthBorder, fighter1.heightBorder - 21);

    let img1 = new Image();
    let img2 = new Image();

    if(!sideSwitch){
        img1 = fighter1.img_f;
        img2 = fighter2.img;
    }
    else{
        img1 = fighter1.img;
        img2 = fighter2.img_f;
    }

    //ctx.fillStyle = "red";
    ctx.drawImage(img1, fighter1.position.x,fighter1.position.y,fighter1.width,fighter1.height);
    //ctx.fillStyle = "blue";
    ctx.drawImage(img2,fighter2.position.x,fighter2.position.y,fighter2.width,fighter2.height);
}

let sideSwitch = false

function loadKeyDownEvents(player1, player2){
    window.addEventListener('keydown', (event) => {
        event.preventDefault();
        switch (event.key){
            case 'd':
                player1.keys.right = true;
                break;
            case 'a':
                player1.keys.left = true;
                break;
            case 'w':
                player1.keys.up = true;
                break;
            case 'f':
                player1.keys.attack = true;
                break;

            case 'j':
                player2.keys.left = true;
                break;
            case 'l':
                player2.keys.right = true;
                break;
            case 'i':
                player2.keys.up = true;
                break;
            case 'h':
                player2.keys.attack = true;
                break; 
        }
    });
}

function loadKeyUpEvents(player1, player2){
    window.addEventListener('keyup', (event) => {
        event.preventDefault();
        switch (event.key){
            case 'd':
                player1.keys.right = false;
                break;
            case 'a':
                player1.keys.left = false;
                break;
            case 'w':
                player1.keys.up = false;
                break;
            case 'f':
                player1.keys.attack = false;
                break;

            case 'j':
                player2.keys.left = false;
                break;
            case 'l':
                player2.keys.right = false;
                break;
            case 'i':
                player2.keys.up = false;
                break;
            case 'h':
                player2.keys.attack = false;
                break;
        }
    });
}