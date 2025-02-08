import React, { useContext, useEffect, useState } from "react";
import Post from "../post/Post";
import Share from "../share/Share";
import "./feed.css";
import axios from "../../config/axiosConfig.js";
import { AuthContext } from "./../../context/AuthContext";

export default function Feed({ username }) {
  const [posts, setPosts] = useState([]);
  const { user: currentUser } = useContext(AuthContext);

  useEffect(() => {
    (async () => {
      const res = await axios.get("/posts/allPosts/" + currentUser?._id);
      
      // const res = currentUser.username
      //   ? await axios.get("/posts/" + currentUser.username)
      //   : await axios.get("/posts/timeline/" + currentUser?._id);

      setPosts(res.data.post);
      
      // setPosts(
      //   res.data.sort((p1, p2) => {
      //     return new Date(p2.createdAt) - new Date(p1.createdAt);
      //   })
      // );
    })();
  }, [currentUser]);
  return (
    <div className="feed">
      <div className="feedWrapper">
        {(!username || username === currentUser.username) && <Share />}
        {posts && posts.map((p) => (
          <Post key={p._id} post={p} />
        ))}
      </div>
    </div>
  );
}
