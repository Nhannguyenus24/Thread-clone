const newThread = (req, res) => {
    res.render("New")
}

const NewThreadController = {
    newThread: newThread
}

export default NewThreadController;