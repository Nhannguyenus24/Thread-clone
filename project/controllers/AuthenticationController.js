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
    res.sendFile(path.join(__dirname, "../views/LogInPage.html"));
}

const resetPasswordForm = (req, res) => {
    res.sendFile(path.join(__dirname, "../views/ResetPassword.html"));
}

const checkLogIn = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await UserModel.findOne({ username: username });

        if (!user) {
            return res.status(404).json({ message: "Incorrect username or password." });
        }

        if (!user.isVerified) {
            return res.status(403).json({ message: "Account not verified. Please check your email." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(404).json({ message: "Incorrect username or password." });
        }

        // Tạo JWT token sau khi xác thực thành công
        const payload = {
            userId: user._id
        };

        // Ký JWT với một secret key
        const token = jwt.sign(payload, "741017f64f83c6884e275312409462130e6b4ad31a651a1d66bf7ca08ef64ca4377e229b4aa54757dfefc268d6dbca0f075bda7a23ea913666e4a78102896f60");

        // Gửi token về cho client
        res.status(200).json({
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "System error! Please try again later." });
    }
};

const register = (req, res) => {
    res.sendFile(path.join(__dirname, "../views/Register.html"));
}

const resetPassword = (req, res) => {
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
            const newVerificationExpires = Date.now() + 3600000;


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

            return res.status(200).json({ success: true, message: "A new verification email has been sent. Please check your inbox." });
        } else {
            return res.status(400).json({ success: false, message: "The token is still valid. You don't need to request it again." });
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
            return res.status(400).json({ success: false, message: "Token không hợp lệ." });
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
                "Xác nhận email của bạn",
                `<p>Chào ${user.username},</p>
                 <p>Nhấn vào liên kết bên dưới để xác minh email:</p>
                 <a href="${verifyUrl}">Xác minh email</a>
                 <p>Nếu bạn không đăng ký tài khoản, vui lòng bỏ qua email này.</p>`
            );


            return res.status(400).json({
                success: false,
                message: "Token xác minh đã hết hạn. Một email xác minh mới đã được gửi đến hộp thư của bạn."
            });
        }


        user.isVerified = true;
        user.verificationToken = null;
        await user.save();

        res.status(200).send("<a href='http://localhost:3000/login'>Đăng ký thành công, bấm vào đây để quay về trang đăng nhập</a>");
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
            return res.status(404).json({ success: false, message: "Không tìm thấy tài khoản với email này." });
        }

        // Tạo token reset password và thời gian hết hạn
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetExpires = Date.now() + 3600000; // Token có hiệu lực trong 1 giờ

        // Cập nhật thông tin token vào cơ sở dữ liệu
        user.verificationToken = resetToken;
        user.verificationExpires = resetExpires;
        await user.save();

        // Tạo liên kết reset mật khẩu
        const resetUrl = `http://localhost:3000/reset-password-form?token=${resetToken}`;
        await sendMail(
            email,
            "Đặt lại mật khẩu của bạn",
            `<p>Chào ${user.username},</p>
             <p>Nhấn vào liên kết bên dưới để đặt lại mật khẩu của bạn:</p>
             <a href="${resetUrl}">Đặt lại mật khẩu</a>
             <p>Liên kết này sẽ hết hạn sau 1 giờ.</p>
             <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>`
        );

        res.status(200).json({ success: true, message: "Email đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư của bạn." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Hệ thống gặp lỗi! Vui lòng thử lại sau." });
    }
};

const executeResetPassword = async (req, res) => {
    const { token, password } = req.body;

    try {
        const user = await UserModel.findOne({
            verificationToken: token,
            verificationExpires: { $gt: Date.now() }, // Kiểm tra token còn hiệu lực
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Token không hợp lệ hoặc đã hết hạn." });
        }

        // Hash mật khẩu mới
        const hashedPassword = await bcrypt.hash(password, 10);

        // Cập nhật mật khẩu mới
        user.password = hashedPassword;
        user.verificationToken = null;
        user.verificationExpires = null;
        await user.save();

        res.status(200).json({ success: true, message: "Mật khẩu đã được đặt lại thành công. Bạn có thể đăng nhập bằng mật khẩu mới." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Hệ thống gặp lỗi! Vui lòng thử lại sau." });
    }
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
}

export default AuthenticationController;