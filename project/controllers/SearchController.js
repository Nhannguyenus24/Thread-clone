import UserModel from '../models/UserModel.js';
import FollowModel from '../models/FollowModel.js';
import jwt from "jsonwebtoken";
import { query } from 'express';

const loadSearch = async (req, res) => {
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
    const userId = decode.userId;
    const searchQuery = req.query.q || '';
    const users = await UserModel.find({ _id: { $ne: userId } });

    const followData = await FollowModel.findOne({ userId });

    const followingUsernames = followData ? followData.followings.map(follow => follow.username) : [];

    const filteredProfiles = users.filter(user =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const result = filteredProfiles.map(user => {
        const isFollowing = followingUsernames.includes(user.username);
        return {
            avatar: user.avatar,
            username: user.username,
            bio: user.quote || '',
            status: isFollowing,
            followers: followData ? followData.followers.length : 0
        };
    });
    res.render("Search", { infomations: result});
} catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
}
};


const SearchController = {
    loadSearch: loadSearch,
}

export default SearchController;