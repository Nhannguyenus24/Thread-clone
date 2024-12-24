import path from 'path';
import { fileURLToPath } from 'url';
import UserModel from '../models/UserModel.js';
import NotificationController from './NotificationController.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import crypto from 'crypto';
import sendMail from '../utils/sendMail.js'
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logIn = (req, res) => {
    if (req.cookies.token) {
        return res.redirect("/");
    }
    res.sendFile(path.join(__dirname, "../views/LogInPage.html"));
}

const resetPasswordForm = (req, res) => {
    if (req.cookies.token) {
        return res.redirect("/");
    }
    res.sendFile(path.join(__dirname, "../views/ResetPassword.html"));
}

const checkLogIn = async (req, res) => {
    const { username, password } = req.body;
    
    try {
        const user = await UserModel.findOne({ username: username });

        if (!user)
            return res.status(404).json({message: "Incorrect username or password." });

        if (!user.isVerified)
            return res.status(403).json({message: "Account not verified. Please check your email." });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(404).json({ message: "Incorrect username or password." });
        }

        const payload = {
            userId: user._id
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET);
        res.cookie("token", token, {
            httpOnly: true, // Prevent JavaScript from accessing cookie (XSS protection)
            secure: false, // Use true in production with HTTPS
            sameSite: "Strict", // Prevent CSRF attacks
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({message: "System error! Please try again later." });
    }
};

const register = (req, res) => {
    if (req.cookies.token) {
        return res.redirect("/");
    }
    res.sendFile(path.join(__dirname, "../views/Register.html"));
}

const resetPassword = (req, res) => {
    if (req.cookies.token) {
        return res.redirect("/");
    }
    res.sendFile(path.join(__dirname, "../views/ForgotPassword.html"));
}

const validateUsername = (username) => {
    const usernameRegex = /^[a-zA-Z0-9._]{6,20}$/;
    return usernameRegex.test(username);
};

const registerUser = async (req, res) => {
    const { username, password, email } = req.body;


    if (password.length < 6 && password.length > 20) {
        return res.status(400).json({ message: "Password must be at least 6 characters and no more than 20 characters." });
    }


    if (!validateUsername(username)) {
        return res.status(400).json({ message: "Invalid username. It must contain only letters, numbers, dots, or underscores and be 6-20 characters long." });
    }

    try {
        const existingUser = await UserModel.findOne({
            $or: [{ username: username }, { email: email }],
        });

        if (existingUser) {
            if (existingUser.username === username) {
                return res.status(400).json({ message: "Username already exists." });
            }
            if (existingUser.email === email) {
                return res.status(400).json({ message: "Email already exists." });
            }
        }


        const hashedPassword = await bcrypt.hash(password, 10);


        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationExpires = Date.now() + 300000;

        const newUser = new UserModel({
            username,
            password: hashedPassword,
            email,
            verificationToken,
            verificationExpires,
        });

        await newUser.save();
        NotificationController.addNotification(newUser._id, "Welcome to Thread! Please update your account information!");

        const verifyUrl = `http://localhost:3000/api/verify/${verificationToken}`;
        await sendMail(
            email,
            "Confirm your email",
            `<p>Hello ${username},</p>
            <p>Click the link below to verify your email:</p>
            <a href="${verifyUrl}">Verify Email</a>
            <p>If you did not sign up for an account, please ignore this email.</p>`
        );

        res.status(200).json({ message: "Registration successful! Please check your email to verify your account." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "System error! Please try again later." });
    }
};

const resendVerificationToken = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await UserModel.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ success: false, message: "No account found with this email." });
        }

        if (user.isVerified) {
            return res.status(400).json({ success: false, message: "The account has been verified." });
        }


        if (Date.now() > user.verificationExpires) {

            const newVerificationToken = crypto.randomBytes(32).toString('hex');
            const newVerificationExpires = Date.now() + 300000;


            user.verificationToken = newVerificationToken;
            user.verificationExpires = newVerificationExpires;
            await user.save();


            const verifyUrl = `http://localhost:3000/api/verify/${newVerificationToken}`;
            await sendMail(
                email,
                "Confirm your email",
                `<p>Hello ${username},</p>
                <p>Click the link below to verify your email:</p>
                <a href="${verifyUrl}">Verify Email</a>
                <p>If you did not sign up for an account, please ignore this email.</p>`
            );

            return res.status(200).json({message: "A new verification email has been sent. Please check your inbox." });
        } else {
            return res.status(400).json({message: "The token is still valid. You don't need to request it again." });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "System error! Please try again later." });
    }
};



