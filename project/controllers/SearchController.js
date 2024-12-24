import UserModel from '../models/UserModel.js';
import FollowModel from '../models/FollowModel.js';
import jwt from "jsonwebtoken";

const loadSearch = async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.redirect("/login");

  const decode = jwt.verify(
      token,
      "741017f64f83c6884e275312409462130e6b4ad31a651a1d66bf7ca08ef64ca4377e229b4aa54757dfefc268d6dbca0f075bda7a23ea913666e4a78102896f60"
  );

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