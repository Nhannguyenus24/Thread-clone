import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import connectDatabase from "./service/ConnectDatabase.js";
import FeedRouter from "./routes/FeedRouter.js";
import SearchRouter from "./routes/SearchRouter.js";
import SettingRouter from "./routes/SettingRouter.js";
import AuthenticationRouter from "./routes/AuthenticationRouter.js";
import ProfileRouter from "./routes/ProfileRouter.js";
import NotificationRouter from "./routes/NotificationRouter.js";
import NewPostRouter from "./routes/NewThreadRouter.js";
import expressHandlebars from "express-handlebars";
connectDatabase();
// Xử lý __dirname trong ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const HOST = "localhost";

// Cài đặt handlebars
const hbs = expressHandlebars.create({
  layoutsDir: path.join(__dirname, "/views/layouts"),
  partialsDir: path.join(__dirname, "/views/partials"),
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


app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

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
