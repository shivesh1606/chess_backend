
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

export const STATUS_TYPES = {
    LIVE: "live",
    PAUSED: "paused",
    FINISHED: "finished"
};

const GameSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: () => uuidv4().replace(/\-/g, ""),
        },
        initiator: String,
        game: String,
        status: String
    },
    {
        timestamps: true,
        collection: "games",
    }
);

GameSchema.statics.createGame = async function (
    initiator, game
) {
    try {
        let status = STATUS_TYPES.LIVE
        const newGame = await this.create({ initiator, game, status});
        return {
            isNew: true,
            message: 'creating a new game',
            gameId: newGame._doc._id,
            game: newGame._doc.game,
        };
    } catch (error) {
        console.log('error on create game method', error);
        throw error;
    }
}

GameSchema.statics.getGameById = async function (id) {
    try {
        const game = await this.findOne({ _id: id });
        if (!game) throw ({ error: 'No game with this id found' });
        return game;
    } catch (error) {
        throw error;
    }
}

GameSchema.statics.updateGameById = async function (id, game) {
    try {
        const obj = this.findOneAndUpdate({_id: id}, {game: game});
        return obj;
    } catch (error) {
        throw error;
    }
}


export default mongoose.model("Game", GameSchema);