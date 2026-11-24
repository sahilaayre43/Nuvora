const crypto = require("crypto");
const User = require("../models/User");
const PendingRegistration = require("../models/PendingRegistration");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

const TOKEN_EXPIRY_MS = 60 * 60 * 1000;
const PASSWORD_MIN_LENGTH = 8;
const MAX_VERIFICATION_ATTEMPTS = 5;
const isEmailVerificationEnabled = () => process.env.EMAIL_VERIFICATION_ENABLED === "true";

const generateToken = (id, authTokenVersion) => {
    return jwt.sign({ id, authTokenVersion }, process.env.JWT_SECRET, { expiresIn: "30d" });
}

const createAuthenticatedUserResponse = (user) => ({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id, user.authTokenVersion),
    role: user.role
});

const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

const createOneTimeToken = () => {
    const token = crypto.randomBytes(32).toString("hex");
    return { token, tokenHash: hashToken(token) };
}

const hashVerificationCode = (email, code) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not configured.");
    }
    return crypto.createHmac("sha256", process.env.JWT_SECRET)
        .update(`${email}:${code}`)
        .digest("hex");
}

const createVerificationCode = (email) => {
    const code = crypto.randomInt(100000, 1000000).toString();
    const codeHash = hashVerificationCode(email, code);
    return { code, codeHash };
}

const getFrontendUrl = () => {
    const frontendUrl = process.env.FRONTEND_URL?.split(",")[0].trim().replace(/\/+$/, "");
    if (!frontendUrl) {
        throw new Error("FRONTEND_URL is not configured.");
    }
    return frontendUrl;
}

