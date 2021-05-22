function startGame() {
    var game = new Game("canvas");
    game.init();

    document.addEventListener("keydown", (event) => {
        if (!event.repeat && !game.status.endGame) {
            if (
                event.code === game.player1.Control[0] ||
                event.code === game.player1.Control[1] ||
                event.code === game.player1.Control[2] ||
                event.code === game.player1.Control[3]
            ) {
                game.player1.key = event.code;
                game.player1.Waiting = false;
            }
            if (
                event.code === game.player1.Control[4] ||
                event.code === game.player1.Control[5]
            ) {
                game.player1.Attack = true;
            }

            if (
                event.code === game.player2.Control[0] ||
                event.code === game.player2.Control[1] ||
                event.code === game.player2.Control[2] ||
                event.code === game.player2.Control[3]
            ) {
                game.player2.key = event.code;
                game.player2.Waiting = false;
            }
            if (
                event.code === game.player2.Control[4] ||
                event.code === game.player2.Control[5]
            ) {
                game.player2.Attack = true;
            }
        }
    });

    document.addEventListener("keyup", (event) => {
        if (!event.repeat) {
            if (
                event.code === game.player1.Control[0] ||
                event.code === game.player1.Control[1] ||
                event.code === game.player1.Control[2] ||
                event.code === game.player1.Control[3]
            ) {
                game.player1.move = 'stop';
                game.player1.key = null;
                game.player1.Waiting = true;
            }
            if (
                event.code === game.player1.Control[4] ||
                event.code === game.player1.Control[5]
            ) {
                game.player1.Attack = false;
            }

            if (
                event.code === game.player2.Control[0] ||
                event.code === game.player2.Control[1] ||
                event.code === game.player2.Control[2] ||
                event.code === game.player2.Control[3]
            ) {
                game.player2.move = 'stop';
                game.player2.key = null;
                game.player2.Waiting = true;
            }
            if (
                event.code === game.player2.Control[4] ||
                event.code === game.player2.Control[5]
            ) {
                game.player2.Attack = false;
            }
        }
    });

    game.canvas.addEventListener('click', (event) => {
        if ((event.pageX > ((document.body.clientWidth / 2) - 30) && event.pageX < ((document.body.clientWidth / 2) + 40)) && (event.pageY > 20 && event.pageY < 70)) {
           game.status.reset = true;
        }
    });

}

class Game {
    constructor(gameCanvas) {
        this.path = "source/interface/";
        this.canvas = document.getElementById(gameCanvas);
        this.ctx = canvas.getContext("2d");
        this.player1 = new Player("player1");
        this.__initImagePlayer(this.player1);
        this.player2 = new Player("player2");
        this.__initImagePlayer(this.player2);
        this.playerCtrl = [null, null];
        this.status = {
            endGame: false,
            reset: false
        };
        this.interface = {
            menu: new Map(),
            background: [],
            life: new Map()
        };

        this.__initImageGame();

        this.CounterFPS = 0;
    }

    init() {
        this.player1.X = 100;
        this.player1.Y = 350;
        this.player1.Control = ["KeyW", "KeyA", "KeyS", "KeyD", "KeyE", "KeyQ"];

        this.player2.Direction = false;
        this.player2.X = 550;
        this.player2.Y = 350;
        this.player2.Control = ["KeyI", "KeyJ", "KeyK", "KeyL", "KeyO", "KeyU"];

        setInterval(this.update, 1000 / 60, this);

        this.playerCtrl[0] = setInterval(
            this.playerAction,
            1000 / 60,
            this.player1,
            this.player2
        );

        this.playerCtrl[1] = setInterval(
            this.playerAction,
            1000 / 60,
            this.player2,
            this.player1
        );
    }

