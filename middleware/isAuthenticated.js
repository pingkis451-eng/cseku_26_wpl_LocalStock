/**
 * Protects private routes (e.g. /dashboard) by checking for a logged-in
 * session. If there's no req.session.user, we redirect browser requests to
 * /login, and send a 401 JSON response to API/fetch requests instead.
 */
function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }

  if (req.accepts("html")) {
    return res.redirect("/login");
  }

  return res.status(401).json({ error: "Not authenticated. Please log in." });
}

module.exports = isAuthenticated;
