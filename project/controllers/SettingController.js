

const settingAccount = (req, res) => {
    res.render('Setting', { currentPage: 'account' });
}

const help = (req, res) => {
    const links = [];
    res.render('Setting', { currentPage: 'help', externals: links });
}
const SettingController = {
    settingAccount: settingAccount,
    help: help
}

export default SettingController;