    drawPlayer(player) {
        var dX = player.X;
        var dY = player.Y;
        if (player.life > 0) {
            if (!player.Waiting) {
                if (player.Direction) {
                    this.ctx.drawImage(player.getLegs(), dX + 10, dY + 70, 50, 20);
                    this.ctx.drawImage(player.model("body"), dX, dY, 60, 80);
                    if (player.Motions) {
                        this.ctx.drawImage(player.getHands(), dX + 14, dY + 10, 20, 60);
                        this.ctx.drawImage(player.getHead(), dX + 2, dY - 33, 65, 95);
                    } else {
                        this.ctx.drawImage(player.getHands(), dX - 4, dY + 10, 80, 60);
                        this.ctx.drawImage(player.getHead(), dX, dY - 35, 65, 95);
                    }
                } else {
                    this.ctx.drawImage(player.getLegs(), dX, dY + 70, 50, 20);
                    this.ctx.drawImage(player.model("body"), dX, dY, 60, 80);
                    if (player.Motions) {
                        this.ctx.drawImage(player.getHands(), dX, dY + 10, 20, 60);
                        this.ctx.drawImage(player.getHead(), dX + 2, dY - 33, 65, 95);
                    } else {
                        this.ctx.drawImage(player.getHands(), dX - 18, dY + 10, 80, 60);
                        this.ctx.drawImage(player.getHead(), dX, dY - 35, 65, 95);
                    }
                }
            } else {
                if (player.Direction) {
                    this.ctx.drawImage(player.getLegs(), dX + 10, dY + 70, 50, 20);
                    this.ctx.drawImage(player.model("body"), dX, dY, 60, 80);
                    this.ctx.drawImage(player.getHands(), dX + 17, dY + 10, 50, 60);
                    this.ctx.drawImage(player.getHead(), dX, dY - 35, 65, 95);
                } else {
                    this.ctx.drawImage(player.getLegs(), dX, dY + 70, 50, 20);
                    this.ctx.drawImage(player.model("body"), dX, dY, 60, 80);
                    this.ctx.drawImage(player.getHands(), dX - 7, dY + 10, 50, 60);
                    this.ctx.drawImage(player.getHead(), dX, dY - 35, 65, 95);
                }
            }
            if (player.Attack) {
                if (player.Direction) {
                    this.ctx.drawImage(player.model("attack"), dX + 5, dY + 20, 90, 50);
                } else {
                    this.ctx.drawImage(player.model("attack"), dX - 35, dY + 20, 90, 50);
                }
            }
        } else {
            this.ctx.drawImage(player.model("die"), dX, dY, 115, 85);
            player.Ready = false;
        }
    }

    update(context) {
        context.ctx.clearRect(0, 0, 700, 500);
        context.drawInterface();
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
        if ((!context.player1.Ready && context.player2.Ready) || (context.player1.Ready && !context.player2.Ready)) {
            context.player1.Waiting = true;
            context.player2.Waiting = true;
            context.status.endGame = true;
        }
        context.drawPlayer(context.player1);
        context.drawPlayer(context.player2);

        if (context.status.reset) {
            context.__startGame();
        }
    }

    drawInterface() {
        this.ctx.drawImage(this.interface.background[0], 0, 0);
        this.ctx.drawImage(this.interface.menu.get('main'), 0, 0);
        if (this.status.endGame) {
            this.ctx.drawImage(this.interface.menu.get('play'), 315, 15);
        } else {
            this.ctx.drawImage(this.interface.menu.get('reset'), 315, 15);
        }
        this.drawHP(this.player1, true);
        this.drawHP(this.player2, false);
        this.ctx.drawImage(this.interface.life.get('left'), 0, 5);
        this.ctx.drawImage(this.interface.life.get('right'), 450, 5);

    }

    drawHP(player, position) {
        if (position) {
            let x = 5;
            let y = 40;
            switch (player.life) {
                case 100:
                    this.ctx.drawImage(this.interface.life.get('percent')[9], x + 223, y - 2);
                case 90:
                    this.ctx.drawImage(this.interface.life.get('percent')[8], x + 203, y - 2);
                case 80:
                    this.ctx.drawImage(this.interface.life.get('percent')[7], x + 185, y - 3);
                case 70:
                    this.ctx.drawImage(this.interface.life.get('percent')[6], x + 160, y - 4);
                case 60:
                    this.ctx.drawImage(this.interface.life.get('percent')[5], x + 140, y - 6);
                case 50:
                    this.ctx.drawImage(this.interface.life.get('percent')[4], x + 112, y - 5);
                case 40:
                    this.ctx.drawImage(this.interface.life.get('percent')[3], x + 85, y - 3);
                case 30:
                    this.ctx.drawImage(this.interface.life.get('percent')[2], x + 56, y - 2);
                case 20:
                    this.ctx.drawImage(this.interface.life.get('percent')[1], x + 28, y - 2);
                case 10:
                    this.ctx.drawImage(this.interface.life.get('percent')[0], x, y);
                case 0:
                    break;
            }    
        } else {
            let x = 455;
            let y = 40;
            switch (player.life) {
                case 100:
                    this.ctx.drawImage(this.interface.life.get('percent')[0], x, y);
                case 90:
                    this.ctx.drawImage(this.interface.life.get('percent')[1], x + 28, y - 2);
                case 80:
                    this.ctx.drawImage(this.interface.life.get('percent')[2], x + 56, y - 2);
                case 70:
                    this.ctx.drawImage(this.interface.life.get('percent')[3], x + 85, y - 3);
                case 60:
                    this.ctx.drawImage(this.interface.life.get('percent')[4], x + 112, y - 5);
                case 50:
                    this.ctx.drawImage(this.interface.life.get('percent')[5], x + 140, y - 6);
                case 40:
                    this.ctx.drawImage(this.interface.life.get('percent')[6], x + 160, y - 4);
                case 30:
                    this.ctx.drawImage(this.interface.life.get('percent')[7], x + 185, y - 3);
                case 20:
                    this.ctx.drawImage(this.interface.life.get('percent')[8], x + 203, y - 2);
                case 10:
                    this.ctx.drawImage(this.interface.life.get('percent')[9], x + 223, y - 2);
                case 0:
                    break;
            }    

        }
    }

