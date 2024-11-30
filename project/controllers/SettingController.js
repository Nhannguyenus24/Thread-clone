

const settingAccount = (req, res) => {
    res.render('Setting', { currentPage: 'account' });
}

const help = (req, res) => {
  const links = [
    {
      content: "Trung tâm trợ giúp",
      link: "https://help.instagram.com/179980294969821/"
    },
    {
      content: "Chính sách quyền riêng tư của Meta",
      link: "https://www.facebook.com/privacy/policy/"
    },
    {
      content: "Điều khoản sử dụng của Meta",
      link: "https://help.instagram.com/581066165581870"
    },
    {
      content: "Chính sách quyền riêng tư bổ sung của Threads",
      link: "https://help.instagram.com/515230437301944"
    },
    {
      content: "Điều khoản sử dụng của Threads",
      link: "https://help.instagram.com/769983657850450"
    },
    {
      content: "Chính sách cookie",
      link: "https://privacycenter.instagram.com/policies/cookies/"
    },
    {
      content: "Hướng dẫn về mạng xã hội phi tập trung",
      link: "https://www.facebook.com/privacy/guide/fediverse/"
    }
  ];
    res.render('Setting', { currentPage: 'help', externals: links });
}
const SettingController = {
    settingAccount: settingAccount,
    help: help
}

export default SettingController;