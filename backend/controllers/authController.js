const User = require("../models/User")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
}

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: 'Authentication is not configured on the server.' });
        }

        const existingUser = await User.findOne({ email });
        if( existingUser ) {
            return res.status(400).json({ message: 'User already exist!' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({ name, email, password: hashedPassword });
        const token = generateToken(user._id);
        await user.save();

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token,
            role: user.role,
        });
    } 
    catch (error) {
        console.error('User registration failed:', error.message);
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

const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = { registerUser, loginUser, getUsers };
