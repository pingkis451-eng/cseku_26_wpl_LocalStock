# LocalStock — Express Server

A minimal Node.js/Express backend that serves LocalStock's frontend pages and
handles session-based authentication.

> Your original prompt referenced "FixMate" in the auth section — this build
> assumes that was left over from a template and wires everything up for
> **LocalStock** instead. Say the word if you actually meant a different app.

## Run it

```bash
npm install
npm start          # or: npm run dev  (auto-restarts on file changes)
```

Server runs at `http://localhost:3000`.

## Routes

| Route | Method | Description |
|---|---|---|
| `/` | GET | Landing page |
| `/login` | GET | Login page (redirects to `/dashboard` if already logged in) |
| `/dashboard` | GET | Customer dashboard — **protected**, requires login |
| `/directory` | GET | Store directory (placeholder page) |
| `/checkout` | GET | Reservation confirmation — **protected**, requires login |
| `/register` | POST | Create an account, hashes password with bcryptjs |
| `/login` | POST | Verify credentials, sets `req.session.user` |
| `/logout` | GET | Destroys the session, redirects to `/` |
| `/api/me` | GET | Returns the current session user (or `null`) — handy for frontend checks |

## Project structure

```
localstock-server/
├── server.js                 # app setup, session middleware, page routes
├── routes/
│   └── auth.js                # POST /register, POST /login, GET /logout
├── middleware/
│   └── isAuthenticated.js     # guards private routes
├── data/
│   └── users.js               # in-memory user store (placeholder — see below)
└── public/                    # static HTML pages served directly
    ├── landing.html
    ├── login.html
    ├── dashboard.html
    ├── directory.html
    └── checkout.html
```

## Important: the user store is in-memory

`data/users.js` is a placeholder so the app runs with zero database setup.
**Every user is lost when the server restarts.** Per the SRS, LocalStock's
target database is MongoDB — when you're ready, replace `data/users.js` with
a real Mongoose model. Every function in that file already returns a
`Promise`, so `routes/auth.js` won't need to change:

```js
// Example replacement using Mongoose
const User = require("../models/User"); // a Mongoose schema

function findByEmail(email) {
  return User.findOne({ email: email.trim().toLowerCase() });
}
function createUser({ name, email, passwordHash, role }) {
  return User.create({ name, email, passwordHash, role });
}
module.exports = { findByEmail, createUser, /* ...findById */ };
```

## Notes on the auth logic (REQ-UM-01 to REQ-UM-05)

- Passwords are hashed with **bcryptjs** (10 salt rounds) — never stored in plaintext.
- `POST /register` rejects attempts to self-register as `admin` (admin accounts shouldn't be public signups).
- `POST /login` returns the same generic error for "no such user" and "wrong password", so the response doesn't leak which part was wrong.
- `req.session.user` only stores `{ id, name, email, role }` — never the password hash.
- `isAuthenticated` redirects browser requests to `/login`, but returns `401 JSON` for API/fetch requests, so it works for both page loads and frontend `fetch()` calls.
- This build does **not** yet implement the retailer-specific gate from REQ-SB-05 (blocking a `SUSPENDED` retailer's management actions). That needs a `subscriptionStatus` field on the user/store record and a second middleware layered after `isAuthenticated` — happy to add that next.

## Session cookie

Sessions use the default in-memory `express-session` store, which is fine for
development but resets on restart and won't scale across multiple server
instances. For production, swap in `connect-mongo` (pairs naturally with a
MongoDB-backed user store) or `connect-redis`.

Set a real `SESSION_SECRET` in a `.env` file before deploying — see `.env.example`.
