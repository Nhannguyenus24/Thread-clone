

const loadSearch = (req, res) => {
    const profiles = [];
    res.render("Search", { infomations: profiles });
}

const SearchController = {
    loadSearch: loadSearch,
}

export default SearchController;