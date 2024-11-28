const express = require("express");
const FeedRouter = require("./routes/FeedRouter");
const SearchRouter = require("./routes/SearchRouter");
const SettingRouter = require("./routes/SettingRouter");
const AuthenticationRouter = require("./routes/AuthenticationRouter");
const ProfileRouter = require("./routes/ProfileRouter");
const NotificationRouter = require("./routes/NotificationRouter");
const NewPostRouter = require("./routes/NewThreadRouter");
const app = express();
const PORT = 3000;
const HOST = 'localhost';
const expressHbs = require("express-handlebars");
app.use(express.json());
app.use(express.static(__dirname + "/public"));
const hbs = expressHbs.create({
  layoutsDir: __dirname + "/views/layouts",
  partialsDir: __dirname + "/views/partials",
  extname: "hbs",
  defaultLayout: "layout",
  helpers: {
    eq: function (a, b) {
      return a === b;
    },
  },
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");

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




app.use("/", FeedRouter);
app.use("/search", SearchRouter);
app.use("/setting", SettingRouter);
app.use("/", AuthenticationRouter);
app.use("/profile", ProfileRouter);
app.use("/notification", NotificationRouter);
app.use("/newpost", NewPostRouter);

app.listen(PORT, HOST, () => {
  console.log(`Listening on http://${HOST}:${PORT}`);
});