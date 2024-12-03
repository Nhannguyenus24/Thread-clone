import FollowModel from '../models/FollowModel.js';

const loadProfile = async (req, res) => {
    // Dữ liệu mẫu
    const followers = [
        {
            avatar: '/image/avatar_1.0.jpg',
            username: "Spectacular",
            fullname: "Anh Hùng",
            status: "Đang Theo dõi"
        },
        {
            avatar: '/image/avatar_1.0.jpg',
            username: "Betagen 22",
            fullname: "Trâm Anh",
            status: "Đang Theo dõi"
        },
        {
            avatar: '/image/avatar_1.0.jpg',
            username: "",
            fullname: "Thế Phiệt",
            status: "Đang Theo dõi"
        },
    ];

    // Tính số lượng followers
    const followerCount = followers.length;

    // Render view "Profile" với dữ liệu mẫu
    res.render("Profile", { followers, followerCount });
};

const ProfileController = {
    loadProfile: loadProfile,
};

export default ProfileController;
