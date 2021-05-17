function startGame() {
    var game = new Game("canvas");
    game.init();

    document.addEventListener('keydown', (event) => {
        if (event.code === game.player1.Control[0] || event.code === game.player1.Control[1] || event.code === game.player1.Control[2] || event.code === game.player1.Control[3]) {
            game.player1.key = event.code;
            game.player1.Waiting = false;    
        }
        if (event.code === game.player1.Control[4] || event.code === game.player1.Control[5] ) {
            game.player1.Attack = true;
        }

        if (event.code === game.player2.Control[0] || event.code === game.player2.Control[1] || event.code === game.player2.Control[2] || event.code === game.player2.Control[3]) {
            game.player2.key = event.code;
            game.player2.Waiting = false;    
        }
        if (event.code === game.player2.Control[4] || event.code === game.player2.Control[5] ) {
            game.player2.Attack = true;
        }
    });

    document.addEventListener('keyup', (event) => {
        if (event.code === game.player1.Control[0] || event.code === game.player1.Control[1] || event.code === game.player1.Control[2] || event.code === game.player1.Control[3]) {
            game.player1.key = null;
            game.player1.Waiting = true;    
        }
        if (event.code === game.player1.Control[4] || event.code === game.player1.Control[5] ) {
            game.player1.Attack = false;
        }

        if (event.code === game.player2.Control[0] || event.code === game.player2.Control[1] || event.code === game.player2.Control[2] || event.code === game.player2.Control[3 ]) {
            game.player2.key = null;
            game.player2.Waiting = true;    
        }
        if (event.code === game.player2.Control[4] || event.code === game.player2.Control[5] ) {
            game.player2.Attack = false;
        }
    });
}

class Game {
    constructor(canvas) {
        this.ctx = document.getElementById(canvas).getContext("2d");
        this.player1 = new Player("player1");
        this.player2 = new Player("player2");
        this.playerCtrl = [null, null];
        this.speed = 10;
        this.CounterFPS = 0;
    }

    init() {
        this.player1.X = 100;
        this.player1.Y = 350;
        this.player1.Control = ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'KeyE', 'KeyQ'];

        this.player2.Direction = true;
        this.player2.X = 550;
        this.player2.Y = 350;
        this.player2.Control = ['Numpad8', 'Numpad4', 'Numpad5', 'Numpad6', 'Numpad9', 'Numpad7'];

        setInterval(this.update, 1000 / 60, this);
        this.playerCtrl[0] = setInterval(this.playerAction, 1000 / 60, this.player1);
        this.playerCtrl[1] = setInterval(this.playerAction, 1000 / 60, this.player2);
    }

    drawPlayer(player) {
        var dX = player.X;
        var dY = player.Y;
        if (player.Direction) {
            this.ctx.setTransform(-1, 0, 0, 1, 0, 0);
            this.ctx.rotate(0);
            dX = -dX - 60;
        }

        this.ctx.drawImage(player.getLegs(), dX + 10, dY + 70, 50, 20);
        this.ctx.drawImage(player.model('body'), dX, dY, 60, 80);
        if (!player.Waiting) {
            if (player.Motions) {
                this.ctx.drawImage(player.getHands(), dX + 14, dY + 10, 20, 60);
                this.ctx.drawImage(player.getHead(), dX + 2, dY - 33, 65, 95);
            } else {
                this.ctx.drawImage(player.getHands(), dX - 4, dY + 10, 80, 60);
                this.ctx.drawImage(player.getHead(), dX, dY - 35, 65, 95);
            }
        } else {
            this.ctx.drawImage(player.getHands(), dX + 17, dY + 10, 50, 60);
            this.ctx.drawImage(player.getHead(), dX, dY - 35, 65, 95);
        }
        if (player.Attack) {
            this.ctx.drawImage(player.model('attack'), dX + 5, dY + 20, 90, 50);
        }
    }

    update(context) {
        context.ctx.clearRect(0, 0, 700, 500);
        context.ctx.setTransform(1, 0, 0, 1, 0, 0);
        context.ctx.fillStyle = 'gray';
        context.ctx.fillRect(0, 0, 700, 500);
        context.CounterFPS++;
        if (context.CounterFPS % 10 === 0) {
            if (!context.player1.Waiting) {
                context.player1.Motions = !context.player1.Motions;
            }
            if (!context.player2.Waiting) {
                context.player2.Motions = !context.player2.Motions;
            }
            context.CounterFPS = 0;
        }
        context.drawPlayer(context.player1);
        context.drawPlayer(context.player2);
    }

    playerAction(player) {
        switch (player.key) {
            case player.Control[0]:
                //w
                if (player.Motions) {
                    player.Motions = true;
                }
                break;

            case player.Control[1]:
                //a
                if (player.Motions) {
                    player.Motions = true;
                    player.Direction = true;
                }
                break;

            case player.Control[2]:
                //s
                if (player.Motions) {
                    player.Motions = true;
                }
                break;

            case player.Control[3]:
                //d
                if (player.Motions) {
                    player.Motions = true;
                    player.Direction = false;
                }
                break;
        }
    }

    moveR(player) {
        player.Direction = true;
        player.X += this.speed;
    }

    moveL(player) {
        player.Direction = false;
        player.X -= this.speed;
    }

    up(player) {
        player.Y += this.speed;
    }

    down(player) {
        player.Y -= this.speed;
    }

    attack(player) {
    }
}

