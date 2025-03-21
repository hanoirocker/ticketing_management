import mongoose from 'mongoose';

interface UserAttrs {
  email: string;
  password: string;
}

/**
 * Define schema for user. This is only for mongoose.
 * This doesn't help TS to know which properties we need to pass when
 * creating a new user at all. For addresing this, we'll use
 * `buildUser` function and `UserAttrs` interface.
 */
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model('User', userSchema);

/**
 * Specific function for building a user instead of calling `new User(...)` directly.
 * This is for integrating mongoose with typescrit to correctly define
 * attributes needed by using the UserAttrs TS interface.
 */
const buildUser = (attrs: UserAttrs) => {
  return new User(attrs);
};

export { User, buildUser };
