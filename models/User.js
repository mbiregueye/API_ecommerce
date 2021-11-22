const mongoose =  require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        pseudo: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: false },
        password: { type: String, required: true },
        isAdmin: { type: Boolean, default: false },
    },
    { timestamps: true } // createdAt and pdatedAt
);

module.exports = mongoose.model("User", UserSchema);