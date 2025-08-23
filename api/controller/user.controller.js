import { User } from "../models/User.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong while getting all users!",
      error: error.message,
    });
  }
};

export const getUser = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).send({
      message: "User ID is required",
    });
  }

  try {
    const user = await User.findById(id);

    if (user) {
      const { password, updatedAt, ...other } = user._doc;
      return res.status(200).json(other);
    } else {
      return res.status(404).json({
        message: "User not found",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong while getting the user!",
      error: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        {
          new: true,
        }
      );

      const { password, updatedAt, ...other } = user._doc;
      return res.status(200).json({
        message: "User updated successfully!",
        other,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Something went wrong while updating the user!",
        error: error.message,
      });
    }
  } else {
    return res.status(403).json({
      message: "You can update only your account!",
    });
  }
};

export const deleteUser = async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      const { password, updatedAt, ...other } = user._doc;
      return res.status(200).json({
        message: "User deleted successfully!",
        other,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Something went wrong while deleting the user!",
        error: error.message,
      });
    }
  } else {
    return res.status(403).json({
      message: "You can delete only your account!",
    });
  }
};

export const followUser = async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);

      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({
          $push: {
            followers: req.body.userId,
          },
        });
        await currentUser.updateOne({
          $push: {
            followings: req.params.id,
          },
        });

        return res.status(200).json({
          message: "User followed successfully!",
        });
      } else {
        return res.status(403).json({
          message: "You already follow this user!",
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Something went wrong while following the user!",
        error: error.message,
      });
    }
  } else {
    return res.status(403).json({
      message: "You can't follow yourself!",
    });
  }
};

export const unfollowUser = async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);

      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({
          $pull: {
            followers: req.body.userId,
          },
        });
        await currentUser.updateOne({
          $pull: {
            followings: req.params.id,
          },
        });

        return res.status(200).json({
          message: "User unfollowed successfully!",
        });
      } else {
        return res.status(403).json({
          message: "You don't follow this user!",
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Something went wrong while unfollowing the user!",
        error: error.message,
      });
    }
  } else {
    return res.status(403).json({
      message: "You can't unfollow yourself!",
    });
  }
};

export const friendDetails = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).send({
      message: "User ID is required",
    });
  }

  try {
    const user = await User.findById(id);

    if (user) {
      const { password, updatedAt, ...other } = user._doc;
      return res.status(200).json(other);
    } else {
      return res.status(404).json({
        message: "User not found",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong while getting the user!",
      error: error.message,
    });
  }
}

export const getAllFriends = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).send({
      message: "User ID is required",
    });
  }

  try {
    const user = await User.findById(id);

    if (user) {
      // Get friends from the friends array, or fallback to followings if friends is empty
      const friendIds = user.friends && user.friends.length > 0 ? user.friends : user.followings;
      
      // Populate friends data
      const friends = await User.find({ _id: { $in: friendIds } })
        .select("-password -updatedAt");

      return res.status(200).json(friends);
    } else {
      return res.status(404).json({
        message: "User not found",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong while getting the user's friends!",
      error: error.message,
    });
  }
};
