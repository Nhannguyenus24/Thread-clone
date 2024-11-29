const {profiles} = require("../data");

const loadSearch = (req, res) => {
    res.render("Search", { infomations: profiles });
}

const SearchController = {
    loadSearch: loadSearch,
}

export default SearchController;