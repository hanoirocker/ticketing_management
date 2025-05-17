import mongoose from 'mongoose';
import { Password } from '../services/password';

// Define basic properties to create a user.
interface UserAttrs {
  email: string;
  password: string;
}

// Describes what the entire collection
// of users look like in terms of schemas (All different properties to be assigned
// to the model itself. Model = entire collection of saved data)
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// What properties a single saved user has (Document = single saved instance)
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

/**
 * Define schema for user. This is only for mongoose.
 * This doesn't help TS to know which properties we need to pass when
 * creating a new user at all.
 */
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        // Mongo saves id's to records as '_id', so we change it to 'id'
        ret.id = ret._id;
        delete ret._id;
        // Delete the password from the schema and __v (not needed)
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

// Midleware function useing mongoose pre-save hook for accesing the Document
// being save (user being created). We're using 'function' call to get access to `this` instance
// of the document. If used arrow function declaration isntead, we would be overwritting `this`.
// Use 'done' since mongoose doens't handle async functions easily.
userSchema.pre('save', async function (done) {
  // use this for making sure we're hashing for all password modification cases (creation, update)
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
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

// Create the actual model
const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
