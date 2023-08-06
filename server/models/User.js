"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    username: String,
    password: String,
    done: { type: Boolean, default: false },
}, {
    timestamps: true,
    versionKey: false,
});
exports.default = (0, mongoose_1.model)("user", userSchema);
