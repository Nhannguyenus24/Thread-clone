import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  comment: { type: String, required: true },
  author: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const LikeSchema = new mongoose.Schema({
  author: { type: String, required: true },
});

const ThreadSchema = new mongoose.Schema({
  author: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String, default: "" },
  date: { type: Date, default: Date.now },
  comments: [CommentSchema],
  likes: [LikeSchema],
});

const ThreadModel = mongoose.model("Threads", ThreadSchema);

export default ThreadModel;
