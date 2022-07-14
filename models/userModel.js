const mongoose = require('mongoose');
const {Schema} = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    username: {
        type: String,
        lowercase: true,
        required: true,
        // match: [/^[a-zA-Z0-9]+$/, "Solo letras y números"],
    },
    email: {
        type: String,
        lowercase: true,
        required: true,
        unique:true,
        index: { unique: true },
        
    },
    password: {
        type: String,
        required: true,
    },
    tokenConfirm: {
        type: String,
        default: null,
    },
    accountConfirm: {
        type: Boolean,
        default: false,
    },
})
userSchema.pre('save', async function save(next) {
    if (!this.isModified('password')) return next();
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      return next();
    } catch (err) {
      return next(err);
    }
});
userSchema.methods.validatePassword = async function validatePassword(data) {
    return bcrypt.compare(data, this.password);
};
  
const User = mongoose.model('user',userSchema);
module.exports = User;