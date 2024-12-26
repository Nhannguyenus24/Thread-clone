import UserModel from "../models/UserModel.js";
import database from '../service/ConnectDatabase.js';
import jwt from "jsonwebtoken";
import multer from "multer";
import dotenv from 'dotenv';
dotenv.config();

const upload = multer({ dest: "temp/" });

const settingAccount = async (req, res) => {
  const token = req.cookies.token;
  if (!token)
    return res.redirect("/login");
  const decode = jwt.verify(token, process.env.JWT_SECRET);
  try {
    const findUser = await UserModel.findOne({ _id: decode.userId }).lean();
    if (!findUser) {
      res.redirect("/login");
    } else {
      const resObject = {
        username: findUser.username,
        email: findUser.email,
        fullname: findUser.fullname,
        avatar: findUser.avatar,
        quote: findUser.quote,
        currentPage: "account",
      };
      res.render("Setting", resObject);
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const help = (req, res) => {
    if (!req.cookies.token)
      return res.redirect("/login");
  const links = [
    {
      content: "Help Center",
      link: "https://help.instagram.com/179980294969821/",
    },
    {
      content: "Meta's Privacy Policy",
      link: "https://www.facebook.com/privacy/policy/",
    },
    {
      content: "Meta's Terms of Service",
      link: "https://help.instagram.com/581066165581870",
    },
    {
      content: "Threads' Additional Privacy Policy",
      link: "https://help.instagram.com/515230437301944",
    },
    {
      content: "Threads' Terms of Service",
      link: "https://help.instagram.com/769983657850450",
    },
    {
      content: "Cookie Policy",
      link: "https://privacycenter.instagram.com/policies/cookies/",
    },
    {
      content: "Guide to Decentralized Social Networks",
      link: "https://www.facebook.com/privacy/guide/fediverse/",
    },
  ];
  res.render("Setting", { currentPage: "help", externals: links });
};

const validateUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9.-_]{1,20}$/;
  return usernameRegex.test(username);
};

const changeSetting = async (req, res) => {
  const { field, value } = req.body;
  const token = req.cookies.token;
  if (!req.cookies.token)
    return res.redirect("/login");
  const decode = jwt.verify(token, process.env.JWT_SECRET);
  try {
    const findUser = await UserModel.findOne({ _id: decode.userId });
    if (field == "fullname") findUser.fullname = value;
    else if (field == "quote") findUser.quote = value;
    else if (field == "username") {
      const checkUser = await UserModel.findOne({ username: value });
      if (checkUser){
        return res.status(400).json({ message: "Username already exists" });
      }
      else if (!validateUsername(value)){
        return res.status(400).json({ message: "Invalid username" });
      }
      else findUser.username = value;
    } else if (field == "email") {
      const checkEmail = await UserModel.findOne({ email: value });
      if (checkEmail){
        return res.status(400).json({message: "Email already exists" });}
      else findUser.email = value;
    }
    await findUser.save();
    res.status(200).json({message: "Change successfully" });
  } catch (error) {
    res.status(500).json({message: "Internal server error" });
  }
};

const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const token = req.cookies.token;
  if (!token)
    return res.redirect("/login");
  const decode = jwt.verify(token, process.env.JWT_SECRET);
  try {
    const findUser = await UserModel.findOne({ _id: decode.userId });
    if (findUser.password != currentPassword)
      res
        .status(400)
        .json({message: "Old password is incorrect" });
    else {
      findUser.password = newPassword;
      await findUser.save();
      res.status(200).json({ message: "Change password successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const changeAvatar = async (req, res) => {
  const token = req.cookies.token;
  if (!token)
    return res.redirect("/login");
  const decode = jwt.verify(token, process.env.JWT_SECRET);
  try {
    upload.single("file")(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: "File upload error" });
      }
      const findUser = await UserModel.findOne({ _id: decode.userId });
      const filePath = req.file.path;
      try {
        const result = await database.cloudinary.uploader.upload(filePath);
        findUser.avatar = result.secure_url;
        await findUser.save();
        res.status(201).json({ message: "Avatar changed successfully", link: result.secure_url });
      } catch (uploadErr) {
        console.error("Error uploading to Cloudinary:", uploadErr);
        res.status(500).json({ message: "Failed to upload image" });
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const SettingController = {
  settingAccount: settingAccount,
  help: help,
  changeSetting: changeSetting,
  changePassword: changePassword,
  changeAvatar: changeAvatar,
};

export default SettingController;