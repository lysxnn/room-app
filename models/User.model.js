const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
    fullName: {
      type: String,
      require: true,
    },
    // slack login - optional
    // slackID: String,
    // google login - optional
    // googleID: String,
  },
  {
    timestamps: true,
  }
);

const UserModel = model("User", userSchema);

module.exports = UserModel;
