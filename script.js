
window.addEventListener('load', function () {
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = this.window.innerWidth;
    canvas.height = 500;




    class InputHandler {
        constructor(game) {
            this.game = game;
            var press = false;

            window.addEventListener('keydown', e => {
                if (e.key === ' ') {
                    press = true;
                    this.game.player.shootTop();
                }
                if (((e.key === 'ArrowUp') || (e.key == 'ArrowDown')) && this.game.keys.indexOf(e.key) === -1) {
                    if (press === true) {
                        this.game.player.shootTop();
                    }
                    this.game.keys.push(e.key);

                } else if ((e.key === 'w') && this.game.keys.indexOf('ArrowUp') === -1) {
                    this.game.keys.push('ArrowUp');
                    if (press === true) {
                        this.game.player.shootTop();
                    }
                } else if ((e.key === 's') && this.game.keys.indexOf('ArrowDown') === -1) {
                    this.game.keys.push('ArrowDown');
                    if (press === true) {
                        this.game.player.shootTop();
                    }
                }

                if (e.key === 'd') {
                    this.game.debug = !this.game.debug;
                }
                if (press === true) {
                    this.game.player.shootTop();
                }
            });


            window.addEventListener('keyup', e => {
                if (this.game.keys.indexOf(e.key) > -1) {
                    this.game.keys.splice(this.game.keys.indexOf(e.key), 1);
                }
                if (this.game.keys.indexOf('ArrowUp') > -1) {
                    this.game.keys.splice(this.game.keys.indexOf('ArrowUp'), 1);
                }
                if (this.game.keys.indexOf('ArrowDown') > -1) {
                    this.game.keys.splice(this.game.keys.indexOf('ArrowDown'), 1);
                }
                if (e.key === ' ') press = false;
            });


        }

    }

    class Projectile {
        constructor(game, x, y) {
            this.game = game;
            this.x = x;
            this.y = y;
            this.height = 3;
            this.width = 10;
            this.speed = 5;
            this.markedForDeletion = false;
            this.image = document.getElementById('projectile');
        }
        update() {
            this.x += this.speed;
            if (this.x > this.game.width * 0.9) this.markedForDeletion = true;
        }
        draw(context) {
            context.drawImage(this.image, this.x, this.y);
        }

    }

    class Particle {
        constructor(game, x, y) {
            this.game = game;
            this.x = x;
            this.y = y;
            this.image = document.getElementById('gears');
            this.framex = Math.floor(Math.random() * 3);
            this.framey = Math.floor(Math.random() * 3);
            this.spriteSize = 50;
            this.sizeModifier = (Math.random() * 0.8 + 0.8).toFixed(1);
            this.size = this.spriteSize * this.sizeModifier;
            this.speedx = Math.random() * 6 - 3;
            this.speedy = Math.random() * -15;
            this.gravity = 0.5;
            this.markedForDeletion = false;
            this.angle = 0;
            this.va = Math.random() * 0.2 - 0.1;
            this.bounced = 0;
            this.bouncboundry = Math.random() * 80 + 60;
        }

        update() {
            this.angle += this.va;
            this.speedy += this.gravity;
            this.x -= this.speedx - this.game.speed;
            this.y += this.speedy;
            if (this.y > this.game.height + this.size || this.x < 0 - this.size) this.markedForDeletion = true;
            if (this.y > this.game.height - this.bouncboundry && this.bounced < 2) {
                this.bounced++;
                this.speedy *= -0.5;
            }
        }

        draw(context) {
            context.save();
            context.translate(this.x, this.y);
            context.rotate(this.va);

            context.drawImage(this.image, this.framex * this.spriteSize, this.framey * this.spriteSize, this.spriteSize, this.spriteSize, 0, 0, this.size * -0.5, this.size * -0.5);
            context.restore();
        }

    }

    class player {
        constructor(game) {
            this.game = game;
            this.width = 120;
            this.height = 190;
            this.x = 20;
            this.y = 100;
            this.framex = 0;
            this.framey = 0;
            this.maxframe = 37;
            this.speedY = 1;

            this.maxspeed = 3;
            this.projectiles = [];
            this.image = document.getElementById('player');
            this.powerUp = false;
            this.powerUpTimer = 0;
            this.powerUpLimit = 6000;

        }

        update(deltaTime) {

            if (this.game.keys.includes('ArrowUp')) this.speedY = -this.maxspeed;
            else if (this.game.keys.includes('ArrowDown')) this.speedY = this.maxspeed;
            else this.speedY = 0;
            this.y += this.speedY;

            if (this.y > this.game.height - this.height * 0.5) this.y = this.game.height - this.height * 0.5;
            else if (this.y < -this.height * 0.5) this.y = -this.height * 0.5;

            this.projectiles.forEach(projectile => {
                projectile.update();
            });
            this.projectiles = this.projectiles.filter(projectile => !projectile.markedForDeletion);

            if (this.framex < this.maxframe) {
                this.framex++;
            } else {
                this.framex = 0;
            }

            if (this.powerUp) {
                if (this.powerUpTimer > this.powerUpLimit) {
                    this.powerUpTimer = 0;
                    this.powerUp = false;
                    this.framey = 0;
                } else {
                    this.powerUpTimer += deltaTime;
                    this.framey = 1;
                    this.game.ammo += 0.1;
                }
            }
        }

        draw(context) {

            if (this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height);
            this.projectiles.forEach(projectile => {
                projectile.draw(context);
            });
            context.drawImage(this.image, this.framex * this.width, this.framey * this.height, this.width, this.height, this.x, this.y, this.width, this.height);

        }

        shootTop() {
            if (this.game.ammo > 0) {
                this.projectiles.push(new Projectile(this.game, this.x + 90, this.y + 30));
                this.game.ammo--;
            }
            if (this.powerUp) this.shootBottom();
        }

        shootBottom() {
            if (this.game.ammo > 0) {
                this.projectiles.push(new Projectile(this.game, this.x + 90, this.y + 175));

            }
        }

        enterPowerUp() {
            this.powerUp = true;
            this.powerUpTimer = 0;
            this.game.ammo = this.game.maxAmmo;
        }

    }

    class Enemy {
        constructor(game) {
            this.game = game;
            this.x = this.game.width;
            this.speedx = Math.random() * -1.5 - 0.5;
            this.markedForDeletion = false;
            this.framex = 0;
            this.framey = 0;
            this.maxframe = 37;
        }


        update() {
            this.x += this.speedx - this.game.speed;
            if (this.x + this.width < 0) {
                this.markedForDeletion = true;
                if (!this.game.gameOver) this.game.score -= 5;
            }

            if (this.framex < this.maxframe) {
                this.framex++;
            } else {
                this.framex = 0;
            }
        }

        draw(context) {
            if (this.game.debug) {
                context.strokeRect(this.x, this.y, this.width, this.height);
                context.font = '20px Helvatica'
                context.fillText(this.lives, this.x, this.y);
            }
            context.drawImage(this.image, this.framex * this.width, this.framey * this.height, this.width, this.height, this.x, this.y, this.width, this.height);

        }

    }

    class Angler1 extends Enemy {
        constructor(game) {
            super(game);
            this.width = 228;
            this.height = 169;
            this.lives = 3;
            this.score = this.lives;
            this.y = Math.random() * (this.game.height * 0.95 - this.height);
            this.image = document.getElementById('angler1');
            this.framey = Math.floor(Math.random() * 3);
        }
    }


    class Angler2 extends Enemy {
        constructor(game) {
            super(game);
            this.width = 213;
            this.height = 165;
            this.lives = 2;
            this.score = this.lives;
            this.y = Math.random() * (this.game.height * 0.95 - this.height);
            this.image = document.getElementById('angler2');
            this.framey = Math.floor(Math.random() * 2);
        }
    }

    class LuckyFish extends Enemy {
        constructor(game) {
            super(game);
            this.width = 99;
            this.height = 95;
            this.lives = 3;
            this.score = 15;
            this.type = 'lucky'
            this.y = Math.random() * (this.game.height * 0.95 - this.height);
            this.image = document.getElementById('lucky');
            this.framey = Math.floor(Math.random() * 2);
        }
    }

    class HiveWhale extends Enemy {
        constructor(game) {
            super(game);
            this.width = 400;
            this.height = 227;
            this.lives = 15;
            this.score = this.lives;
            this.y = Math.random() * (this.game.height * 0.95 - this.height);
            this.image = document.getElementById('hivewhale');
            this.framey = 0;
            this.speedx = Math.random() * -1.2 - 0.2;
            this.type = 'hive';
        }
    }

    class Drone extends Enemy {
        constructor(game, x, y) {
            super(game);
            this.width = 115;
            this.height = 95;
            this.lives = 1;
            this.score = this.lives;
            this.x = x
            this.y = y;
            this.image = document.getElementById('drone');
            this.framey = 0;
            this.speedx = Math.random() * -4.2 - 0.5;
        }
    }

    class Explosion {
        constructor(game, x, y) {
            this.game = game;
            this.framex = 0;
            this.spriteHeight = 200;
            this.spriteWidth = 200;
            this.width = this.spriteWidth;
            this.height = this.spriteHeight;
            this.x = x - this.width * 0.5;
            this.y = y - this.height * 0.5;
            this.fps = 30;
            this.timer = 0;
            this.Interval = 1000 / this.fps;
            this.markedForDeletion = false;
            this.maxFrame = 8;
        }

        update(deltaTime) {
            this.x -= this.game.speed;
            if (this.timer > this.Interval) {
                this.framex++;
                this.timer = 0;
            } else {
                this.timer += deltaTime;
            }
            if (this.framex > this.maxFrame) this.markedForDeletion = true;
        }

        draw(context) {
            context.drawImage(this.image, this.framex * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
        }
    }

    class SmokeExplosion extends Explosion {
        constructor(game, x, y) {
            super(game, x, y);
            this.image = document.getElementById('smokeExplosion');
        }
    }

    class FireExplosion extends Explosion {
        constructor(game, x, y) {
            super(game, x, y);
            this.image = document.getElementById('fireExplosion');
        }
    }


    class Layer {
        constructor(game, image, speedModifier) {
            this.game = game;
            this.image = image;
            this.speedModifier = speedModifier;
            this.width = 1768;
            this.height = 500;
            this.x = 0;
            this.y = 0;
        }

        update() {
            if (this.x <= -this.width) this.x = 0;
            this.x -= this.game.speed * this.speedModifier;

        }

        draw(context) {
            context.drawImage(this.image, this.x, this.y);
            context.drawImage(this.image, this.x + this.width, this.y);
        }

    }

    class Background {
        constructor(game) {
            this.game = game;
            this.image1 = document.getElementById('layer1');
            this.image2 = document.getElementById('layer2');
            this.image3 = document.getElementById('layer3');
            this.image4 = document.getElementById('layer4');

            this.layer1 = new Layer(this.game, this.image1, 0.3);
            this.layer2 = new Layer(this.game, this.image2, 0.5);
            this.layer3 = new Layer(this.game, this.image3, 1);
            this.layer4 = new Layer(this.game, this.image4, 1.2);
            this.layers = [this.layer1, this.layer2, this.layer3];
        }

        update() {
            this.layers.forEach(layer => layer.update());
        }

        draw(context) {
            this.layers.forEach(layer => layer.draw(context));
        }


    }

    class UI {
        constructor(game) {
            this.game = game;
            this.fontSize = 25;
            this.fontFamily = 'Bangers';
            this.color = 'white';
        }

        draw(context) {
            context.save();
            context.fillStyle = this.color;
            context.shadowOffsetX = 2;
            context.shadowOffsetY = 2;
            context.shadowColor = 'black';
            context.font = this.fontSize + 'px ' + this.fontFamily;
            context.fillText('Score: ' + this.game.score, 20, 40);


            const formattedTime = (this.game.gameTime * 0.001).toFixed(1);
            context.fillText('Time: ' + formattedTime, 20, 100);
            const heart = "♥";
            var x = 140;
            if (localStorage.getItem("gamemode") < 15) {
                for (let i = 0; i < this.game.plives; i++) {
                    context.fillText(heart + " ", x, 40);
                    x += 23;
                }
            }

            if (this.game.gameOver) {
                context.textAlign = 'center';
                let message1;
                let message2;
                if (this.game.score > this.game.winningScore) {
                    message1 = ' MOST WONDROUS !!!';
                    message2 = ' WELL DONE EXPLORER !!!';
                } else {
                    message1 = 'BLAZES !! ';
                    message2 = 'GET MY REPAIR KIT AND TRY AGAIN !';
                }
                context.font = '100px ' + this.fontFamily;
                context.fillText(message1, this.game.width * 0.5, this.game.height * 0.5 - 40);
                context.font = '75px ' + this.fontFamily;
                context.fillText(message2, this.game.width * 0.5, this.game.height * 0.5 + 40);
            }

            if (this.game.player.powerUp) context.fillStyle = '#ffffbd';
            for (let i = 0; i < this.game.ammo; i++) {
                context.fillRect(20 + 5 * i, 50, 3, 20);
            }

            context.restore();
        }
    }

    class Game {

        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.background = new Background(this);
            this.player = new player(this);
            this.input = new InputHandler(this);
            this.ui = new UI(this);
            this.keys = [];
            this.enemies = [];
            this.particles = [];
            this.explosions = [];
            this.enemyTimer = 0;
            this.enemyInterval = 700;
            this.ammo = 50;
            this.ammoTimer = 0;
            this.ammoInterval = 600;
            this.maxAmmo = 40;
            this.gameOver = false;
            this.score = 0;
            this.winningScore = 300;
            this.gameTime = 0;
            this.gameTimeLimit = localStorage.getItem("gamemode") * 1000;
            this.plives = Number.MAX_SAFE_INTEGER;
            if (localStorage.getItem("gamemode") < 15) {
                this.plives = localStorage.getItem("gamemode");
                this.gameTimeLimit = Number.MAX_SAFE_INTEGER;
                this.winningScore = Number.MAX_SAFE_INTEGER;
            }
            this.speed = 1;
            if (localStorage.getItem("difficulty") === '1') {
                this.speed = 1;
                this.enemyInterval = 900;
            } else if (localStorage.getItem("difficulty") === '2') {
                this.speed = 2;
                this.enemyInterval = 700;
                this.ammo = 60;
            } else if (localStorage.getItem("difficulty") === '3') {
                this.speed = 2.5;
                this.enemyInterval = 600;
                this.ammo = 70;
            } else if (localStorage.getItem("difficulty") === '4') {
                this.speed = 3.1;
                this.enemyInterval = 100;
                this.ammo = 90;
                this.maxAmmo = 80;
                this.winningScore = 501;
            }
            this.debug = false;
        }

        update(deltaTime) {
            if (!this.gameOver) this.gameTime += deltaTime;
            else console.log("game over");
            this.player.update(deltaTime);

            this.background.update();
            this.background.layer4.update();
            if (this.gameTime > this.gameTimeLimit) this.gameOver = true;


            if (this.ammoTimer > this.ammoInterval) {
                if (this.ammo < this.maxAmmo) this.ammo++;
                this.ammoTimer = 0;
            } else {
                this.ammoTimer += deltaTime;
            }
            this.particles.forEach(particle => particle.update());
            this.particles = this.particles.filter(particle => !particle.markedForDeletion);

            this.explosions.forEach(explosion => explosion.update(deltaTime));
            this.explosions = this.explosions.filter(explosion => !explosion.markedForDeletion);

            this.enemies.forEach(enemy => {
                enemy.update();
                if (this.checkCollision(this.player, enemy)) {

                    enemy.markedForDeletion = true;
                    this.addExplosion(enemy);
                    for (let i = 0; i < enemy.score; i++) {
                        this.particles.push(new Particle(this, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
                    }
                    if ((enemy.type === 'lucky') && !this.gameOver) this.player.enterPowerUp();
                    else if (enemy.type === 'hive') {
                        for (let i = 0; i < 5; i++) {
                            this.enemies.push(new Drone(this, enemy.x + Math.random() * enemy.width * 0.5, enemy.y + Math.random() * enemy.width * 0.5))
                        }
                        if (!this.gameOver) {
                            this.score -= enemy.lives;
                            this.plives -= 1;
                            if (this.plives < 0) {
                                this.gameOver = true;
                            }
                            console.log(this.plives);
                        }
                    }
                    else if (!this.gameOver) {
                        this.score -= enemy.lives;
                        this.plives -= 1;
                        if (this.plives < 0) {
                            this.gameOver = true;
                        }
                        console.log(this.plives);
                    }
                }
                this.player.projectiles.forEach(projectile => {
                    if (this.checkCollision(projectile, enemy)) {
                        enemy.lives--;
                        projectile.markedForDeletion = true;
                        if (enemy.lives <= 0) {
                            enemy.markedForDeletion = true;
                            for (let i = 0; i < enemy.score; i++) {
                                this.particles.push(new Particle(this, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
                            }
                            this.addExplosion(enemy);
                            if (enemy.type === 'hive') {
                                for (let i = 0; i < 5; i++) {
                                    this.enemies.push(new Drone(this, enemy.x + Math.random() * enemy.width * 0.5, enemy.y + Math.random() * enemy.width * 0.5))
                                }
                            }

                            if (!this.gameOver) this.score += enemy.score;
                            if (this.score > this.winningScore) this.gameOver = true;
                        }
                    }
                })
            });

            this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);

            if (this.enemyTimer > this.enemyInterval && !this.gameOver) {
                this.addEnemy();
                this.enemyTimer = 0;
            } else {
                this.enemyTimer += deltaTime;
            }
        }

        draw(context) {
            this.background.draw(context);
            this.ui.draw(context);
            this.player.draw(context);
            this.particles.forEach(particle => particle.draw(context));
            this.enemies.forEach(enemy => {
                enemy.draw(context);
            });

            this.explosions.forEach(explosion => {
                explosion.draw(context);
            });



            this.background.layer4.draw(context);

        }

        addEnemy() {
            const randomize = Math.random();
            if (randomize < 0.3) this.enemies.push(new Angler1(this));
            else if (randomize < 0.6) this.enemies.push(new Angler2(this));
            else if (randomize < 0.8) this.enemies.push(new HiveWhale(this));
            else this.enemies.push(new LuckyFish(this));

        }

        addExplosion(enemy) {
            const randomize = Math.random();
            if (randomize < 0.5) this.explosions.push(new SmokeExplosion(this, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
            else this.explosions.push(new FireExplosion(this, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
        }

        checkCollision(rect1, rect2) {
            return (
                rect1.x < rect2.x + rect2.width &&
                rect1.x + rect1.width > rect2.x &&
                rect1.y < rect2.y + rect2.height &&
                rect1.height + rect1.y > rect2.y
            )
        }
    }

    const game = new Game(canvas.width, canvas.height);

    // animation loop

    let lastTime = 0;
    function animat(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.draw(ctx);
        game.update(deltaTime);

        requestAnimationFrame(animat);
    }

    animat(0);
});