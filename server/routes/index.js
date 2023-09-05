import express from 'express';
// controllers
import users from '../controllers/user.js';
// middlewares
import { encode } from '../../middlewares/jwt.js';

const router = express.Router();

router
    .post('/login/', encode, (req, res, next) => {
        return res
            .status(200)
            .json({
                success: true,
                token: req.authToken,
                username: req.username
            });
    });

export default router;