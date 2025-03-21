import mongoose from 'mongoose';

interface UserAttrs {
  email: string;
  password: string;
}

// An interface that describes the properties
// that are required to create a new User
interface UserModel extends mongoose.Model<any> {
  build(attrs: UserAttrs): any;
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

/**
 * Specific function for building a user instead of calling `new User(...)` directly.
 * This is for integrating mongoose with typescrit to correctly define
 * attributes needed by using the UserAttrs TS interface.
 * 1 - We add a custom function into our mongoose model.
 * 2 - Create the UserModel for giving the build function its proper type definition
 */
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<any, UserModel>('User', userSchema);

export { User };
