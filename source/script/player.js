export default class Player {
    constructor(playerVariant) {
        this.path = "../models/" + playerVariant;
        this.models = new Map([
            ['static', new Image().src = this.path + "/standing_still/player.png"],
            ['motion', [
                new Image().src = this.path + "/motion/player1.png",
                new Image().src = this.path + "/motion/player2.png",
            ]],
            ['attack', new Image().src = this.path + "/attack/player.png"],
            ['die', new Image().src = this.path + "/die/player.png"],
        ]);
        this.life = 100;
        this.damage = 20;
    }

    get model(typeModel) {
        return this.models[typeModel];
    }

    get life() {
        return this.life;
    }

    set life(damege) {
        this.life -= damege;
    }

    get damage() {
        return this.damage;
    }
}