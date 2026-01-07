import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

export const register = async (req, res) => {
    try {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hash,
            photo: req.body.photo,
        });

        await newUser.save();
        res.status(200).json({ success: true, message: "Successfully created!" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to create. Try again!" });
    }
};

export const login = async (req, res) => {
    const email = req.body.email;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found!" });
        }

        const checkCorrectPassword = await bcrypt.compare(req.body.password, user.password);
        if (!checkCorrectPassword) {
            return res.status(401).json({ success: false, message: "Incorrect email or password!" });
        }

        const { password, ...rest } = user._doc;

        const secretKey = process.env.JWT_SECRET || "mernStackAuthSecretKey";
        const token = jwt.sign({ id: user._id, role: user.role }, secretKey, { expiresIn: "15d" });

        res
            .cookie("accessToken", token, {
                httpOnly: true,
                expires: token.expiresIn,
                sameSite: "none",
                secure: true
            })
            .status(200)
            .json({
                token,
                data: { ...rest },
                role: user.role
            });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to login" });
    }
};

export const googleAuth = async (req, res) => {
    try {
        const { token } = req.body;
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { name, email, picture } = ticket.getPayload();

        let user = await User.findOne({ email });

        if (!user) {
            const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(randomPassword, salt);

            user = new User({
                username: name,
                email: email,
                password: hash,
                photo: picture,
                role: "user"
            });
            await user.save();
        }

        const secretKey = process.env.JWT_SECRET || "mernStackAuthSecretKey";
        const accessToken = jwt.sign({ id: user._id, role: user.role }, secretKey, { expiresIn: "15d" });

        const { password, ...rest } = user._doc;

        res
            .cookie("accessToken", accessToken, { httpOnly: true, expires: accessToken.expiresIn })
            .status(200)
            .json({
                token: accessToken,
                data: { ...rest },
                role: user.role
            });

    } catch (err) {
        console.error("Google Auth Error:", err);
        res.status(500).json({ success: false, message: "Google login failed" });
    }
};