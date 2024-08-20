const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    tests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Test' }],
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    verificationTokenExpires: { type: Date }
});

module.exports = mongoose.model('User', userSchema);
