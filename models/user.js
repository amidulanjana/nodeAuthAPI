const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, unique: true },
  name: String,
  profileImg: String,
  googleID: String,
  facebookID: String,
  password: String
});

userSchema.pre("save", function(next) {
  const user = this;
  bcrypt.genSalt(10, function(err, salt) {
    if (err) {
      return next(err);
    }
    if (user.password) {
      bcrypt.hash(user.password, salt, null, function(err, hash) {
        if (err) return err;
        user.password = hash;
        next();
      });
    }
    next();
  });
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return callback(err);
    callback(null, isMatch);
  });
};

const ModelClass = mongoose.model("user", userSchema);

module.exports = ModelClass;
