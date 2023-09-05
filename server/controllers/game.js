import makeValidation from '@withvoid/make-validation';
// models
import GameModel from '../models/Game.js';

export default {
    createGame: async (req, res) => { 
        try {
            const validation = makeValidation(types => ({
                payload: req.body,
                checks: {
                    game: { type: types.string },
                }
            }));
            if (!validation.success) return res.status(400).json({ ...validation });

            if(req.userType!=="player") return res.status(401).json({success: false, message: 'You are not a player'});

            const { game } = req.body;

            const instance = JSON.parse(game);
            instance.whitePlayer = req.username;
            const gameInstance = JSON.stringify(instance);

            const obj = await GameModel.createGame(req.username, gameInstance);

            return res.status(200).json({ success: true, obj });
        } catch (error) {
            return res.status(500).json({ success: false, error: error })
        }
    },
    updateGame: async (req, res) => {
        try {
            const validation = makeValidation(types => ({
                playload: req.body,
                checks: {
                    gameId: { type: types.string},
                    game: {type: types.string}
                }
            }));
            if(!validation.success) return res.status(400).json({...validation});

            const obj = await GameModel.updateGameById(req.body.gameId, req.body.game);
            const game = obj.game

            return res.status(200).json({ success: true, game})
        }
        catch (error) {
            return res.status(500).json({success: false, error: error})
        }
    },
    getGame: async (req, res) => {
        try {
            let obj = await GameModel.getGameById(req.params.gameId);

            let game = JSON.parse(obj.game);

            if(game.blackPlayer===null && game.whitePlayer !== req.username) game.blackPlayer = req.username;

            game = JSON.stringify(game) 

            obj = await GameModel.updateGameById(req.params.gameId, game)

            return res.status(200).json({ success: true, game })
        }
        catch (error) {
            return res.status(500).json({ success: false, error: error })
        }
    },
    finishGame: async (req, res) => { 

    }
}