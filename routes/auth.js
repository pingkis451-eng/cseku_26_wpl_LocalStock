const express = require("express");
const bcrypt = require("bcryptjs");
const users = require("../data/users");

const router = express.Router();

const SALT_ROUNDS = 10;
const VALID_ROLES = ["customer", "retailer", "admin"];

/**
 * POST /register
 * Body: { name, email, password, role? }
 * Creates a new user with a bcrypt-hashed password.
 *
 * Note: per the SRS, a retailer account still needs Admin verification and
 * an active subscription before it can manage a store — this route only
 * covers account creation, not that approval step.
 */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required." });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters." });
    }

    const chosenRole = VALID_ROLES.includes(role) ? role : "customer";

    const existing = await users.findByEmail(email);
    if (existing) {
      return res.status(409).json({ error: "An account with that email already exists." });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await users.createUser({ name, email, passwordHash, role: chosenRole });

    // Log the user in immediately after registering.
    req.session.user = { id: user.id, name: user.name, email: user.email, role: user.role };

    return res.status(201).json({
      message: "Account created.",
      user: req.session.user,
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ error: "Something went wrong while creating your account." });
  }
});

/**
 * POST /login
 * Body: { email, password }
 * Verifies credentials and stores the user in req.session.user.
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const user = await users.findByEmail(email);
    if (!user) {
      // Same generic message for "no such user" and "wrong password" —
      // don't reveal which part was wrong.
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const requestedRole = VALID_ROLES.includes(role) ? role : user.role;
    if (requestedRole !== user.role) {
      return res.status(403).json({
        error: `This account is registered as a ${user.role}. Please use the matching login tab.`,
      });
    }

    req.session.user = { id: user.id, name: user.name, email: user.email, role: user.role };

    return res.json({
      message: "Logged in.",
      user: req.session.user,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Something went wrong while logging in." });
  }
});

/**
 * GET /logout
 * Destroys the session and redirects to the landing page.
 */
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).send("Could not log out. Please try again.");
    }
    res.clearCookie("connect.sid");
    return res.redirect("/");
  });
});

module.exports = router;
