import React, { useContext, useEffect, useState, useCallback } from "react";
import Post from "../post/Post";
import Share from "../share/Share";
import "./feed.css";
import axios from "../../config/axiosConfig.js";
import { AuthContext } from "./../../context/AuthContext";
import { useParams } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';

export default function Feed({ username }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const { id } = useParams();
  console.log(id);
  
  const { user: currentUser } = useContext(AuthContext);

  // Function to fetch posts with proper error handling
  const fetchPosts = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      if (!currentUser?._id) {
        throw new Error("User not authenticated");
      }

      // Determine which endpoint to use based on username parameter
      let endpoint;
      if (username && username !== currentUser.username) {
        // Fetch posts for a specific user profile
        endpoint = `/posts/profile/${username}`;
      } else {
        // Fetch timeline posts for current user
        endpoint = `/posts/allPosts/${currentUser._id}`;
      }

      const res = await axios.get(endpoint);
      
      // Handle different response structures
      const postsData = res.data.post || res.data.posts || res.data;
      
      if (Array.isArray(postsData)) {
        // Sort posts by creation date (newest first)
        const sortedPosts = postsData.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        });
        setPosts(sortedPosts);
      } else {
        setPosts([]);
      }
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError(err.response?.data?.message || err.message || "Failed to load posts");
      setPosts([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [currentUser, username]);

  useEffect(() => {
    if (currentUser?._id) {
      fetchPosts();
    }
  }, [currentUser, username, fetchPosts]);

  // Function to handle new post creation
  const handleNewPost = useCallback((newPost) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
  }, []);

  // Function to handle post deletion
  const handlePostDelete = useCallback((postId) => {
    setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
  }, []);

  // Function to handle post updates (likes, comments, etc.)
  const handlePostUpdate = useCallback((updatedPost) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post._id === updatedPost._id ? updatedPost : post
      )
    );
  }, []);

  // Function to refresh posts
  const handleRefresh = () => {
    fetchPosts(true);
  };

  // Loading skeleton component
  const PostSkeleton = () => (
    <div className="postSkeleton">
      <Box sx={{ p: 2, mb: 2, bgcolor: 'white', borderRadius: 2 }}>
        <Skeleton variant="circular" width={40} height={40} />
        <Skeleton variant="text" sx={{ fontSize: '1rem', mt: 1 }} />
        <Skeleton variant="rectangular" width="100%" height={200} sx={{ mt: 1 }} />
        <Skeleton variant="text" sx={{ fontSize: '0.875rem', mt: 1 }} />
      </Box>
    </div>
  );

  if (!currentUser) {
    return (
      <div className="feed">
        <div className="feedWrapper">
          <Alert severity="warning">
            Please log in to view your feed.
          </Alert>
        </div>
      </div>
    );
  }
  return (
    <div className="feed">
      <div className="feedWrapper">
        {/* Show Share component only on user's own feed or home feed */}
        {(!username || username === currentUser.username) && (
          <Share onNewPost={handleNewPost} />
        )}
        
        {/* Error state */}
        {error && (
          <div className="feedError">
            <Alert severity="error" action={
              <button onClick={handleRefresh} className="retryButton">
                Retry
              </button>
            }>
              {error}
            </Alert>
          </div>
        )}

        {/* Loading state */}
        {loading && !error && (
          <div className="feedLoading">
            {Array.from({ length: 3 }).map((_, index) => (
              <PostSkeleton key={index} />
            ))}
          </div>
        )}

        {/* Refreshing indicator */}
        {refreshing && (
          <div className="refreshIndicator">
            <CircularProgress size={20} />
            <span>Refreshing posts...</span>
          </div>
        )}

        {/* Posts list */}
        {!loading && !error && (
          <>
            {posts.length > 0 ? (
              <div className="postsList">
                {posts.map((post) => (
                  <Post 
                    key={post._id} 
                    post={post}
                    onDelete={handlePostDelete}
                    onUpdate={handlePostUpdate}
                  />
                ))}
              </div>
            ) : (
              <div className="emptyFeed">
                <div className="emptyFeedContent">
                  <h3>No posts yet</h3>
                  <p>
                    {username && username !== currentUser.username
                      ? "This user hasn't shared any posts yet."
                      : "Start sharing your thoughts with the world!"}
                  </p>
                  {(!username || username === currentUser.username) && (
                    <button 
                      onClick={() => document.querySelector('.share')?.scrollIntoView({ behavior: 'smooth' })}
                      className="createPostButton"
                    >
                      Create Your First Post
                    </button>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
