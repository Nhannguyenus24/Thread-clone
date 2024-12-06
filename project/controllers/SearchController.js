import UserModel from '../models/UserModel.js';

const loadSearch = async (req, res) => {
  const searchQuery = req.query.q || ""; 
  console.log(searchQuery);

  // Dữ liệu mẫu
  const profiles = [
    {
      avatar: '/image/avatar_1.0.jpg',
      username: "John Doe",
      bio: "Web developer and tech enthusiast.",
      status: "Theo dõi",
      followers: 120,
    },
    {
      avatar: '/image/anonymous-user.jpg',
      username: "Alice Smith",
      bio: "UI/UX designer.",
      status: "Theo dõi",
      followers: 80,
    },
    {
      avatar: '/image/anonymous-user.jpg',
      username: "Bob Brown",
      bio: "Freelancer.",
      status: "Đang theo dõi",
      followers: 45,
    },
  ];

  const filteredProfiles = profiles.filter(profile =>
    profile.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  res.render("Search", { infomations: filteredProfiles, searchQuery });
};


const SearchController = {
    loadSearch: loadSearch,
}

export default SearchController;