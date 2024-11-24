const logIn = (req, res) => {
    res.sendFile(__dirname + "/views/LogInPage.html");
}

const signUp = (req, res) => {
    res.sendFile(__dirname + "/views/Register.html");
}

const resetPassword = (req, res) => {
    res.sendFile(__dirname + "/views/GetPassword.html");
}
const AuthenticationController = {
    logIn: logIn,
    signUp: signUp,
    resetPassword: resetPassword
}

module.exports = AuthenticationController