const isValidEmail = (email) => typeof email === "string"
    && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: 'Authentication is not configured on the server.' });
        }
        if (typeof name !== "string" || !name.trim() || !isValidEmail(email)
            || typeof password !== "string" || password.length < PASSWORD_MIN_LENGTH) {
            return res.status(400).json({
                message: `Enter a valid name and email, and a password with at least ${PASSWORD_MIN_LENGTH} characters.`
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(409).json({
                message: existingUser.verified
                    ? 'An account with this email already exists.'
                    : 'This email already has an account awaiting verification. Request a new verification code.'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        if (!isEmailVerificationEnabled()) {
            const user = await User.create({
                name: name.trim(),
                email: normalizedEmail,
                password: hashedPassword,
                verified: true
            });
            await PendingRegistration.deleteOne({ email: normalizedEmail });

            return res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id, user.authTokenVersion),
                role: user.role
            });
        }

        const { code, codeHash } = createVerificationCode(normalizedEmail);
        const pendingRegistration = await PendingRegistration.findOneAndUpdate(
            { email: normalizedEmail },
            {
                name: name.trim(),
                email: normalizedEmail,
                password: hashedPassword,
                verificationTokenHash: codeHash,
                expiresAt: new Date(Date.now() + TOKEN_EXPIRY_MS),
                verificationAttempts: 0
            },
            { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
        );

        await sendEmail({
            email: pendingRegistration.email,
            subject: "Verify your NUVORA email",
            message: `<p>Welcome to NUVORA!</p><p>Your NUVORA verification code is:</p><p style="font-size:24px;font-weight:bold;letter-spacing:6px">${code}</p><p>This code expires in one hour.</p>`
        });

        return res.status(201).json({
            message: "Check your email to verify your address. Your account will be created after verification.",
            email: pendingRegistration.email
        });
    } catch (error) {
        console.error('User registration failed:', error.message);
        if (error.code === 11000) {
            return res.status(409).json({ message: 'An account with this email already exists.' });
        }
        if (error.message.includes("Email is not configured")
            || error.message.includes("Email delivery failed")) {
            return res.status(503).json({
                code: "VERIFICATION_EMAIL_FAILED",
                email: typeof email === "string" ? email.trim().toLowerCase() : undefined,
                message: 'We could not send the verification email. Check the email setup and request another code.'
            });
        }
        return res.status(500).json({ message: 'Server error!' });
    }
}

const verifyEmail = async (req, res) => {
    const { token } = req.body;

    try {
        if (typeof token === "string" && token) {
            const tokenHash = hashToken(token);
            const pendingRegistration = await PendingRegistration.findOne({
                verificationTokenHash: tokenHash,
                expiresAt: { $gt: new Date() }
            });

            if (pendingRegistration) {
                let user = await User.findOne({ email: pendingRegistration.email });
                if (!user) {
                    try {
                        user = await User.create({
                            name: pendingRegistration.name,
                            email: pendingRegistration.email,
                            password: pendingRegistration.password,
                            verified: true
                        });
                    } catch (error) {
                        if (error.code !== 11000) throw error;
                        user = await User.findOne({ email: pendingRegistration.email });
                        if (!user) throw error;
                    }
                }

                if (!user.verified) {
                    user.verified = true;
                    user.verificationTokenHash = null;
                    user.verificationTokenExpires = null;
                    await user.save();
                }
                await PendingRegistration.deleteOne({ _id: pendingRegistration._id });
                return res.status(200).json({ message: "Email verified. You can now sign in." });
            }

            const user = await User.findOne({
                verificationTokenHash: tokenHash,
                verificationTokenExpires: { $gt: new Date() }
            });
            if (!user) {
                return res.status(400).json({ message: "This verification link is invalid or has expired." });
            }

            user.verified = true;
            user.verificationTokenHash = null;
            user.verificationTokenExpires = null;
            await user.save();

            return res.status(200).json({ message: "Email verified. You can now sign in." });
        }

        const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
        const code = typeof req.body.code === "string" ? req.body.code.trim() : "";
        if (!isValidEmail(email) || !/^\d{6}$/.test(code)) {
            return res.status(400).json({ message: "Enter the email address and 6-digit verification code." });
        }
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: "Authentication is not configured on the server." });
        }

        const codeHash = hashVerificationCode(email, code);
        const now = new Date();
        const pendingRegistration = await PendingRegistration.findOne({
            email,
            expiresAt: { $gt: now }
        });

        if (pendingRegistration) {
            const attempts = pendingRegistration.verificationAttempts || 0;
            if (attempts >= MAX_VERIFICATION_ATTEMPTS) {
                return res.status(400).json({ message: "Too many incorrect codes. Request a new verification code." });
            }
            if (pendingRegistration.verificationTokenHash !== codeHash) {
                pendingRegistration.verificationAttempts = attempts + 1;
                await pendingRegistration.save();
                return res.status(400).json({ message: "The verification code is invalid or has expired." });
            }

            let user;
            try {
                user = await User.create({
                    name: pendingRegistration.name,
                    email: pendingRegistration.email,
                    password: pendingRegistration.password,
                    verified: true
                });
            } catch (error) {
                if (error.code !== 11000) throw error;
                user = await User.findOne({ email: pendingRegistration.email });
                if (!user) throw error;
                if (!user.verified) {
                    user.verified = true;
                    user.verificationTokenHash = null;
                    user.verificationTokenExpires = null;
                    user.verificationAttempts = 0;
                    await user.save();
                }
            }
            await PendingRegistration.deleteOne({ _id: pendingRegistration._id });
            return res.status(200).json({
                message: "Email verified. You are now signed in.",
                ...createAuthenticatedUserResponse(user)
            });
        }

        const user = await User.findOne({
            email,
            verified: false,
            verificationTokenExpires: { $gt: now }
        });
        if (!user) {
            return res.status(400).json({ message: "The verification code is invalid or has expired." });
        }

        const attempts = user.verificationAttempts || 0;
        if (attempts >= MAX_VERIFICATION_ATTEMPTS) {
            return res.status(400).json({ message: "Too many incorrect codes. Request a new verification code." });
        }
        if (user.verificationTokenHash !== codeHash) {
            user.verificationAttempts = attempts + 1;
            await user.save();
            return res.status(400).json({ message: "The verification code is invalid or has expired." });
        }

        user.verified = true;
        user.verificationTokenHash = null;
        user.verificationTokenExpires = null;
        user.verificationAttempts = 0;
        await user.save();
        return res.status(200).json({
            message: "Email verified. You are now signed in.",
            ...createAuthenticatedUserResponse(user)
        });
    } catch (error) {
        console.error("Email verification failed:", error.message);
        return res.status(500).json({ message: "Server error!" });
    }
};

