import React, { useEffect, useState } from "react";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
// import Rightbar from "./../../components/rightbar/Rightbar";
import Feed from "../../components/feed/Feed";
import "./profile.css";
import axios from "axios";
import { useParams } from "react-router";
import Rightbar from "../../components/rightbar/Rightbar";

export default function Profile() {
  const [user, setUser] = useState({});

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const userId = useParams().id;

  // console.log("userId", userId);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users/${userId}`);
      // console.log("res new => ", res); 
      setUser(res.data);
    };
    fetchUser();
  }, [userId]);

  return (
    <>
      <Topbar />
      <div className="profile">
        <Sidebar />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              <img
                className="profileCoverImg"
                src={
                  user.coverPicture
                    ? PF + user.coverPicture
                    : PF + "profile/noCover.png"
                }
                alt=""
              />
              <img
                className="profileUserImg"
                src={
                  user.ProfilePicture
                    ? PF + user.ProfilePicture
                    : PF + "profile/noAvatar.png"
                }
                alt=""
              />
            </div>
            <div className="profileInfo">
              <h4 className="profileInfoName">{user.username}</h4>
              <span className="profileInfoDesc">{user.desc}</span>
            </div>
          </div>
          <div className="profileRightBottom">
            <Feed userId={user._id} />
            <Rightbar user={user} />
          </div>
        </div>
      </div>
    </>
  );
}
