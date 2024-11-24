const {links} = require("../data");

const settingAccount = (req, res) => {
    res.render('Setting', { currentPage: 'account' });
}

const help = (req, res) => {
    res.render('Setting', { currentPage: 'help', externals: links });
}
const SettingController = {
    settingAccount: settingAccount,
    help: help
}

module.exports = SettingController;