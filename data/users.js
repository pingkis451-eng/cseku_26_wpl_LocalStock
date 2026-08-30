/**
 * In-memory user store.
 *
 * This is a placeholder so the app runs with zero database setup while the
 * team wires up MongoDB. Swap this module for a real Mongoose "User" model
 * later — every function below returns a Promise on purpose, so the call
 * sites in routes/auth.js won't need to change when you switch to a real DB.
 *
 * Data resets every time the server restarts. Do not use this in production.
 */

let users = [];
let nextId = 1;

function findByEmail(email) {
  const normalized = String(email).trim().toLowerCase();
  return Promise.resolve(users.find((u) => u.email === normalized) || null);
}

function findById(id) {
  return Promise.resolve(users.find((u) => u.id === id) || null);
}

function createUser({ name, email, passwordHash, role }) {
  const user = {
    id: nextId++,
    name,
    email: String(email).trim().toLowerCase(),
    passwordHash,
    role: role || "customer", // 'customer' | 'retailer' | 'admin'
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  return Promise.resolve(user);
}

module.exports = { findByEmail, findById, createUser };
