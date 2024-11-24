const express = require("express");
const app = express();
const { threads, notifications, profiles } = require("./data");
const PORT = 3000;
const HOST = 'localhost';
const expressHbs = require("express-handlebars");


const models = require("./models");

app.get('/sync', (req, res) => {
  models.sequelize.sync().then( () => {
    res.send('Database sync completed!');
  });
});


app.get('/create', function(req, res) {

  models.user
  .create({
    user_name: "tranductung",
    pass: "12345",
    gmail: "tranductung07012004@gmail.com",
    display_name: "tung tran",
    profile_picture: "ajshd",
    quote: "co gang nao!"
  })
  .then(function(user) {
    res.json(user);
  })
  .catch(function(error) {
    res.json(error);
  })


  models.posts
  .create({
    author: "1",
    text_content: "haha, that la buon cuoi ma",
    picture_url: "vai ca nho",
  })
  .then(function(post) {
    res.json(post);
  })
  .catch(function(error) {
    res.json(error);
  })

  models.comments
  .create({
    from_user: "1",
    to_post: '1',
    text_content: "Cha ca gi buon cuoi ca do ga",
  })
  .then(function(comment) {
    res.json(comment);
  })
  .catch(function(error) {
    res.json(error)
  })

  models.likes
  .create({
    from_user: '1',
  })
  .then(function(user) {
    res.json(user);
  })
  .catch(function(error) {
    res.json(error);
  })
});

app.use(express.static(__dirname + "/public"));
app.engine(
  "hbs",
  expressHbs.engine({
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials",
    extname: "hbs",
    defaultLayout: "layout",
  })
);
app.set("view engine", "hbs");

app.get('/', (req, res) => {
  res.render('Feed', { threads: threads });
});
app.get("/profile", (req, res) =>
  res.render("Profile")
);
app.get("/newpost", (req, res) =>
  res.render("New")
);
app.get("/notification", (req, res) =>
  res.render("Notification", { notifications: notifications })
);
app.get("/search", (req, res) =>
  res.render("Search", { infomations: profiles })
);

app.get("/login", (req, res) => 
  res.sendFile(__dirname + "/views/LogInPage.html")
);

app.get("/signup", (req, res) =>
  res.sendFile(__dirname + "/views/Register.html")
);

app.get("/resetpassword", (req, res) => 
  res.sendFile(__dirname + "/views/GetPassword.html")
);

app.get("/setting", (req, res) =>
  res.render("Setting")
);
app.listen(PORT, HOST, () => {
  console.log(`Listening on http://${HOST}:${PORT}`);
});