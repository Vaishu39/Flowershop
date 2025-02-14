const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
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
      confirmPassword: {
        type: String,
        required: true,
      },
    }, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

// Hash password before saving user to database
userSchema.pre('save', function (next) { //save in database
  if (this.isModified('password')) {
    bcrypt.hash(this.password, 8, (err, hash) => {
      if (err) return next(err);

      this.password = hash;
      next();
    });
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (password) {
  if (!password) throw new Error('Password is missing, can not compare!');

  try {
    const result = await bcrypt.compare(password, this.password);
    return result;
  } catch (error) {
    console.log('Error while comparing password!', error.message);
  }
};

module.exports = mongoose.model('User', userSchema);
