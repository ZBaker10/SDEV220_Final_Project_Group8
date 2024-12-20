const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: [true, "Please enter your first name."]
    },
    lastname: {
        type: String,
        required: [true, "Please enter your last name."]
    },
    email: {
        type: String,
        required: [true, "Please enter your email."],
        unique: true,
        lowercase: true,
        validate: [isEmail, "Please enter a valid email"]
    },
    password: {
        type: String,
        required: [true, "Please enter a password."],
        minlength: [6, "Minimum password length is 6 characters."]
    },
    jobCode: {
        type: Number,
        required: true
    },
    courses: {
        type: Array
    },
    cart: {
        type: Array
    }
}, { timestamps: true });

// Hash Password before Saving
userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next()
});

// Login Function
userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });

    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error('Incorrect Password.');
    }
    throw Error('Incorrect Email.');
}

const User = mongoose.model("User", userSchema);

module.exports = User;