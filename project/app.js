const express = require("express");
const app = express();
const { threads, notifications, profiles } = require("./data");
const PORT = 3000;
const HOST = 'localhost';

const expressHbs = require("express-handlebars");

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