const verifyUser = async (req, res) => {
    const { token } = req.params;

    try {
        const user = await UserModel.findOne({ verificationToken: token });

        if (!user) {
            return res.status(400).json({message: "Invalid token." });
        }


        if (Date.now() > user.verificationExpires) {

            const newVerificationToken = crypto.randomBytes(32).toString('hex');
            const newVerificationExpires = Date.now() + 3600000;


            user.verificationToken = newVerificationToken;
            user.verificationExpires = newVerificationExpires;
            await user.save();


            const verifyUrl = `http://localhost:3000/api/verify/${newVerificationToken}`;
            await sendMail(
                user.email,
                "Confirm your email",
                `<p>Hello ${user.username},</p>
                <p>Click the link below to verify your email:</p>
                <a href="${verifyUrl}">Verify Email</a>
                <p>If you did not sign up for an account, please ignore this email.</p>`
            );

            return res.status(400).json({
                message: "The verification token has expired. A new verification email has been sent to your inbox."
            });
        }


        user.isVerified = true;
        user.verificationToken = null;
        await user.save();

        res.status(200).send("<a href='http://localhost:3000/login'>Registration successful. Click here to return to the login page.</a>");
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "System error! Please try again later." });
    }
};


const requestPasswordReset = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await UserModel.findOne({ email: email });

        if (!user) {
            return res.status(404).json({message: "No account found with this email." });
        }

        // Tạo token reset password và thời gian hết hạn

//         const hashedPassword = await bcrypt.hash(password, 10);

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetExpires = Date.now() + 3600000;

        user.verificationToken = resetToken;
        user.verificationExpires = resetExpires;
        await user.save();

        const resetUrl = `http://localhost:3000/reset-password-form?token=${resetToken}`;
//         const resetUrl = `http://localhost:3000/api/reset-password/${resetToken}?password=${encodeURIComponent(hashedPassword)}`;

        await sendMail(
            email,
            "Reset your password",
            `<p>Hello ${user.username},</p>
             <p>Click the link below to reset your password:</p>
             <a href="${resetUrl}">reset password</a>
             <p>This link will expire in 1 hour.</p>
             <p>If you did not request a password reset, please ignore this email.</p>`
        );

        res.status(200).json({ success: true, message: "A password reset email has been sent. Please check your inbox." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "The system encountered an error! Please try again later." });
//         res.status(200).json({message: "Email xác nhận đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư của bạn." });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({message: "System error! Please try again later." });
    }
};

const executeResetPassword = async (req, res) => {
    const { token, password } = req.body;

    try {
        const user = await UserModel.findOne({
            verificationToken: token,
            verificationExpires: { $gt: Date.now() },
        });
        if (!user) {
            return res.status(400).json({message: "Invalid or expired token." });
        }

        // Hash mật khẩu mới
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.verificationToken = null;
        user.verificationExpires = null;
        await user.save();
        res.status(200).json({message: "Your password has been successfully reset. You can now log in with your new password." });
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "The system encountered an error! Please try again later." });
    }
};

const isLoggedIn = (req, res) => {
    const token = req.cookies.token;
    if (!token)
        res.status(200).json({ isLoggedIn: false });
    else 
        res.status(200).json({ isLoggedIn: true });
}

const logOut = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "Strict",
        secure: false,
        path: "/",
    });
    res.status(200).json({ message: "Log out successfully" });
};


const AuthenticationController = {
    logIn: logIn,
    register: register,
    resetPassword: resetPassword,
    checkLogIn: checkLogIn,
    registerUser: registerUser,
    verifyUser: verifyUser,
    resendVerificationToken: resendVerificationToken,
    requestPasswordReset: requestPasswordReset,
    executeResetPassword: executeResetPassword,
    resetPasswordForm: resetPasswordForm,
    isLoggedIn: isLoggedIn,
    logOut: logOut
}

export default AuthenticationController;