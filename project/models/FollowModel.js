import mongoose from "mongoose";

const UserFollowSchema = new mongoose.Schema({
  username: { type: String, required: true },
  avatar: { type: String, default: "/image/anonymous-user.jpg" }
});

const FollowSchema = new mongoose.Schema({
  username: {type: String, required: true, unique: true},
  followings: {type: [UserFollowSchema], default: []},
  followers: {type: [UserFollowSchema], default: []}
});

const FollowModel = mongoose.model("Follows", FollowSchema);

export default FollowModel;
