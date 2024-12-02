import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs/promises';

dotenv.config();

cloudinary.config({
  cloud_name: 'drddzd0eh',
  secure: true,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

const upload = multer({ dest: 'temp/' });

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    console.log('File received:', req.file);
    const filePath = req.file.path;
    console.log('File path:', filePath);

    const result = await cloudinary.uploader.upload(filePath);
    console.log('Upload result:', result);

    await fs.unlink(filePath);
    console.log('File deleted');

    res.json({ url: result.secure_url });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
