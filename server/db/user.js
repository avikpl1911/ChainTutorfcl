import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  address: {
    type: String,
    unique: true,
  },
  ownedcourses: [
    {
      id: { type: mongoose.Schema.Types.ObjectId, ref: "course" },

      status: Number,
    },
  ],
  producedcourses: [String],
});

export const user = mongoose.model("user", userSchema);
