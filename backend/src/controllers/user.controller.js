import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import User from '../models/user.model.js';

export const test = (req, res) => {
  res.json({ message: 'API is working!' });
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to update this user'));
  }
  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(errorHandler(400, 'Password must be at least 6 characters'));
    }
    req.body.password = bcryptjs.hashSync(req.body.password, 10);
  }
  if (req.body.username) {
    if (req.body.username.length < 7 || req.body.username.length > 20) {
      return next(
        errorHandler(400, 'Username must be between 7 and 20 characters')
      );
    }
    if (req.body.username.includes(' ')) {
      return next(errorHandler(400, 'Username cannot contain spaces'));
    }
    if (req.body.username !== req.body.username.toLowerCase()) {
      return next(errorHandler(400, 'Username must be lowercase'));
    }
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        errorHandler(400, 'Username can only contain letters and numbers')
      );
    }
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          profilePicture: req.body.profilePicture,
          password: req.body.password,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to delete this user'));
  }
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json('User has been deleted');
  } catch (error) {
    next(error);
  }
};

export const signout = (req, res, next) => {
  try {
    res
      .clearCookie('access_token')
      .status(200)
      .json('User has been signed out');
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to see all users'));
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === 'asc' ? 1 : -1;

    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    const totalUsers = await User.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      users: usersWithoutPassword,
      totalUsers,
      lastMonthUsers,
    });
  } catch (error) {
    next(error);
  }
};

// A signed-in reader applies to become a writer. An admin has to approve
// the request before they can actually create posts.
export const requestAuthorAccess = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(
      errorHandler(403, 'You are not allowed to do this for another user')
    );
  }
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }
    if (user.isAdmin || user.isAuthor) {
      return next(errorHandler(400, 'You already have writer access'));
    }
    if (user.authorRequestPending) {
      return next(errorHandler(400, 'Your request is already pending'));
    }
    user.authorRequestPending = true;
    await user.save();
    const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

// Admin-only: list every user with a pending writer request.
export const getAuthorRequests = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to see this'));
  }
  try {
    const users = await User.find({ authorRequestPending: true }).sort({
      createdAt: -1,
    });
    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });
    res.status(200).json(usersWithoutPassword);
  } catch (error) {
    next(error);
  }
};

// Admin-only: approve a pending writer request.
export const approveAuthorRequest = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to do this'));
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { $set: { isAuthor: true, authorRequestPending: false } },
      { new: true }
    );
    if (!updatedUser) {
      return next(errorHandler(404, 'User not found'));
    }
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

// Admin-only: reject a pending writer request.
export const rejectAuthorRequest = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to do this'));
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { $set: { isAuthor: false, authorRequestPending: false } },
      { new: true }
    );
    if (!updatedUser) {
      return next(errorHandler(404, 'User not found'));
    }
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

// A signed-in user applies for full admin access. An existing admin has to
// approve the request before it takes effect.
export const requestAdminAccess = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(
      errorHandler(403, 'You are not allowed to do this for another user')
    );
  }
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }
    if (user.isAdmin) {
      return next(errorHandler(400, 'You already have admin access'));
    }
    if (user.adminRequestPending) {
      return next(errorHandler(400, 'Your request is already pending'));
    }
    user.adminRequestPending = true;
    await user.save();
    const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

// Admin-only: list every user with a pending admin request.
export const getAdminRequests = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to see this'));
  }
  try {
    const users = await User.find({ adminRequestPending: true }).sort({
      createdAt: -1,
    });
    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });
    res.status(200).json(usersWithoutPassword);
  } catch (error) {
    next(error);
  }
};

// Admin-only: approve a pending admin request. Admin access implies
// writer access too, so isAuthor is granted at the same time.
export const approveAdminRequest = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to do this'));
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          isAdmin: true,
          isAuthor: true,
          adminRequestPending: false,
        },
      },
      { new: true }
    );
    if (!updatedUser) {
      return next(errorHandler(404, 'User not found'));
    }
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

// Admin-only: reject a pending admin request.
export const rejectAdminRequest = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to do this'));
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { $set: { adminRequestPending: false } },
      { new: true }
    );
    if (!updatedUser) {
      return next(errorHandler(404, 'User not found'));
    }
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

// Admin-only: instantly toggle another user's admin status, no request
// needed - for when you just want to hand someone admin yourself.
export const setAdminStatus = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to do this'));
  }
  try {
    const makeAdmin = req.body.isAdmin === true;
    const update = { isAdmin: makeAdmin, adminRequestPending: false };
    if (makeAdmin) {
      update.isAuthor = true; // admins always have writer access too
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { $set: update },
      { new: true }
    );
    if (!updatedUser) {
      return next(errorHandler(404, 'User not found'));
    }
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }
    const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
