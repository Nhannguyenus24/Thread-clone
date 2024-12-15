import database from '../service/ConnectDatabase.js';
import ThreadModel from '../models/ThreadModel.js';
import UserModel from '../models/UserModel.js';
import multer from 'multer';
import jwt from "jsonwebtoken";

const upload = multer({ dest: 'temp/' });

const newThread = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    res.redirect("/login");
    return;
  }
  const decode = jwt.verify(
    token,
    "741017f64f83c6884e275312409462130e6b4ad31a651a1d66bf7ca08ef64ca4377e229b4aa54757dfefc268d6dbca0f075bda7a23ea913666e4a78102896f60"
  );
    try {
        const findUser = await UserModel.findOne({ _id: decode.userId }).lean();
        if (!findUser) {
            res.status(404).json({ message: "User not found" });
        }
        const object = {
            username: findUser.username,
            avatar: findUser.avatar,
        }
    res.render("New", object);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: error.message });
    }
}

const uploadThread = async (req, res) => {
    const token = req.cookies.token;
    if (!token) 
      return res.redirect("/login");
    const decode = jwt.verify(
    token,
    "741017f64f83c6884e275312409462130e6b4ad31a651a1d66bf7ca08ef64ca4377e229b4aa54757dfefc268d6dbca0f075bda7a23ea913666e4a78102896f60"
    );
    try {
        upload.single('file')(req, res, async (err) => {
            if (err) 
                return res.status(400).json({ error: 'File upload error'});
            
            const findUser = await UserModel.findOne({ _id: decode.userId });
            if (!findUser)
                return res.status(404).json({ message: 'User not found'});

            const {content } = req.body;

            let imageUrl = "";

            if (req.file) {
                const filePath = req.file.path;

                try {
                    const result = await database.cloudinary.uploader.upload(filePath);
                    imageUrl = result.secure_url;
                } catch (uploadErr) {
                    console.error('Error uploading to Cloudinary:', uploadErr);
                    return res.status(500).json({ error: 'Failed to upload image'});
                }
            }

            const newThread = new ThreadModel({
                authorId: findUser._id,
                author: findUser.username,
                content: content,
                image: imageUrl,
            });

            try {
                await newThread.save();
                res.status(201).json({ message: 'Thread created successfully'});
            } catch (saveErr) {
                console.error('Error saving thread:', saveErr);
                res.status(500).json({ error: 'Failed to save thread'});
            }
        });
    } catch (err) {
        console.error('Error:', err.message);
        res.status(500).json({ error: err.message});
    }
};

const NewThreadController = {
    newThread: newThread,
    uploadThread: uploadThread
}

export default NewThreadController;