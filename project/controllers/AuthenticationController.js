import path from 'path';

const logIn = (req, res) => {
    res.sendFile(path.join(__dirname, "../views/LogInPage.html"));
}

const signUp = (req, res) => {
    res.sendFile(path.join(__dirname, "../views/Register.html"));
}

const resetPassword = (req, res) => {
    res.sendFile(path.join(__dirname, "../views/GetPassword.html"));
}
const AuthenticationController = {
    logIn: logIn,
    signUp: signUp,
    resetPassword: resetPassword
}

export default AuthenticationController;