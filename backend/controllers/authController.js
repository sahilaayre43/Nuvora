const User = require("../models/User")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
}

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try { 
        const existingUser = await User.findOne({ email });
        if( existingUser ) {
            return res.status(400).json({ message: 'User already exist!' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({ name, email, password: hashedPassword });
        if( user ) {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();

            const message = `welcome to NUVORA! thank you for registering. we are happy to have you on board.
            Your OTP for registration is: ${otp}. Please enter this OTP to verify your account.`;

            await sendEmail(email, 'NUVORA - OTP for registration', message);
            res.status(200).json({
             _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
                role: user.role,     
            });
        } else {
            res.status(400).json({ message: 'Invalid user data!' });
        }
    } 
    catch (error) {
        res.status(500).json({ message: 'Server error!' });
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if( user && (await bcrypt.compare(password, user.password)) ) {
            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
                role: user.role,
            });
        } else {
            res.status(400).json({ message: 'Invalid email or password!' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error!' });
    }   
};

const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if( user ) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'User not found!' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error!' });
    }
};



module.exports = { registerUser, loginUser, getUser };
