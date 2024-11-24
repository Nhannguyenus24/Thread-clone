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


app.use("/", FeedRouter);
app.use("/search", SearchRouter);
app.use("/setting", SettingRouter);
app.use("/", AuthenticationRouter);
app.use("/profile", ProfileRouter);
app.use("/notifications", NotificationRouter);
app.use("/newthread", NewPostRouter);

app.listen(PORT, HOST, () => {
  console.log(`Listening on http://${HOST}:${PORT}`);
});