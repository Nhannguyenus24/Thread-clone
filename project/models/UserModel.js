import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullname: { type: String, required: true },
  avatar: { type: String, default: "/image/anonymous-user.jpg" },
  quote: { type: String, default: "" },
});

const UserModel = mongoose.model("Users", UserSchema);

export default UserModel;
