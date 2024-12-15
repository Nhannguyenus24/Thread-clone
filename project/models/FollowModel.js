import mongoose from "mongoose";

const UserFollowSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
  username: { type: String, required: true },
  avatar: { type: String, default: "/image/anonymous-user.jpg" }
});

const FollowSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
  followings: {type: [UserFollowSchema], default: []},
  followers: {type: [UserFollowSchema], default: []}
});

const FollowModel = mongoose.model("Follows", FollowSchema);

export default FollowModel;
