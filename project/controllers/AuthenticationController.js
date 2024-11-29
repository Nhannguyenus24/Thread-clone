import path from 'path';
import { fileURLToPath } from 'url';
import UserModel from '../models/UserModel.js';

// Calculate __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logIn = (req, res) => {
    res.sendFile(path.join(__dirname, "../views/LogInPage.html"));
}

const checkLogIn = async (req, res) => {
    const {username, password} = req.body;
    try{
        const findUser = await UserModel.findOne({username: username, password: password});
        if(!findUser){
            res.status(404).json({ success: false, message: "Sai tên đăng nhập hoặc mật khẩu"});
        }
        else {
            res.status(200).json({ success: true});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error"});
    }
}

const register = (req, res) => {
    res.sendFile(path.join(__dirname, "../views/Register.html"));
}

const resetPassword = (req, res) => {
    res.sendFile(path.join(__dirname, "../views/GetPassword.html"));
}

const registerUser = async (req, res) => {
    const {username, password, email} = req.body;
    console.log(username, password, email);
    try{
        const findUser = await UserModel.findOne({username: username});
        const findEmail = await UserModel.findOne({email: email});
        if(findUser)
            res.status(400).json({ success: false, message: "Tên đăng nhập đã tồn tại"});
        if(findEmail)
            res.status(400).json({ success: false, message: "Email đã tồn tại"});
        else {
            const newUser = new UserModel({username: username, password: password, email: email});
            await newUser.save();
            res.status(200).json({ success: true});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error"});
    }
}

const AuthenticationController = {
    logIn: logIn,
    register: register,
    resetPassword: resetPassword,
    checkLogIn: checkLogIn,
    registerUser: registerUser
}

export default AuthenticationController;