import "./assets/App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import Personal from "./components/Personal";
import Notification from "./components/Notification";
import Feed from "./components/Feed";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<NavigationBar />}>
          <Route index element={<Feed />} />
          <Route path="personal" element={<Personal />} />
          <Route path="notification" element={<Notification />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;