import jwt from 'jsonwebtoken';
// models
import UserModel from '../server/models/User.js';

import bcrypt from "bcrypt";

const SECRET_KEY = 'some-secret-key';

export const encode = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        console.log(req.body)
        const user = await UserModel.getUserByUsername(username);

        console.log(user)

        const passwordIsValid = bcrypt.compareSync(
            password,
            user.password
        );

        if(!passwordIsValid) {
            return res.status(400).json({ success: false, message: "Invalid password"})
        }

        const payload = {
            username: user.username,
            userType: user.type,
        };
        const authToken = jwt.sign(payload, SECRET_KEY);
        console.log('Auth', authToken);
        req.authToken = authToken;
        next();
    } catch (error) {
        return res.status(400).json({ success: false, message: error.error });
    }
}

export const decode = (req, res, next) => {
    if (!req.headers['authorization']) {
        return res.status(400).json({ success: false, message: 'No access token provided' });
    }
    const accessToken = req.headers.authorization.split(' ')[1];

    try {
        const decoded = jwt.verify(accessToken, SECRET_KEY);
        req.username = decoded.username;
        req.userType = decoded.userType;
        return next();
    } catch (error) {

        return res.status(401).json({ success: false, message: error.message });
    }
}