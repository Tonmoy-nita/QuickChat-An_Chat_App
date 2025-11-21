import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now, 
        expires: 300,//expires after 5 min

    }
});

const Otp = mongoose.model("Otp", OtpSchema);

export default Otp;