    playerAction(player, player2) {
        if (player.Ready && player2.Ready) {
            if (player.Attack && !player2.Attack) {
                if ((Math.abs(player.X - player2.X) < 90) && (Math.abs(player.Y - player2.Y) < 30)) {
                    player2.setLife(player.getDamage());
                    player.Attack = false;
                    if (player.Direction) {
                        if (player2.X < (canvas.offsetWidth - 100) && player2.X > 40) {
                            if (player2.Direction) {
                                player2.X += 50;
                            } else {
                                player2.X += 50;
                            }
                        }
                    } else {
                        if (player2.X < (canvas.offsetWidth - 100) && player2.X > 40) {
                            if (player2.Direction) {
                                player2.X -= 50;
                            } else {
                                player2.X -= 50;
                            }
                        }
                    }
            
                }
            }
            switch (player.key) {
                case player.Control[0]:
                    //w
                    if (player.Motions) {
                        if (player.Y > 230) {
                            player.move = 'up';
                        } else {
                            player.move = 'stop';
                        }
                    }
                    break;

                case player.Control[1]:
                    //a
                    if (player.Motions) {
                        if (player.X > 40) {
                            player.Direction = false;
                            player.move = 'left';
                        } else {
                            player.move = 'stop';
                        }
                    }
                    break;

                case player.Control[2]:
                    //s
                    if (player.Motions) {
                        if (player.Y < (canvas.offsetHeight - 130)) {
                            player.move = 'down';
                        } else {
                            player.move = 'stop';
                        }
                    }
                    break;

                case player.Control[3]:
                    //d
                    if (player.Motions) {
                        if (player.X < (canvas.offsetWidth - 100)) {
                            player.Direction = true;
                            player.move = 'right';
                        } else {
                            player.move = 'stop';
                        }
                    }
                    break;
            }

        }
    }

    __initImagePlayer(player) {
        let img = new Image();
        // кэшируем картинки в память
        // тело
        this.loadImg(player.path + "/right/body.png").then((res) => {
            player.models.right.set("body", res);
        });

        // головы
        var headsR = [];
        this.loadImg(player.path + "/right/head_1.png").then((res) => {
            headsR.push(res);
        });
        this.loadImg(player.path + "/right/head_3.png").then((res) => {
            headsR.push(res);
        });
        player.models.right.set("heads", headsR);

        //руки
        var handsR = [];
        this.loadImg(player.path + "/right/hands_1.png").then((res) => {
            handsR.push(res);
        });
        this.loadImg(player.path + "/right/hands_2_1.png").then((res) => {
            handsR.push(res);
        });
        this.loadImg(player.path + "/right/hands_2_2.png").then((res) => {
            handsR.push(res);
        });
        player.models.right.set("hands", handsR);

        //ноги
        var legsR = [];
        this.loadImg(player.path + "/right/legs_1.png").then((res) => {
            legsR.push(res);
        });
        this.loadImg(player.path + "/right/legs_2_1.png").then((res) => {
            legsR.push(res);
        });
        this.loadImg(player.path + "/right/legs_2_2.png").then((res) => {
            legsR.push(res);
        });
        player.models.right.set("legs", legsR);

        //атака
        this.loadImg(player.path + "/right/attack.png").then((res) => {
            player.models.right.set("attack", res);
        });

        //смерть
        this.loadImg(player.path + "/right/die.png").then((res) => {
            player.models.right.set("die", res);
        });

        // тело
        this.loadImg(player.path + "/left/body.png").then((res) => {
            player.models.left.set("body", res);
        });

        // головы
        var headsL = [];
        this.loadImg(player.path + "/left/head_1.png").then((res) => {
            headsL.push(res);
        });
        this.loadImg(player.path + "/left/head_3.png").then((res) => {
            headsL.push(res);
        });
        player.models.left.set("heads", headsL);

        //руки
        var handsL = [];
        this.loadImg(player.path + "/left/hands_1.png").then((res) => {
            handsL.push(res);
        });
        this.loadImg(player.path + "/left/hands_2_1.png").then((res) => {
            handsL.push(res);
        });
        this.loadImg(player.path + "/left/hands_2_2.png").then((res) => {
            handsL.push(res);
        });
        player.models.left.set("hands", handsL);

        //ноги
        var legsL = [];
        this.loadImg(player.path + "/left/legs_1.png").then((res) => {
            legsL.push(res);
        });
        this.loadImg(player.path + "/left/legs_2_1.png").then((res) => {
            legsL.push(res);
        });
        this.loadImg(player.path + "/left/legs_2_2.png").then((res) => {
            legsL.push(res);
        });
        player.models.left.set("legs", legsL);

        //атака
        this.loadImg(player.path + "/left/attack.png").then((res) => {
            player.models.left.set("attack", res);
        });

        //смерть
        this.loadImg(player.path + "/left/die.png").then((res) => {
            player.models.left.set("die", res);
        });
    }

