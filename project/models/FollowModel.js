import mongoose from "mongoose";


const FollowSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
  followings: { type: [mongoose.Schema.Types.ObjectId], ref: 'Users', default: [] },
  followers: { type: [mongoose.Schema.Types.ObjectId], ref: 'Users', default: [] },
});

const FollowModel = mongoose.model("Follows", FollowSchema);

export default FollowModel;