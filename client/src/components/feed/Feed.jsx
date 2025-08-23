import React, { useContext, useEffect, useState, useCallback, useRef } from "react";
import Post from "../post/Post";
import Share from "../share/Share";
import "./feed.css";
import axios from "../../config/axiosConfig.js";
import { AuthContext } from "./../../context/AuthContext";
import { useParams, useLocation } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';

export default function Feed({ username, isProfilePage = false }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const { id } = useParams();
  const location = useLocation();
  const observerRef = useRef();
  
  const { user: currentUser } = useContext(AuthContext);

  // Constants for pagination
  const POSTS_PER_PAGE = 10;

  // Determine feed type based on props and location
  const getFeedType = useCallback(() => {
    const pathname = location.pathname;
    
    if (isProfilePage || pathname.includes('/profile/')) {
      return 'profile';
    } else if (pathname === '/' || pathname === '/home') {
      return 'timeline';
    } else {
      return 'timeline'; // default
    }
  }, [isProfilePage, location.pathname]);

  // Function to fetch posts with pagination
  const fetchPosts = useCallback(async (pageNum = 1, isRefresh = false, isLoadMore = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      
      if (!isLoadMore) {
        setError(null);
      }

      if (!currentUser?._id) {
        throw new Error("User not authenticated");
      }

      const feedType = getFeedType();
      let endpoint;
      let targetUserId;

      if (feedType === 'profile') {
        // Profile page - show specific user's posts
        if (username) {
          // Get user ID from username if on another user's profile
          try {
            const userRes = await axios.get(`/users/search?username=${username}`);
            targetUserId = userRes.data._id;
          } catch (err) {
            console.error("Error finding user:", err);
            targetUserId = currentUser._id; // fallback to current user
          }
        } else {
          // Current user's profile
          targetUserId = currentUser._id;
        }
        endpoint = `/posts/user/${targetUserId}?page=${pageNum}&limit=${POSTS_PER_PAGE}`;
      } else {
        // Home timeline - show all posts from all users
        endpoint = `/posts/timeline/${currentUser._id}?page=${pageNum}&limit=${POSTS_PER_PAGE}`;
      }

      const res = await axios.get(endpoint);
      
      // Handle different response structures
      const postsData = res.data.posts || res.data.post || res.data || [];
      const pagination = res.data.pagination || {};
      const totalPosts = pagination.totalPosts || res.data.total || 0;
      const currentPage = pagination.page || res.data.page || pageNum;
      const totalPages = pagination.totalPages || res.data.totalPages || Math.ceil(totalPosts / POSTS_PER_PAGE);
      const hasNext = pagination.hasNext !== undefined ? pagination.hasNext : (currentPage < totalPages);
      
      if (Array.isArray(postsData)) {
        if (isLoadMore) {
          // Append new posts for infinite scroll
          setPosts(prevPosts => {
            const newPosts = postsData.filter(newPost => 
              !prevPosts.some(existingPost => existingPost._id === newPost._id)
            );
            return [...prevPosts, ...newPosts];
          });
        } else {
          // Replace posts for initial load or refresh
          setPosts(postsData);
        }
        
        // Update pagination state
        setPage(currentPage);
        setHasMore(hasNext);
      } else {
        if (!isLoadMore) {
          setPosts([]);
        }
        setHasMore(false);
      }
    } catch (err) {
      console.error("Error fetching posts:", err);
      if (!isLoadMore) {
        setError(err.response?.data?.message || err.message || "Failed to load posts");
        setPosts([]);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, [currentUser, username, getFeedType, POSTS_PER_PAGE]);

  // Load more posts when scrolling
  const loadMorePosts = useCallback(() => {
    if (!loadingMore && hasMore && !loading) {
      fetchPosts(page + 1, false, true);
    }
  }, [loadingMore, hasMore, loading, page, fetchPosts]);

  // Intersection Observer for infinite scroll
  const lastPostElementRef = useCallback(node => {
    if (loading || loadingMore) return;
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMorePosts();
      }
    }, {
      threshold: 0.1,
      rootMargin: '100px'
    });
    
    if (node) observerRef.current.observe(node);
  }, [loading, loadingMore, hasMore, loadMorePosts]);

  // Reset state when feed type changes
  useEffect(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
    setError(null);
  }, [username, location.pathname]);

  // Initial load
  useEffect(() => {
    if (currentUser?._id) {
      fetchPosts(1, false, false);
    }
  }, [currentUser, username, location.pathname, fetchPosts]);

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
    setPosts([]);
    setPage(1);
    setHasMore(true);
    fetchPosts(1, true, false);
  };

  // Get feed title based on type
  const getFeedTitle = () => {
    const feedType = getFeedType();
    if (feedType === 'profile') {
      if (username && username !== currentUser.username) {
        return `${username}'s Posts`;
      }
      return 'My Posts';
    }
    return 'Timeline';
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
        {/* Feed title */}
        <div className="feedHeader">
          <h2 className="feedTitle">{getFeedTitle()}</h2>
          {posts.length > 0 && (
            <button onClick={handleRefresh} className="refreshButton" disabled={refreshing}>
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          )}
        </div>

        {/* Show Share component only on current user's profile or home feed */}
        {(getFeedType() === 'timeline' || (getFeedType() === 'profile' && (!username || username === currentUser.username))) && (
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
        {loading && !error && posts.length === 0 && (
          <div className="feedLoading">
            {Array.from({ length: 3 }).map((_, index) => (
              <PostSkeleton key={index} />
            ))}
          </div>
        )}

        {/* Refreshing indicator */}
        {refreshing && posts.length > 0 && (
          <div className="refreshIndicator">
            <CircularProgress size={20} />
            <span>Refreshing posts...</span>
          </div>
        )}

        {/* Posts list */}
        {!loading && !error && posts.length === 0 ? (
          <div className="emptyFeed">
            <div className="emptyFeedContent">
              <h3>No posts yet</h3>
              <p>
                {getFeedType() === 'profile' && username && username !== currentUser.username
                  ? "This user hasn't shared any posts yet."
                  : getFeedType() === 'profile'
                  ? "You haven't created any posts yet. Share your first thought!"
                  : "No posts in your timeline yet. Follow more users to see their posts!"}
              </p>
              {(getFeedType() === 'timeline' || (getFeedType() === 'profile' && (!username || username === currentUser.username))) && (
                <button 
                  onClick={() => document.querySelector('.share')?.scrollIntoView({ behavior: 'smooth' })}
                  className="createPostButton"
                >
                  Create Your First Post
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="postsList">
            {posts.map((post, index) => {
              // Add ref to last post for infinite scroll
              const isLastPost = index === posts.length - 1;
              return (
                <div
                  key={post._id}
                  ref={isLastPost ? lastPostElementRef : null}
                >
                  <Post 
                    post={post}
                    onDeletePost={handlePostDelete}
                    onUpdate={handlePostUpdate}
                  />
                </div>
              );
            })}
            
            {/* Loading more indicator */}
            {loadingMore && (
              <div className="loadingMore">
                <CircularProgress size={30} />
                <span>Loading more posts...</span>
              </div>
            )}
            
            {/* End of posts indicator */}
            {!hasMore && posts.length > 0 && (
              <div className="endOfPosts">
                <p>You've reached the end of the posts!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
