import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  // _id: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullname: { type: String, default: "" },
  avatar: { type: String, default: "/image/anonymous-user.jpg" },
  quote: { type: String, default: "" },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String, default: null },
  verificationExpires: { type: Date, default: Date.now() + 300000 },
});

const UserModel = mongoose.model("Users", UserSchema);

export default UserModel;
