import mongoose from 'mongoose';

// Define schema for user. This is only for mongoose.
// This file doesn't help TS to know which properties we need to pass when
// creating a new user at all.

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

export { User };
