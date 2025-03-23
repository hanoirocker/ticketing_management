import mongoose from 'mongoose';

// Define basic properties to create a user.
interface UserAttrs {
  email: string;
  password: string;
}

// Describes what the entire collection
// of users look like in terms of schemas
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// What properties a single user has (User Documentation)
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

/**
 * Define schema for user. This is only for mongoose.
 * This doesn't help TS to know which properties we need to pass when
 * creating a new user at all.
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

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
