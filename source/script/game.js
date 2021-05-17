import Player from "./player.js";

export default class Game {
    constructor(canvas) {
        this.ctx = document.getElementById(canvas).getContext("2d");
        this.player1 = new Player("player1");
        this.player2 = new Player("player2");
    }

    init()
    {
        this.ctx.drawImage(this.player1.model("static", 100, 100));
    }
}