import React, { useContext } from "react";
import "./topbar.css";
import { Search, Person, Chat, Notifications } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { AuthContext } from "./../../context/AuthContext";

export default function Topbar() {
  const { currentUser } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">BeSocial</span>
        </Link>
      </div>
      <div className="topbarCenter">
        <div className="searchbar">
          <Search className="searchIcon" />
          <input
            placeholder="Search for friend, post or video"
            className="searchInput"
          />
        </div>
      </div>
      <div className="topbarRight">
        <div className="topbarLinks">
          <span className="topbarLink">Homepage</span>
          <span className="topbarLink">Timeline</span>
        </div>
        <div className="topbarIcons">
          <div className="topbarIconItem">
            <Person sx={{ width: "22px", height: "22px" }} />
            <span className="topbarIconBadge">1</span>
          </div>
          <div className="topbarIconItem">
            <Chat sx={{ width: "22px", height: "22px" }} />
            <span className="topbarIconBadge">2</span>
          </div>
          <div className="topbarIconItem">
            <Notifications sx={{ width: "22px", height: "22px" }} />
            <span className="topbarIconBadge">1</span>
          </div>
        </div>
        <Link to={`/profile/${currentUser.username}`}>
          <img
            src={
              currentUser.profilePicture
                ? PF + currentUser.profilePicture
                : PF + "profile/noAvatar.png"
            }
            alt="profile pic"
            className="topbarImage"
          ></img>
        </Link>
      </div>
    </div>
  );
}
