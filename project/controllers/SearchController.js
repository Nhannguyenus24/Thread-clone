import UserModel from '../models/UserModel.js';
import FollowModel from '../models/FollowModel.js';
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

const loadSearch = async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.redirect("/login");

  const decode = jwt.verify(token, process.env.JWT_SECRET);

  try {
      const userId = decode.userId;
      const searchQuery = req.query.q || '';
      
      const users = await UserModel.find({ _id: { $ne: userId } }).lean();

      const followData = await FollowModel.findOne({ userId }).lean();

      const followingUserIds = followData ? followData.followings : [];
      const filteredProfiles = users.filter(user =>
          user.username.toLowerCase().includes(searchQuery.toLowerCase())
      );

      const result = await Promise.all(filteredProfiles.map(async user => {
        const userFollowData = await FollowModel.findOne({ userId: user._id }).lean();
        const isFollowing = followingUserIds.some(followingId => followingId.equals(user._id));
        
        return {
            id: user._id,
            avatar: user.avatar,
            username: user.username,
            bio: user.quote || '',
            status: isFollowing, 
            followers: userFollowData ? userFollowData.followers.length : 0
        };
    }));
      res.render("Search", { infomations: result });
  } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Internal server error" });
  }
};



const SearchController = {
    loadSearch: loadSearch,
}

export default SearchController;