import { Post } from "../models/Post.js";

export const createPost = async (req, res) => {

  const { userId, desc, img } = req.body;

  if (userId && desc && img) {
    try {
      const newPost = new Post({ userId, desc, img });
      console.log(newPost);

      const data = await newPost.save();

      return res.status(200).json({
        message: "Post created successfully",
        data,
      });
    } catch (error) {
      return res.status(500).json({
        message: "error occured while creating a post",
        error: error.message,
      });
    }
  } else {
    return res.status(500).json({
      error: "Please provide all details like userId, desc, likes and img",
    });
  }
};

export const updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findOne({ _id: postId });

    // Check if the post exists and if the user is authorized to update it
    if (post.userId === req.body.userId) {
      // Update the post with the new data
      const updatedPost = await post.updateOne({ $set: req.body });

      return res.status(200).json({
        message: "Post updated successfully!",
        post: updatedPost,
      });
    } else {
      return res.status(400).json({
        message: "You can only update your own post",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while updating the post",
      error: error.message,
    });
  }
};

export const getPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findOne({ _id: postId });

    return res
      .status(200)
      .json({ message: "post fetching was successful", post });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while fethcing post",
      error: error.message,
    });
  }
};

export const getAllUserPost = async (req, res) => {
  try {
    const userId = req.params.id;
    const post = await Post.find({ userId }).sort({ createdAt: -1 });

    return res
      .status(200)
      .json({ message: "All user post fetching was successful", post });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while fethcing user posts",
      error: error.message,
    });
  }
};

export const likeAndDislikePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.body.userId;

    const post = await Post.findById(postId);

    const updateOperation = post.likes.includes(userId)
      ? { $pull: { likes: userId } }
      : { $addToSet: { likes: userId } };

    const updatedPost = await Post.findByIdAndUpdate(postId, updateOperation, {
      new: true,
    });

    const message = post.likes.includes(userId)
      ? "Post disliked successfully!"
      : "Post liked successfully!";

    return res.status(200).json({
      message,
      post: updatedPost,
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while liking/disliking the post",
      error: error.message,
    });
  }
};

export const deletePost = async (req, res) => {
  // console.log(req.params.id);
};

export const getMyPosts = async (req, res) => {
  try {
    const userId = req.params.id;
    const posts = await Post.find({ userId }).sort({ createdAt: -1 });

    return res
      .status(200)
      .json({ message: "My posts fetching was successful", posts });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while fetching my posts",
      error: error.message,
    });
  }
};
