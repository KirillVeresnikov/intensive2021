function startGame() {
    var game = new Game("canvas");
    game.init();

    document.addEventListener("keydown", (event) => {
        if (!event.repeat) {
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
}

class Game {
    constructor(gameCanvas) {
        this.canvas = document.getElementById(gameCanvas);
        this.ctx = canvas.getContext("2d");
        this.player1 = new Player("player1");
        this.player2 = new Player("player2");
        this.playerCtrl = [null, null];
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
        context.ctx.setTransform(1, 0, 0, 1, 0, 0);
        context.ctx.fillStyle = "gray";
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
        if (context.player1.Ready && context.player2.Ready) {
            context.drawPlayer(context.player1);
            context.drawPlayer(context.player2);    
        }
    }

    playerAction(player, player2) {
        if (player.Ready && player2.Ready) {
            if (player.Attack && !player2.Attack) {
                if ((Math.abs(player.X - player2.X) < 90) && (Math.abs(player.Y - player2.Y) < 30)) {
                    player2.setLife(player.getDamage());
                    player.Attack = false;
                    console.log(player2.life);
                }
            }
            switch (player.key) {
                case player.Control[0]:
                    //w
                    if (player.Motions) {
                        if (player.Y > 40) {
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
                        if (player.Y < (canvas.offsetHeight - 90)) {
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
}

class Player {
    constructor(playerVariant) {
        this.Ready = false;
        this.path = "source/models/" + playerVariant + "/";

        this.models = {
            left: new Map(),
            right: new Map(),
        };
        this.__initImage();
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

    __initImage() {
        let img = new Image();
        // кэшируем картинки в память
        // тело
        this.loadImg(this.path + "/right/body.png").then((res) => {
            this.models.right.set("body", res);
        });

        // головы
        var headsR = [];
        this.loadImg(this.path + "/right/head_1.png").then((res) => {
            headsR.push(res);
        });
        this.loadImg(this.path + "/right/head_3.png").then((res) => {
            headsR.push(res);
        });
        this.models.right.set("heads", headsR);

        //руки
        var handsR = [];
        this.loadImg(this.path + "/right/hands_1.png").then((res) => {
            handsR.push(res);
        });
        this.loadImg(this.path + "/right/hands_2_1.png").then((res) => {
            handsR.push(res);
        });
        this.loadImg(this.path + "/right/hands_2_2.png").then((res) => {
            handsR.push(res);
        });
        this.models.right.set("hands", handsR);

        //ноги
        var legsR = [];
        this.loadImg(this.path + "/right/legs_1.png").then((res) => {
            legsR.push(res);
        });
        this.loadImg(this.path + "/right/legs_2_1.png").then((res) => {
            legsR.push(res);
        });
        this.loadImg(this.path + "/right/legs_2_2.png").then((res) => {
            legsR.push(res);
        });
        this.models.right.set("legs", legsR);

        //атака
        this.loadImg(this.path + "/right/attack.png").then((res) => {
            this.models.right.set("attack", res);
        });

        //смерть
        this.loadImg(this.path + "/right/die.png").then((res) => {
            this.models.right.set("die", res);
        });

        // тело
        this.loadImg(this.path + "/left/body.png").then((res) => {
            this.models.left.set("body", res);
        });

        // головы
        var headsL = [];
        this.loadImg(this.path + "/left/head_1.png").then((res) => {
            headsL.push(res);
        });
        this.loadImg(this.path + "/left/head_3.png").then((res) => {
            headsL.push(res);
        });
        this.models.left.set("heads", headsL);

        //руки
        var handsL = [];
        this.loadImg(this.path + "/left/hands_1.png").then((res) => {
            handsL.push(res);
        });
        this.loadImg(this.path + "/left/hands_2_1.png").then((res) => {
            handsL.push(res);
        });
        this.loadImg(this.path + "/left/hands_2_2.png").then((res) => {
            handsL.push(res);
        });
        this.models.left.set("hands", handsL);

        //ноги
        var legsL = [];
        this.loadImg(this.path + "/left/legs_1.png").then((res) => {
            legsL.push(res);
        });
        this.loadImg(this.path + "/left/legs_2_1.png").then((res) => {
            legsL.push(res);
        });
        this.loadImg(this.path + "/left/legs_2_2.png").then((res) => {
            legsL.push(res);
        });
        this.models.left.set("legs", legsL);

        //атака
        this.loadImg(this.path + "/left/attack.png").then((res) => {
            this.models.left.set("attack", res);
        });

        //смерть
        this.loadImg(this.path + "/left/die.png").then((res) => {
            this.models.left.set("die", res);
        });

        console.log(this.models);
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
