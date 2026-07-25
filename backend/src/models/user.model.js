import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default:
        'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    // Only users with isAuthor (or isAdmin) can create/edit blog posts.
    isAuthor: {
      type: Boolean,
      default: false,
    },
    // Set to true when a user applies to become a writer, until an
    // admin approves or rejects the request.
    authorRequestPending: {
      type: Boolean,
      default: false,
    },
    // Set to true when a user applies for full admin access, until an
    // existing admin approves or rejects the request.
    adminRequestPending: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
