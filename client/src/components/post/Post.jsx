import { MoreVertOutlined, DeleteOutlined } from "@mui/icons-material";
import { Link } from "react-router-dom";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { format } from "timeago.js";
import _ from "lodash";
import "./post.css";
import { AuthContext } from "./../../context/AuthContext";
import ConfirmModal from "../confirmModal/ConfirmModal";
import Toast from "../toast/Toast";

export default function Post({ post, onDeletePost }) {
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState({});
  const [userLoading, setUserLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [likingInProgress, setLikingInProgress] = useState(false);
  const [likeCountUpdated, setLikeCountUpdated] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [toastConfig, setToastConfig] = useState({ isVisible: false, message: '', type: 'success' });
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user: currentUser } = useContext(AuthContext);

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id));
  }, [currentUser._id, post.likes]);

  useEffect(() => {
    const fetchUser = async () => {
      setUserLoading(true);
      try {
        const res = await axios.get(`/users/${post.userId}`);
        setUser(res.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setUserLoading(false);
      }
    };
    fetchUser();
  }, [post.userId]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.postOptionsWrapper')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const likeHandler = async () => {
    if (likingInProgress) return;
    
    setLikingInProgress(true);
    const newLikedState = !isLiked;
    const newLikeCount = newLikedState ? like + 1 : like - 1;
    
    // Optimistic update
    setLike(newLikeCount);
    setIsLiked(newLikedState);
    setLikeCountUpdated(true);
    
    // Reset animation class after animation completes
    setTimeout(() => setLikeCountUpdated(false), 400);
    
    try {
      await axios.put("/posts/" + post._id + "/like", { userId: currentUser._id });
    } catch (err) {
      // Revert optimistic update on error
      setLike(like);
      setIsLiked(isLiked);
      console.error("Error liking post:", err);
    } finally {
      setLikingInProgress(false);
    }
  };

  const deleteHandler = async () => {
    setIsDeleting(true);
    setShowDropdown(false);
    
    try {
      await axios.delete(`/posts/${post._id}`, {
        data: { userId: currentUser._id }
      });
      
      // Show success toast
      setToastConfig({
        isVisible: true,
        message: 'Post deleted successfully!',
        type: 'success'
      });
      
      // Call the callback to remove the post from the parent component
      if (onDeletePost) {
        setTimeout(() => {
          onDeletePost(post._id);
        }, 300); // Small delay for animation
      }
      
    } catch (error) {
      console.error("Error deleting post:", error);
      setToastConfig({
        isVisible: true,
        message: 'Failed to delete post. Please try again.',
        type: 'error'
      });
      setIsDeleting(false);
    } finally {
      setShowConfirmModal(false);
    }
  };

  const handleDeleteClick = () => {
    setShowConfirmModal(true);
    setShowDropdown(false);
  };

  const closeToast = () => {
    setToastConfig(prev => ({ ...prev, isVisible: false }));
  };

  // Loading skeleton component
  const UserSkeleton = () => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div className="skeletonCircle"></div>
      <div style={{ marginLeft: '12px', flex: 1 }}>
        <div className="skeletonLine" style={{ width: '120px', height: '16px', marginBottom: '4px' }}></div>
        <div className="skeletonLine" style={{ width: '80px', height: '12px' }}></div>
      </div>
    </div>
  );

  return (
    <div className={`post ${isDeleting ? 'deleting' : ''}`}>
      {isDeleting && (
        <div className="postLoadingOverlay">
          <div className="postLoadingSpinner"></div>
          <span className="postLoadingText">Deleting post...</span>
        </div>
      )}
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            {userLoading ? (
              <UserSkeleton />
            ) : (
              <Link
                style={{
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                }}
                to={`/profile/${user._id}`}
              >
                <img
                  src={
                    user.profilePicture
                      ? PF + user.profilePicture
                      : PF + "profile/noAvatar.png"
                  }
                  alt=""
                  className="postProfileImg"
                />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span className="postUserName">
                    {_.startCase(_.camelCase(user.username))}
                  </span>
                  <span className="postDate">{format(post.createdAt)}</span>
                </div>
              </Link>
            )}
          </div>
          <div className="postTopRight">
            {currentUser._id === post.userId && (
              <div className="postOptionsWrapper">
                <MoreVertOutlined 
                  className="postOptionsIcon"
                  onClick={() => setShowDropdown(!showDropdown)}
                />
                {showDropdown && (
                  <div className="postDropdown">
                    <div 
                      className={`postDropdownItem delete ${isDeleting ? 'disabled' : ''}`}
                      onClick={handleDeleteClick}
                    >
                      <DeleteOutlined className="dropdownIcon" />
                      Delete Post
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{post?.desc}</span>
          {post.img && (
            <>
              {imageLoading && <div className="imageLoading"></div>}
              <img 
                className="postImg" 
                src={post.img.startsWith('http') 
                  ? post.img 
                  : `${process.env.REACT_APP_API_URL || 'http://localhost:4000'}/images/posts/${post.img}`
                } 
                alt=""
                onLoad={() => setImageLoading(false)}
                onError={() => setImageLoading(false)}
                style={{ display: imageLoading ? 'none' : 'block' }}
              />
            </>
          )}
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <div className="likeButton" onClick={likeHandler}>
              <img
                className={`likeIcon ${isLiked ? 'liked' : ''}`}
                src={`${PF}heart.png`}
                alt=""
                style={{ opacity: likingInProgress ? 0.7 : 1 }}
              />
              <span className={`postLikeCounter ${likeCountUpdated ? 'updated' : ''}`}>
                {like} {like === 1 ? 'person likes' : 'people like'} it
              </span>
            </div>
          </div>
          <div className="postBottomRight">
            <span className="postCommentText">{post.comment} comments</span>
          </div>
        </div>
      </div>
      
      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={deleteHandler}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
        loading={isDeleting}
      />
      
      {/* Toast Notification */}
      <Toast
        message={toastConfig.message}
        type={toastConfig.type}
        isVisible={toastConfig.isVisible}
        onClose={closeToast}
      />
    </div>
  );
}
