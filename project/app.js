import express from "express";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import database from "./service/ConnectDatabase.js";
import FeedRouter from "./routes/FeedRouter.js";
import SearchRouter from "./routes/SearchRouter.js";
import SettingRouter from "./routes/SettingRouter.js";
import AuthenticationRouter from "./routes/AuthenticationRouter.js";
import ProfileRouter from "./routes/ProfileRouter.js";
import NotificationRouter from "./routes/NotificationRouter.js";
import NewThreadRouter from "./routes/NewThreadRouter.js";
import expressHandlebars from "express-handlebars";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
database.connectDatabase();
const PORT = 3000;
const HOST = "localhost"; //localhost

// Cài đặt handlebars
const hbs = expressHandlebars.create({
  layoutsDir: path.join(__dirname, "/views/layouts"),
  partialsDir: path.join(__dirname, "/views/partials"),
  extname: "hbs",
  defaultLayout: "layout",
  helpers: {
    formatName: function (username, maxLineLength) {
      let formattedUsername = "";
      let currentLine = "";
    
      for (let i = 0; i < username.length; i++) {
        const char = username[i];
    
        currentLine += char;
    
        if (currentLine.length === maxLineLength) {
          formattedUsername += currentLine + "<br>";
          currentLine = ""; 
        }
      }
    
      if (currentLine.length > 0) {
        formattedUsername += currentLine;
      }
    
      return formattedUsername;
    },
    isGreaterThanZero: function(value) {
      if (!value) {
        return false;
      }
      return value > 0;
    },    
    eq: function (a, b) {
      return a === b;
    },
    formatTime: function (dateString) {
      const now = new Date();
      const inputDate = new Date(dateString);
      const diff = Math.floor((now - inputDate) / 1000);
    
      const pluralize = (value, unit) => `${value} ${unit}${value > 1 ? 's' : ''}`;
    
      if (diff < 60) {
        return pluralize(diff, "second");
      } else if (diff < 3600) {
        const minutes = Math.floor(diff / 60);
        return pluralize(minutes, "minute");
      } else if (diff < 86400) {
        const hours = Math.floor(diff / 3600);
        return pluralize(hours, "hour");
      } else if (diff < 2592000) {
        const days = Math.floor(diff / 86400);
        return pluralize(days, "day");
      } else if (diff < 31536000) {
        const months = Math.floor(diff / 2592000);
        return pluralize(months, "month");
      } else {
        const years = Math.floor(diff / 31536000);
        return pluralize(years, "year");
      }
    },
    formatFollows: function (numFollows) {
      if (typeof numFollows !== 'number') {
        return numFollows;
      }
    
      if (numFollows >= 1000000) {
        const mValue = (numFollows / 1000000).toFixed(1);
        return `${mValue}M`;
      }
      if (numFollows >= 10000) {
        const kValue = (numFollows / 1000).toFixed(1);
        return `${kValue}K`;
      }
      if (numFollows >= 1000) {
        return numFollows.toLocaleString('de-DE');
      }
      return numFollows.toString();
    }
  },
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true
}
});


app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST'],
  credentials: true
}));
app.options('*', cors());

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

app.use("/", FeedRouter);
app.use("/search", SearchRouter);
app.use("/setting", SettingRouter);
app.use("/", AuthenticationRouter);
app.use("/profile", ProfileRouter);
app.use("/notification", NotificationRouter);
app.use("/newthread", NewThreadRouter);

app.listen(PORT, HOST, () => {
  console.log(`Listening on http://${HOST}:${PORT}`);
});
