import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import Otp from "../models/Otp.js";
import User from "../models/User.js";

//Sign up new user
export const signup = async (req, res) =>{
    const {fullName, email, password, bio, verificationToken} = req.body;
    try{
        if(!fullName || !email || !password || !bio || !verificationToken){
            return res.json({success: false, message: "Missing Details"})
        }
        // Verify the token
        let decoded;
        try {
            decoded = jwt.verify(verificationToken, process.env.JWT_SECRET);
        } catch (err) {
            return res.json({success: false, message: "Invalid or expired verification token"});
        }
        if (decoded.email !== email) {
            return res.json({success: false, message: "Email mismatch"});
        }
        const user = await User.findOne({email});

        if(user){
            return res.json({success: false, message: "Account already exists"})
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            fullName,email,password:hashedPassword,bio
        });
        const token = generateToken(newUser._id)

    res.json({success: true, userData : newUser, token, message:"Account created successfully"})
    }catch(error){
        console.log(error.message)
        res.json({success: false, message:error.message})
    }
}

// ...existing code...

export const sendOtp = async (req, res) => {
  try {
    const rawEmail = req.body.email;
    const email = typeof rawEmail === 'string' ? rawEmail.trim().toLowerCase() : '';
    if (!email) return res.json({ success: false, message: "Email required" });

    // Basic format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)) return res.json({success:false, message:"Invalid email"});

    // Remove previous OTPs to prevent mismatch with older record
    await Otp.deleteMany({ email });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.create({ email, otp, createdAt: new Date() });

 const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, 
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASSWORD,
  },
});

const mailOptions = {
  from: `"QuickChat" <${process.env.EMAIL_USER}>`,
  to: rawEmail, // send to original casing
  subject: "Your OTP Code",
  text: `Your OTP is: ${otp}\n\nThis OTP is valid for 5 minutes.`,
};

await transporter.sendMail(mailOptions);
    res.json({
      success: true,
      email,
      message: "Otp Sent successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email: rawEmail, otp: rawOtp } = req.body;
    const email = typeof rawEmail === 'string' ? rawEmail.trim().toLowerCase() : '';
    const otp = typeof rawOtp === 'string' ? rawOtp.trim() : '';
    if (!email || !otp) return res.json({ success: false, message: "Email and OTP required" });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.json({ success: false, message: "Invalid email format" });
    if (!/^\d{6}$/.test(otp)) return res.json({ success: false, message: "Invalid OTP format" });
        // Find the latest OTP record for this email and specifically look for a matching OTP
        const latestRecord = await Otp.findOne({ email }).sort({ createdAt: -1 });
        const matchingRecord = await Otp.findOne({ email, otp }).sort({ createdAt: -1 });

        console.log('[verifyOtp] debug', {
            email,
            providedOtp: otp,
            latestCreatedAt: latestRecord ? latestRecord.createdAt.toISOString() : null,
            matchingCreatedAt: matchingRecord ? matchingRecord.createdAt.toISOString() : null,
            now: new Date().toISOString(),
        });

        // If no records exist at all -> likely expired or never sent
        if (!latestRecord) return res.json({ success: false, message: "OTP expired or not found" });

        // If there is at least one record but none match the provided OTP -> invalid
        if (!matchingRecord) return res.json({ success: false, message: "Invalid OTP" });

        // Check age on the matching record
        const maxAgeMs = 5 * 60 * 1000; // 5 minutes
        if (matchingRecord.createdAt && Date.now() - matchingRecord.createdAt.getTime() > maxAgeMs) {
            await Otp.deleteOne({ email });
            return res.json({ success: false, message: "OTP expired" });
        }

        // All good: remove OTPs and issue verification token
        await Otp.deleteMany({ email });
        const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '10m' });
        res.json({ success: true, message: "Email verified successfully", verificationToken });
  } catch (error) {
    console.log("verifyOtp error:", error.message);
    res.json({ success: false, message: "Failed to verify OTP" });
  }
};


// Controller to login a user
export const login = async (req, res) =>{
    try {
        const {email, password} = req.body;
        const userData = await User.findOne({email});

        const isPasswordCorrect = await bcrypt.compare(password, userData.password);
        if(!isPasswordCorrect){
            return res.json({success: false, message: "Invalid credentials"})
        }
        const token = generateToken(userData._id)

        res.json({success: true, userData, token, message:"Login successful"})

    } catch (error) {
        console.log(error.message)
        res.json({success: false, message:error.message})
    }
}


// Controller to check if user is authenticated

export const checkAuth = (req, res) =>{
    res.json({success : true, user: req.user});
}


// Controller to update user profile details

export const updateProfile = async (req, res) =>{
    try {
        const { profilePic, bio, fullName } = req.body;

        const userId = req.user._id;
        let updatedUser;
        
        if(!profilePic){
            updatedUser = await User.findByIdAndUpdate(userId, {bio, fullName}, {new: true})
        }else{
            const upload = await cloudinary.uploader.upload(profilePic);
            
            updatedUser = await User.findByIdAndUpdate(userId, {profilePic: upload.secure_url, bio, fullName}, {new: true})
        }
        res.json({
            success: true, user: updatedUser
        })

    } catch (error) {
        console.log(error.message);
        res.json({
            success: false, message: error.message
        })
    }
}