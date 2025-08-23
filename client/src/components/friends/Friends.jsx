import "./friends.css";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getAllFriends } from "../../apiCalls";
import PersonIcon from '@mui/icons-material/Person';
import MessageIcon from '@mui/icons-material/Message';

export default function Friends() {
  const { user } = useContext(AuthContext);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFriends = async () => {
      if (!user?._id) return;
      
      setLoading(true);
      const result = await getAllFriends(user._id);
      
      if (result.success) {
        setFriends(result.data);
        setError("");
      } else {
        setError(result.error);
      }
      
      setLoading(false);
    };

    fetchFriends();
  }, [user]);

  if (loading) {
    return (
      <div className="friends">
        <h4 className="friendsTitle">Friends</h4>
        <div className="friendsList">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="friendCard skeleton">
              <div className="friendImage skeleton-shimmer"></div>
              <div className="friendInfo">
                <div className="friendName skeleton-text"></div>
                <div className="friendUsername skeleton-text"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="friends">
        <h4 className="friendsTitle">Friends</h4>
        <div className="friendsError">
          <p>Failed to load friends: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="friends">
      <h4 className="friendsTitle">Friends ({friends.length})</h4>
      
      {friends.length === 0 ? (
        <div className="noFriends">
          <PersonIcon className="noFriendsIcon" />
          <p>No friends yet</p>
          <span>Start following people to see them here!</span>
        </div>
      ) : (
        <div className="friendsList">
          {friends.map((friend) => (
            <div key={friend._id} className="friendCard">
              <img
                className="friendImage"
                src={
                  friend.profilePicture
                    ? `/assets/profile/${friend.profilePicture}`
                    : "/assets/profile/noAvatar.png"
                }
                alt={friend.username}
              />
              <div className="friendInfo">
                <span className="friendName">
                  {friend.username}
                </span>
                <span className="friendUsername">
                  @{friend.username}
                </span>
              </div>
              <div className="friendActions">
                <button className="messageButton">
                  <MessageIcon className="messageIcon" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
