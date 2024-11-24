const loadProfile = (req, res) => {
    res.render("Profile");
}

const ProfileController = {
    loadProfile: loadProfile,
};

module.exports = ProfileController;