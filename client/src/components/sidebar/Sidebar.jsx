import React, { useState, useEffect, useContext } from 'react'
import { RssFeed } from "@mui/icons-material";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import PlayCircleOutlinedIcon from "@mui/icons-material/PlayCircleOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import { Users } from '../../dummyData'
import "./sidebar.css";
import CloseFriend from "../closeFriend/CloseFriend";
import OtherUser from "../otherUser/OtherUser";
import Friends from "../friends/Friends";
import { getAllUsers } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";

export default function Sidebar() {
  const [otherUsers, setOtherUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMore, setShowMore] = useState(false);
  const { user: currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const allUsers = await getAllUsers();
        // Filter out the current user
        const filteredUsers = allUsers.filter(user => user._id !== currentUser?._id);
        setOtherUsers(filteredUsers);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        // Fallback to empty array if API fails
        setOtherUsers([]);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchUsers();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const handleUserUpdate = (userId, isNowFollowing) => {
    // Update the followers count for the user
    setOtherUsers(prevUsers =>
      prevUsers.map(user => {
        if (user._id === userId) {
          return {
            ...user,
            followers: isNowFollowing
              ? [...(user.followers || []), currentUser._id]
              : (user.followers || []).filter(id => id !== currentUser._id)
          };
        }
        return user;
      })
    );
  };

  // Show only first 5 users initially, or all if showMore is true
  const displayedUsers = showMore ? otherUsers : otherUsers.slice(0, 5);
  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <ul className="sidebarList">
          <li className="sidebarListItem">
            <RssFeed className="sidebarIcon" />
            <span className="sidebarListItemText">Feed</span>
          </li>
          <li className="sidebarListItem">
            <ChatOutlinedIcon className="sidebarIcon" />
            <span className="sidebarListItemText">Chat</span>
          </li>
          <li className="sidebarListItem">
            <PlayCircleOutlinedIcon className="sidebarIcon" />
            <span className="sidebarListItemText">Video</span>
          </li>
          <li className="sidebarListItem">
            <PeopleOutlinedIcon className="sidebarIcon" />
            <span className="sidebarListItemText">Groups</span>
          </li>
          <li className="sidebarListItem">
            <BookmarkBorderOutlinedIcon className="sidebarIcon" />
            <span className="sidebarListItemText">Bookmarks</span>
          </li>
          <li className="sidebarListItem">
            <HelpOutlineOutlinedIcon className="sidebarIcon" />
            <span className="sidebarListItemText">Questions</span>
          </li>
          <li className="sidebarListItem">
            <WorkOutlineOutlinedIcon className="sidebarIcon" />
            <span className="sidebarListItemText">Jobs</span>
          </li>
          <li className="sidebarListItem">
            <EventOutlinedIcon className="sidebarIcon" />
            <span className="sidebarListItemText">Events</span>
          </li>
          <li className="sidebarListItem">
            <SchoolOutlinedIcon className="sidebarIcon" />
            <span className="sidebarListItemText">Courses</span>
          </li>
        </ul>
        <button className="sidebarButton" onClick={() => setShowMore(!showMore)}>
          {showMore ? "Show Less" : "Show More"}
        </button>

        {/* Close Friends Section */}
        {/* <div className="sidebarSection">
          <hr className="sidebarHr" />
          <h4 className="sidebarSectionTitle">Close Friends</h4>
          <ul className="sidebarFriendList">
            {Users.slice(0, 3).map(u => (
              <CloseFriend user={u} key={u.id} />
            ))}
          </ul>
        </div> */}

        <hr className="sidebarHr" />

        {/* Friends Section */}
        <Friends />

        <hr className="sidebarHr" />

        {/* Other Users Section */}
        <div className="sidebarSection">
          <h4 className="sidebarSectionTitle">
            Other Users ({otherUsers.length})
          </h4>
          {loading ? (
            <div className="loadingContainer">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="userSkeleton">
                  <div className="skeletonAvatar"></div>
                  <div className="skeletonContent">
                    <div className="skeletonName"></div>
                    <div className="skeletonEmail"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : otherUsers.length > 0 ? (
            <>
              <div className="otherUsersList">
                {displayedUsers.map(user => (
                  <OtherUser
                    user={user}
                    key={user._id}
                    onUserUpdate={handleUserUpdate}
                  />
                ))}
              </div>
              {otherUsers.length > 5 && (
                <button
                  className="showMoreUsersButton"
                  onClick={() => setShowMore(!showMore)}
                >
                  {showMore ? "Show Less" : `Show ${otherUsers.length - 5} More`}
                </button>
              )}
            </>
          ) : (
            <div className="noUsersMessage">No other users found</div>
          )}
        </div>
      </div>
    </div>
  );
}