class Player {
    constructor(playerVariant) {
        this.Ready = false;
        this.path = "source/models/" + playerVariant + "/";

        this.models = new Map();
        this.__initImage();
        this.Control = null;

        this.X = 0;
        this.Y = 0;

        this.key = null;
        this.life = 100;
        this.damage = 20;
        this.Waiting = true;
        this.Motions = false;
        this.Attack = false;
        this.Direction = false; //true - право, false - лево
        this.Ready = true;
    }

    stop() {
        this.Motions = false;
        this.Attack = false;
    }

    __initImage() {
        let img = new Image();
        // кэшируем картинки в память
        // тело
        this.loadImg(this.path + "body.png").then(res => { this.models.set('body', res); });

        // головы
        var heads = [];
        this.loadImg(this.path + "head_1.png").then(res => { heads.push(res); });
        this.loadImg(this.path + "head_3.png").then(res => { heads.push(res); });
        this.models.set('heads', heads);

        //руки
        var hands = [];
        this.loadImg(this.path + "hands_1.png").then(res => { hands.push(res); });
        this.loadImg(this.path + "hands_2_1.png").then(res => { hands.push(res); });
        this.loadImg(this.path + "hands_2_2.png").then(res => { hands.push(res); });
        this.models.set('hands', hands);

        //ноги
        var legs = [];
        this.loadImg(this.path + "legs_1.png").then(res => { legs.push(res); });
        this.loadImg(this.path + "legs_2_1.png").then(res => { legs.push(res); });
        this.loadImg(this.path + "legs_2_2.png").then(res => { legs.push(res); });
        this.models.set('legs', legs);

        //атака
        this.loadImg(this.path + "attack.png").then(res => { this.models.set('attack', res); });
    }

    async loadImg(src) {
        let promise = new Promise((reslove, reject) => {
            var img = new Image();
            img.src = src;
            img.onload = () => {
                reslove(img);
            }
        });
        return await promise;
    }

    model(typeModel) {
        return this.models.get(typeModel);
    }

    getHead() {
        if (this.Direction) {
            if (this.Attack) {
                return this.model('heads')[1];
            }
            return this.model('heads')[0];
        } else {
            if (this.Attack) {
                return this.model('heads')[1];
            }
            return this.model('heads')[0];
        }
    }

    getLegs() {
        if (this.Waiting) {
            return this.model('legs')[0];
        } else {
            if (this.Motions) {
                return this.model('legs')[1];
            } else {
                return this.model('legs')[2];
            }
        }
    }

    getHands() {
        if (this.Waiting) {
            return this.model('hands')[0];
        } else {
            if (this.Motions) {
                return this.model('hands')[1];
            } else {
                return this.model('hands')[2];
            }
        }
    }

    getLife() {
        return this.life;
    }

    setLife(damege) {
        this.life -= damege;
    }

    getDamage() {
        return this.damage;
    }
}