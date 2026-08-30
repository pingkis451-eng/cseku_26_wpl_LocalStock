const path = require("path");
const express = require("express");
const session = require("express-session");

const authRoutes = require("./routes/auth");
const isAuthenticated = require("./middleware/isAuthenticated");

const app = express();
const PORT = process.env.PORT || 3000;

function requireRole(allowedRoles) {
  return (req, res, next) => {
    const user = req.session && req.session.user;

    if (!user) {
      return isAuthenticated(req, res, next);
    }

    if (allowedRoles.includes(user.role)) {
      return next();
    }

    if (req.accepts("html")) {
      if (user.role === "retailer") {
        return res.redirect("/retailer-dashboard");
      }
      if (user.role === "admin") {
        return res.redirect("/admin-dashboard");
      }
      return res.redirect("/dashboard");
    }

    return res.status(403).json({ error: "Access denied for this account type." });
  };
}

// ---------- Core middleware ----------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "localstock-dev-secret-change-me",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
      // secure: true, // enable once the app is served over HTTPS in production
    },
  })
);

// Serve static assets (css/js/images) from /public as-is.
app.use(express.static(path.join(__dirname, "public")));

// Authentication routes: POST /register, POST /login, GET /logout
app.use("/", authRoutes);

// ---------- Page routes ----------
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "landing.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "register.html"));
});

app.get("/dashboard", isAuthenticated, (req, res) => {
  if (req.session.user.role === "retailer") {
    return res.redirect("/retailer-dashboard");
  }
  if (req.session.user.role === "admin") {
    return res.redirect("/admin-dashboard");
  }
  return res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

app.get("/retailer-dashboard", isAuthenticated, requireRole(["retailer"]), (req, res) => {
  res.sendFile(path.join(__dirname, "public", "localstock-retailer-dashboard.html"));
});

app.get("/admin-dashboard", isAuthenticated, requireRole(["admin"]), (req, res) => {
  res.sendFile(path.join(__dirname, "public", "localstock-admin-dashboard.html"));
});

app.get("/directory", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "directory.html"));
});

app.get("/checkout", isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "checkout.html"));
});

// Small helper endpoint the frontend can call to check session state.
app.get("/api/me", (req, res) => {
  res.json({ user: req.session.user || null });
});

// ---------- 404 fallback ----------
app.use((req, res) => {
  res.status(404).send("Page not found.");
});

app.listen(PORT, () => {
  console.log(`LocalStock server running at http://localhost:${PORT}`);
});
