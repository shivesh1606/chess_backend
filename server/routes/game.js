import express from 'express';
// controllers
import game from '../controllers/game.js';
// middlewares
import { decode } from '../../middlewares/jwt.js';

const router = express.Router();

router
    .post('/create', decode, game.createGame)
    .get('/:gameId', decode, game.getGame)
    .put('/:gameId/finish', decode, game.finishGame)

export default router;