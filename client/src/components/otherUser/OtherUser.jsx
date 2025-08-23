import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { PersonAdd, PersonRemove } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import { AuthContext } from "../../context/AuthContext";
import { followUser, unfollowUser } from "../../apiCalls";
import "./otherUser.css";

export default function OtherUser({ user, onUserUpdate }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user: currentUser, dispatch } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Check if current user is following this user
  const isFollowing = currentUser?.followings?.includes(user._id);

  const handleFollowToggle = async (e) => {
    e.preventDefault(); // Prevent navigation when clicking the button
    e.stopPropagation();

    if (!currentUser) return;

    setIsLoading(true);

    try {
      if (isFollowing) {
        await unfollowUser(user._id, currentUser._id);
        // Update current user's followings list
        dispatch({
          type: "UNFOLLOW",
          payload: user._id
        });
      } else {
        await followUser(user._id, currentUser._id);
        // Update current user's followings list
        dispatch({
          type: "FOLLOW",
          payload: user._id
        });
      }

      // Show success feedback
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);

      // Callback to update the user list in parent component
      if (onUserUpdate) {
        onUserUpdate(user._id, !isFollowing);
      }
    } catch (error) {
      console.error("Error toggling follow status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="otherUserItem">
      <Link to={`/profile/${user._id}`} className="otherUserLink">
        <img
          className="otherUserImg"
          src={
            user.profilePicture
              ? PF + user.profilePicture
              : PF + "profile/noAvatar.png"
          }
          alt={user.username}
        />
        <div className="otherUserInfo">
          <span className="otherUserName">{user.username}</span>
          <span className="otherUserEmail">{user.email}</span>
        </div>
      </Link>
      <div className="otherUserStats">
        <button
          className={`followButton ${isFollowing ? 'following' : 'notFollowing'} ${showSuccess ? 'success' : ''}`}
          onClick={handleFollowToggle}
          disabled={isLoading}
          title={isFollowing ? 'Unfollow' : 'Follow'}
        >
          {isLoading ? (
            <CircularProgress size={16} sx={{ color: "inherit" }} />
          ) : showSuccess ? (
            '✓'
          ) : isFollowing ? (
            <PersonRemove sx={{ fontSize: 16 }} />
          ) : (
            <PersonAdd sx={{ fontSize: 16 }} />
          )}
        </button>
      </div>
    </div>
  );
}
