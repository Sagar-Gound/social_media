import React, { useState, useEffect } from "react";
import "./rightbar.css";
import { Users } from "../../dummyData";
import Online from "../online/Online";
import axios from "axios";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Add, Remove } from "@mui/icons-material";
import { getAllFriends } from "../../apiCalls";

export default function Rightbar({ user }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [friendsDetail, setFriendsDetail] = useState([]);
  const [loadingFriends, setLoadingFriends] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const { user: currentUser, dispatch } = useContext(AuthContext);
  const [followed, setFollowed] = useState(false);

  useEffect(() => {
    setFollowed(currentUser.followings.includes(user?._id));
  }, [currentUser, user._id]);

  useEffect(() => {
    const getFriends = async () => {
      try {
        setLoadingFriends(true);
        // Use the getAllFriends API to get current user's friends
        const result = await getAllFriends(currentUser._id);

        if (result.success) {
          setFriendsDetail(result.data);
        } else {
          console.error("Error fetching friends:", result.error);
          setFriendsDetail([]);
        }
      } catch (error) {
        console.error("Error fetching friends:", error);
        setFriendsDetail([]);
      } finally {
        setLoadingFriends(false);
      }
    };

    if (currentUser?._id) {
      getFriends();
    }
  }, [currentUser._id, currentUser.followings]); // Re-fetch when followings change


  const handleClick = async () => {
    if (followLoading) return; // Prevent multiple clicks

    try {
      setFollowLoading(true);

      if (followed) {
        await axios.put("/users/" + user._id + "/unfollow", {
          userId: currentUser._id,
        });
        dispatch({ type: "UNFOLLOW", payload: user._id });
      } else {
        await axios.put("/users/" + user._id + "/follow", {
          userId: currentUser._id,
        });
        dispatch({ type: "FOLLOW", payload: user._id });
      }
      setFollowed(!followed);

      // Refresh friends list after follow/unfollow action
      setTimeout(async () => {
        try {
          setLoadingFriends(true);
          const result = await getAllFriends(currentUser._id);
          if (result.success) {
            setFriendsDetail(result.data);
          }
        } catch (error) {
          console.error("Error refreshing friends:", error);
        } finally {
          setLoadingFriends(false);
        }
      }, 500); // Small delay to ensure backend is updated
    } catch (error) {
      console.log(error);
    } finally {
      setFollowLoading(false);
    }
  };

  const HomeRightbar = () => {
    return (
      <>
        <div className="birthdayContainer">
          <img src="assets/gift.png" alt="Birthday gift" className="birthdayImg" />
          <span className="birthdayText">
            <b>Pola Fester</b> and <b>3 other friends</b> have a birthday today
          </span>
        </div>

        <img src="assets/ad.png" alt="Advertisement" className="rightbarAd" />

        <h4 className="rightbarTitle">Online Friends</h4>
        <ul className="rightbarFriendList">
          {Users.map((u) => (
            <Online key={u.id} user={u} />
          ))}
        </ul>
      </>
    );
  };

  const ProfileRightbar = () => {
    return (
      <>
        {user.username !== currentUser.username && (
          <button
            className="rightbarFollowButton"
            onClick={handleClick}
            disabled={followLoading}
          >
            {followLoading ? (
              <>
                <div className="loadingSpinner"></div>
                {followed ? "Unfollowing..." : "Following..."}
              </>
            ) : (
              <>
                {followed ? "Unfollow" : "Follow"}
                {followed ? <Remove /> : <Add />}
              </>
            )}
          </button>
        )}

        <h4 className="rightbarTitle">User Information</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">City:</span>
            <span className="rightbarInfoValue">{user.city || "Not specified"}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">From:</span>
            <span className="rightbarInfoValue">{user.from || "Not specified"}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Relationship:</span>
            <span className="rightbarInfoValue">
              {user.relationship === 1
                ? "Single"
                : user.relationship === 2
                  ? "Married"
                  : "Not specified"}
            </span>
          </div>
        </div>

        <h4 className="rightbarTitle">
          User Friends ({friendsDetail.length})
        </h4>
        <div className="rigthbarFollowings">
          {loadingFriends ? (
            <div className="friendsSkeleton">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="friendSkeletonItem">
                  <div className="skeletonAvatar"></div>
                  <div className="skeletonName"></div>
                </div>
              ))}
            </div>
          ) : friendsDetail.length > 0 && (
            friendsDetail.map((friend, idx) => (
              <Link
                key={friend._id || idx}
                to={`/profile/${friend._id}`}
                style={{ textDecoration: "none" }}
                className="rightbarFollowing"
              >
                <img
                  src={
                    friend.profilePicture
                      ? PF + friend.profilePicture
                      : PF + "profile/noAvatar.png"
                  }
                  alt={friend.username}
                  className="rightbarFollowingImg"
                  loading="lazy"
                />
                <span className="rightbarFollowingName">
                  {friend.username}
                </span>
              </Link>
            ))
          )}
        </div>
        {friendsDetail.length === 0 && (
          <div className="noFriendsMessage">
            <p>No friends yet. Start following people to see them here!</p>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {currentUser ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div>
  );
}
