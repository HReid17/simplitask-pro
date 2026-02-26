import "./TopBar.css";
import Searchbar from "./Searchbar";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

const TopBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  // Optional fallback if user isn't loaded yet
  if (!user) return null;

  console.log("TopBar user:", user);

  return (
    <div className="top">
      <div className="searchbar">
        <Searchbar />
      </div>

      <div className="profile">
        <h4>{user.username}</h4>
        <span className="avatar">
          {user.username?.[0]?.toUpperCase()}
        </span>

        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </div>
  );
};

export default TopBar;