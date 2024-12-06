import UserModel from "../models/UserModel.js";

const settingAccount = async (req, res) => {
  // const {username} = req.body;
  const username = "nhan1";
  try {
    const findUser = await UserModel.findOne({username: username});
    if(!findUser){
      res.status(404).json({message: "User not found"});
    }
    else {
      const resObject = {
        username: findUser.username,
        email: findUser.email,
        fullname: findUser.fullname,
        avatar: findUser.avatar,
        quote: findUser.quote,
        currentPage: 'account'
    };
      res.render('Setting', resObject);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Internal server error"});
  }
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

const changeSetting = async (req, res) => {
  const {username, field, value} = req.body;
  try {
    const findUser = await UserModel.findOne({username: username});
    if (field == "fullname")
      findUser.fullname = value;
    else if (field == "quote") 
      findUser.quote = value;
    else if (field == "username"){
      const checkUser = await UserModel.findOne({username: value});
      if (checkUser)
        res.status(400).json({success: false, message: "Username already exists"});
      else
        findUser.username = value;
    }
    else if (field == "email"){
      const checkEmail = await UserModel.findOne({email: value});
      if (checkEmail)
        res.status(400).json({success: false, message: "Email already exists"});
      else
        findUser.email = value;
    }
    await findUser.save();
    res.status(200).json({success: true});
  } catch (error) {
    console.log(error);
    res.status(500).json({success: false, message: "Internal server error"});
  }
}

const changePassword = async (req, res) => {
  const {username, currentPassword, newPassword} = req.body;
  try {
    const findUser = await UserModel.findOne({username: username});
    if (findUser.password != currentPassword)
      res.status(400).json({success: false, message: "Old password is incorrect"});
    else {
      findUser.password = newPassword;
      await findUser.save();
      res.status(200).json({success: true});
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({success: false, message: "Internal server error"});
  }
}

const SettingController = {
    settingAccount: settingAccount,
    help: help,
    changeSetting: changeSetting,
    changePassword: changePassword
}

export default SettingController;