const resendVerificationEmail = async (req, res) => {
    const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
    if (!isValidEmail(email)) {
        return res.status(400).json({ message: "Enter a valid email address." });
    }

    const genericResponse = { message: "If the account needs verification, a new email will be sent." };
    let account;
    let code;
    let isPendingRegistration = false;
    try {
        account = await PendingRegistration.findOne({ email });
        if (account) {
            isPendingRegistration = true;
        } else {
            account = await User.findOne({ email });
        }
        if (!account || (!isPendingRegistration && account.verified)) {
            return res.status(200).json(genericResponse);
        }
        const generatedCode = createVerificationCode(account.email);
        code = generatedCode.code;
        if (isPendingRegistration) {
            account.verificationTokenHash = generatedCode.codeHash;
            account.expiresAt = new Date(Date.now() + TOKEN_EXPIRY_MS);
        } else {
            account.verificationTokenHash = generatedCode.codeHash;
            account.verificationTokenExpires = new Date(Date.now() + TOKEN_EXPIRY_MS);
        }
        account.verificationAttempts = 0;
        await account.save();
    } catch (error) {
        console.error("Preparing verification email failed:", error.message);
        return res.status(500).json({ message: "Server error!" });
    }

    try {
        await sendEmail({
            email: account.email,
            subject: "Verify your NUVORA email",
            message: `<p>Your NUVORA verification code is:</p><p style="font-size:24px;font-weight:bold;letter-spacing:6px">${code}</p><p>This code expires in one hour.</p>`
        });
        return res.status(200).json(genericResponse);
    } catch (error) {
        console.error("Resending verification email failed:", error.message);
        return res.status(503).json({ message: "We could not send the verification email. Check the email server configuration and try again." });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
        const user = await User.findOne({ email: normalizedEmail });
        if (!user || typeof password !== "string" || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: 'Invalid email or password!' });
        }
        if (isEmailVerificationEnabled() && !user.verified) {
            return res.status(403).json({
                code: "EMAIL_NOT_VERIFIED",
                message: "Please verify your email before signing in."
            });
        }
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: 'Authentication is not configured on the server.' });
        }

        return res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id, user.authTokenVersion),
            role: user.role,
        });
    } catch (error) {
        console.error("Login failed:", error.message);
        return res.status(500).json({ message: 'Server error!' });
    }
};

const requestPasswordReset = async (req, res) => {
    const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
    if (!isValidEmail(email)) {
        return res.status(400).json({ message: "Enter a valid email address." });
    }

    const genericResponse = { message: "If an account exists for that email, a password reset link will be sent." };
    let user;
    let token;
    try {
        user = await User.findOne({ email });
        if (!user) {
            return res.status(200).json(genericResponse);
        }

        const generatedToken = createOneTimeToken();
        token = generatedToken.token;
        const tokenHash = generatedToken.tokenHash;
        user.passwordResetTokenHash = tokenHash;
        user.passwordResetTokenExpires = new Date(Date.now() + TOKEN_EXPIRY_MS);
        await user.save();
    } catch (error) {
        console.error("Preparing password reset failed:", error.message);
        return res.status(500).json({ message: "Server error!" });
    }

    try {
        const resetUrl = `${getFrontendUrl()}/reset-password?token=${encodeURIComponent(token)}`;
        await sendEmail({
            email: user.email,
            subject: "Reset your NUVORA password",
            message: `<p>We received a request to reset your NUVORA password.</p><p><a href="${resetUrl}">Choose a new password</a></p><p>This link expires in one hour. If you did not request this, you can ignore this email.</p>`
        });
        return res.status(200).json(genericResponse);
    } catch (error) {
        console.error("Sending password reset email failed:", error.message);
        return res.status(200).json(genericResponse);
    }
};

const resetPassword = async (req, res) => {
    const { token, password } = req.body;
    if (typeof token !== "string" || !token) {
        return res.status(400).json({ message: "A password reset token is required." });
    }
    if (typeof password !== "string" || password.length < PASSWORD_MIN_LENGTH) {
        return res.status(400).json({
            message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters long.`
        });
    }

    try {
        const user = await User.findOne({
            passwordResetTokenHash: hashToken(token),
            passwordResetTokenExpires: { $gt: new Date() }
        });
        if (!user) {
            return res.status(400).json({ message: "This password reset link is invalid or has expired." });
        }

        user.password = await bcrypt.hash(password, 10);
        user.authTokenVersion += 1;
        user.passwordResetTokenHash = null;
        user.passwordResetTokenExpires = null;
        await user.save();

        return res.status(200).json({ message: "Password updated. You can now sign in." });
    } catch (error) {
        console.error("Password reset failed:", error.message);
        return res.status(500).json({ message: "Server error!" });
    }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password -verificationTokenHash -passwordResetTokenHash');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
    registerUser,
    verifyEmail,
    resendVerificationEmail,
    loginUser,
    requestPasswordReset,
    resetPassword,
    getUsers
};
