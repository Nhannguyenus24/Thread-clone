import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();
const sendMail = async (to, subject, htmlContent) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "nnstbtdclhacctqk@gmail.com",
            pass: "cjrr doat nsdu qdau",
        },
    });

    const mailOptions = {
        from: "nnstbtdclhacctqk@gmail.com",
        to: to,
        subject: subject,
        html: htmlContent,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Email đã được gửi tới:", to);
    } catch (error) {
        console.error("Lỗi khi gửi email:", error);
    }
};

export default sendMail;