    __initImageGame() {
        //interface
        this.loadImg(this.path + "menu/main.png").then((res) => {
            this.interface.menu.set("main", res);
        });
        //buttons
        this.loadImg(this.path + "menu/btnPlay.png").then((res) => {
            this.interface.menu.set("play", res);
        });
        this.loadImg(this.path + "menu/btnReset.png").then((res) => {
            this.interface.menu.set("reset", res);
        });
        //backgroung
        this.loadImg(this.path + "background/bg_1.png").then((res) => {
            this.interface.background.push(res);
        });
        //life
        let percent = [];
        for (let index = 10; index <= 100; index += 10) { 
            this.loadImg(this.path + "lifeStatus/percent/" + index + ".png").then((res) => {
                percent.push(res);
            });
        }
        this.interface.life.set('percent', percent);

        this.loadImg(this.path + "lifeStatus/barLeft.png").then((res) => {
            this.interface.life.set("left", res);
        });
        this.loadImg(this.path + "lifeStatus/barRight.png").then((res) => {
            this.interface.life.set("right", res);
        });

        console.log(this.interface);
    }

    async loadImg(src) {
        let promise = new Promise((reslove, reject) => {
            var img = new Image();
            img.src = src;
            img.onload = () => {
                reslove(img);
            };
        });
        return await promise;
    }

    __startGame () {
        this.player1.X = 100;
        this.player1.Y = 350;
        this.player1.life = 100;
        this.player1.Ready = true;

        this.player2.Direction = false;
        this.player2.X = 550;
        this.player2.Y = 350;
        this.player2.life = 100;
        this.player2.Ready = true;

        this.status.endGame = false;
        this.status.reset = false;
    }
}

class Player {
    constructor(playerVariant) {
        this.Ready = false;
        this.path = "source/models/" + playerVariant + "/";

        this.models = {
            left: new Map(),
            right: new Map(),
        };
        this.Control = null;
        this.move = "stop";
        this.X = 0;
        this.Y = 0;

        this.key = null;
        this.life = 100;
        this.damage = 10;
        this.speed = 3;
        this.Waiting = true;
        this.Motions = false;
        this.Attack = false;
        this.Direction = true; //true - право, false - лево
        this.Ready = true;

        this.motionsControl = setInterval(
            (context) => {
                switch (context.move) {
                    case "left":
                        context.X -= context.speed;
                        break;
                    case "right":
                        context.X += context.speed;
                        break;
                    case "up":
                        context.Y -= context.speed;
                        break;
                    case "down":
                        context.Y += context.speed;
                        break;
                }
            },
            1000 / 60,
            this
        );
    }

    model(typeModel) {
        if (this.Direction) {
            return this.models.right.get(typeModel);
        } else {
            return this.models.left.get(typeModel);
        }
    }

    getHead() {
        if (this.Direction) {
            if (this.Attack) {
                return this.model("heads")[1];
            }
            return this.model("heads")[0];
        } else {
            if (this.Attack) {
                return this.model("heads")[1];
            }
            return this.model("heads")[0];
        }
    }

    getLegs() {
        if (this.Waiting) {
            return this.model("legs")[0];
        } else {
            if (this.Motions) {
                return this.model("legs")[1];
            } else {
                return this.model("legs")[2];
            }
        }
    }

    getHands() {
        if (this.Waiting) {
            return this.model("hands")[0];
        } else {
            if (this.Motions) {
                return this.model("hands")[1];
            } else {
                return this.model("hands")[2];
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
