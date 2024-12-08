import path from 'path';
import { fileURLToPath } from 'url';
import UserModel from '../models/UserModel.js';
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

const checkLogIn = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await UserModel.findOne({ username: username });

        if (!user) {
            return res.status(404).json({ success: false, message: "Sai tên đăng nhập hoặc mật khẩu." });
        }

        if (!user.isVerified) {
            return res.status(403).json({ success: false, message: "Tài khoản chưa được xác minh. Vui lòng kiểm tra email." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(404).json({ success: false, message: "Sai tên đăng nhập hoặc mật khẩu." });
        }

        // Tạo JWT token sau khi xác thực thành công
        const payload = {
            userId: user._id,
            username: user.username,
            email: user.email,
        };

        // Ký JWT với một secret key
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }); // Token sẽ hết hạn sau 1 giờ

        // Gửi token về cho client
        res.status(200).json({
            success: true,
            message: "Đăng nhập thành công!",
            token,  // Trả về token cho frontend
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Lỗi hệ thống. Vui lòng thử lại sau." });
    }
};

const register = (req, res) => {
    res.sendFile(path.join(__dirname, "../views/Register.html"));
}

const resetPassword = (req, res) => {
    res.sendFile(path.join(__dirname, "../views/ForgetPassword.html"));
}

const validateUsername = (username) => {
    const usernameRegex = /^[a-zA-Z0-9._]{6,20}$/;
    return usernameRegex.test(username);
};

const registerUser = async (req, res) => {
    const { username, password, email } = req.body;


    if (password.length < 6 && password.length > 20) {
        return res.status(400).json({ success: false, message: "Mật khẩu phải có ít nhất 6 ký tự và ít hơn hoặc bằng 20 ký tự" });
    }


    if (!validateUsername(username)) {
        return res.status(400).json({ success: false, message: "Tên người dùng không hợp lệ. Tên chỉ được chứa chữ cái, số, dấu chấm hoặc gạch dưới, và dài từ 6-20 ký tự." });
    }

    try {
        const existingUser = await UserModel.findOne({
            $or: [{ username: username }, { email: email }],
        });

        if (existingUser) {
            if (existingUser.username === username) {
                return res.status(400).json({ success: false, message: "Tên đăng nhập đã tồn tại." });
            }
            if (existingUser.email === email) {
                return res.status(400).json({ success: false, message: "Email đã tồn tại." });
            }
        }


        const hashedPassword = await bcrypt.hash(password, 10);


        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationExpires = Date.now() + 1000;

        const newUser = new UserModel({
            username,
            password: hashedPassword,
            email,
            verificationToken,
            verificationExpires,
        });

        await newUser.save();


        const verifyUrl = `http://localhost:3000/api/verify/${verificationToken}`;
        await sendMail(
            email,
            "Xác nhận email của bạn",
            `<p>Chào ${username},</p>
             <p>Nhấn vào liên kết bên dưới để xác minh email:</p>
             <a href="${verifyUrl}">Xác minh email</a>
             <p>Nếu bạn không đăng ký tài khoản, vui lòng bỏ qua email này.</p>`
        );

        res.status(200).json({ success: true, message: "Đăng ký thành công! Vui lòng kiểm tra email để xác minh tài khoản." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Lỗi hệ thống. Vui lòng thử lại sau." });
    }
};

const resendVerificationToken = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: "Không tìm thấy tài khoản với email này." });
        }

        if (user.isVerified) {
            return res.status(400).json({ success: false, message: "Tài khoản đã được xác minh." });
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
                "Xác nhận email của bạn",
                `<p>Chào ${user.username},</p>
                 <p>Nhấn vào liên kết bên dưới để xác minh email:</p>
                 <a href="${verifyUrl}">Xác minh email</a>
                 <p>Nếu bạn không đăng ký tài khoản, vui lòng bỏ qua email này.</p>`
            );

            return res.status(200).json({ success: true, message: "Đã gửi lại email xác minh mới. Vui lòng kiểm tra hộp thư của bạn." });
        } else {
            return res.status(400).json({ success: false, message: "Token vẫn còn hiệu lực. Bạn không cần yêu cầu lại." });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Lỗi hệ thống. Vui lòng thử lại sau." });
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
        res.status(500).json({ success: false, message: "Lỗi hệ thống. Vui lòng thử lại sau." });
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
}

export default AuthenticationController;