// Intermediate lessons: Express, Firebase, Writing Tests, Interview Prep (+ problems)
export const express = [
  {
    id: "i-ex-router", title: "A full CRUD API with Express Router", minutes: 30,
    goal: "Organize routes into a router and implement create, read, update and delete.",
    body: [
      "**CRUD** maps onto HTTP: Create = `POST /notes`, Read = `GET /notes` and `GET /notes/:id`, Update = `PATCH /notes/:id` (or PUT to replace), Delete = `DELETE /notes/:id`.",
      "`express.Router()` groups related routes in their own file. Mount it with `app.use(\"/api/notes\", notesRouter)`, and the paths inside become relative.",
      "Use the right status codes: 201 Created (with the new item), 204 No Content after a delete, 404 when the id doesn't exist, 400 for bad input.",
      "PATCH should only change the fields that were sent.",
    ],
    example: { lang: "js", run: "server", code:
`import express from "express";

const notes = [{ id: 1, title: "Buy flour", done: false }];
let nextId = 2;
const router = express.Router();

router.get("/", (req, res) => res.json(notes));

router.get("/:id", (req, res) => {
  const note = notes.find((n) => n.id === Number(req.params.id));
  note ? res.json(note) : res.status(404).json({ error: "Note not found" });
});

router.post("/", (req, res) => {
  if (!req.body?.title) return res.status(400).json({ error: "title is required" });
  const note = { id: nextId++, title: req.body.title, done: false };
  notes.push(note);
  res.status(201).json(note);
});

router.patch("/:id", (req, res) => {
  const note = notes.find((n) => n.id === Number(req.params.id));
  if (!note) return res.status(404).json({ error: "Note not found" });
  const { title, done } = req.body;
  if (title !== undefined) note.title = title;
  if (done !== undefined) note.done = Boolean(done);
  res.json(note);
});

router.delete("/:id", (req, res) => {
  const i = notes.findIndex((n) => n.id === Number(req.params.id));
  if (i === -1) return res.status(404).json({ error: "Note not found" });
  notes.splice(i, 1);
  res.status(204).end();
});

const app = express();
app.use(express.json());
app.use("/api/notes", router);
app.listen(3000);` },
    demo: [
      { lines: [5], say: "A router is a mini-app for one resource." },
      { lines: [7], say: "GET /api/notes: the list.", out: "[{\"id\":1,\"title\":\"Buy flour\",\"done\":false}]" },
      { lines: [9, 10, 11, 12], say: "GET one, or a 404." },
      { lines: [14, 15, 16, 17, 18, 19], say: "POST validates, creates and answers 201 with the new note." },
      { lines: [21, 22, 23, 24, 25, 26, 27, 28], say: "PATCH only touches the fields that were sent." },
      { lines: [30, 31, 32, 33, 34, 35], say: "DELETE answers 204 with an empty body." },
      { lines: [39], say: "Mounted at /api/notes, so the router's \"/\" means /api/notes." },
    ],
    practice: { task: "Add `GET /api/notes?done=true` filtering to the list route.",
      hint: "Read req.query.done, which is a string, so compare to \"true\".",
      solution: { lang: "js", run: "check", code:
`router.get("/", (req, res) => {
  const { done } = req.query;
  if (done === undefined) return res.json(notes);
  res.json(notes.filter((n) => n.done === (done === "true")));
});` } },
    check: [
      { q: "Status after a successful DELETE with no body?", options: ["200", "201", "204", "404"], answer: 2, why: "204 No Content." },
      { q: "PATCH vs PUT?", options: ["Same", "PATCH changes some fields; PUT replaces the whole resource", "PUT is for creating only", "PATCH deletes"], answer: 1, why: "PATCH is a partial update." },
    ],
  },
  {
    id: "i-ex-errors", title: "Validation and error-handling middleware", minutes: 25,
    goal: "Validate input in one place and send every error through one handler.",
    body: [
      "Write **validation middleware** that checks `req.body` and either calls `next()` or answers 400 with the problems listed.",
      "An **error-handling middleware** has **four** parameters: `(err, req, res, next)`. Register it **last**. Any route that throws or calls `next(err)` ends up there.",
      "Express 5 also catches errors from `async` route handlers automatically.",
      "Never send stack traces or database messages to users. Log the details on the server and send a short, safe message.",
    ],
    example: { lang: "js", run: "server", code:
`import express from "express";

class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

const requireFields = (...fields) => (req, res, next) => {
  const missing = fields.filter((f) => !req.body?.[f]);
  if (missing.length) return res.status(400).json({ error: "Missing: " + missing.join(", ") });
  next();
};

const app = express();
app.use(express.json());

app.post("/api/books", requireFields("title", "author"), (req, res) => {
  res.status(201).json({ id: 1, ...req.body });
});

app.get("/api/books/:id", async (req, res) => {
  throw new HttpError(404, "Book not found");
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  if (status === 500) console.error(err);
  res.status(status).json({ error: status === 500 ? "Something went wrong" : err.message });
});

app.listen(3000);` },
    demo: [
      { lines: [3, 4, 5], say: "An error type that carries an HTTP status." },
      { lines: [7, 8, 9, 10, 11], say: "Reusable validation: list the required fields, get a middleware back." },
      { lines: [16], say: "Validation runs before the handler. Missing fields never reach it.", out: "400 {\"error\":\"Missing: title, author\"}" },
      { lines: [20, 21, 22], say: "Throwing inside an async handler is caught by Express 5." },
      { lines: [24, 25, 26, 27, 28], say: "Four parameters make this the error handler. Unknown errors are logged and hidden.", out: "404 {\"error\":\"Book not found\"}" },
    ],
    practice: { task: "Extend requireFields into `validate(schema)` where schema maps field names to a check function, e.g. `{ price: (v) => v >= 0 }`.",
      hint: "Collect the fields whose check fails.",
      solution: { lang: "js", run: "check", code:
`const validate = (schema) => (req, res, next) => {
  const bad = Object.entries(schema).filter(([key, ok]) => !ok(req.body?.[key])).map(([key]) => key);
  if (bad.length) return res.status(400).json({ error: "Invalid: " + bad.join(", ") });
  next();
};
// app.post("/api/books", validate({ title: Boolean, price: (v) => typeof v === "number" && v >= 0 }), handler);` } },
    check: [
      { q: "How does Express recognize error-handling middleware?", options: ["Its name", "It has four parameters", "It's registered first", "It returns false"], answer: 1, why: "(err, req, res, next)." },
      { q: "What should a 500 response contain?", options: ["The stack trace", "A short, safe message", "The SQL query", "Environment variables"], answer: 1, why: "Details go in your logs, not to the user." },
    ],
  },
  {
    id: "i-ex-db", title: "Express + PostgreSQL, CORS and environment variables", minutes: 30,
    goal: "Store API data in Postgres, configure CORS, and keep settings in .env.",
    diagram: "client-server-db",
    body: [
      "Create one `pg.Pool` for the whole app and query it with parameters (`$1`).",
      "Put settings in a `.env` file (`DATABASE_URL`, `PORT`, `CLIENT_URL`) and load them with `node --env-file=.env server.js` (built into Node 20+) or the `dotenv` package. Keep `.env` out of git.",
      "**CORS:** browsers block a page on one origin from reading responses from another, unless the server allows it. Use the `cors` middleware and allow **only your frontend's origin**, not `*`.",
      "`RETURNING *` gives back the inserted or updated row in the same query.",
    ],
    example: { lang: "js", run: "check", code:
`import express from "express";
import cors from "cors";
import morgan from "morgan";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const app = express();

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(morgan("dev"));
app.use(express.json());

app.get("/api/notes", async (req, res) => {
  const { rows } = await pool.query("SELECT id, title, done FROM notes ORDER BY id");
  res.json(rows);
});

app.post("/api/notes", async (req, res) => {
  const title = req.body?.title?.trim();
  if (!title) return res.status(400).json({ error: "title is required" });
  const { rows } = await pool.query("INSERT INTO notes (title) VALUES ($1) RETURNING *", [title]);
  res.status(201).json(rows[0]);
});

app.listen(process.env.PORT || 3000);
// Run with: node --env-file=.env server.js` },
    demo: [
      { lines: [6], say: "One pool, shared by every request. The URL comes from .env." },
      { lines: [9], say: "Only your frontend (e.g. http://localhost:5173) may call this API from a browser." },
      { lines: [13, 14, 15, 16], say: "Read from the database. rows is an array of plain objects." },
      { lines: [21], say: "$1 is a parameter, so the title can never inject SQL. RETURNING gives back the new row." },
      { lines: [25, 26], say: "Settings come from the environment, so nothing secret lives in the code." },
    ],
    practice: { task: "Write the .env file and the CREATE TABLE statement this API needs.",
      hint: "notes: id, title, done with a default.",
      solution: { lang: "sql", run: "sql", code: "CREATE TABLE notes (\n  id SERIAL PRIMARY KEY,\n  title TEXT NOT NULL,\n  done BOOLEAN NOT NULL DEFAULT false\n);\n-- .env\n-- DATABASE_URL=postgres://user:pass@localhost:5432/notes\n-- CLIENT_URL=http://localhost:5173\n-- PORT=3000",
        output: "CREATE TABLE" } },
    check: [
      { q: "What does CORS control?", options: ["Which servers your API can call", "Which browser origins may read your API's responses", "Database access", "Cookie size"], answer: 1, why: "CORS is a browser rule the server opts into." },
      { q: "Should origin be '*' for an API with logins?", options: ["Yes", "No, allow only your own frontend"], answer: 1, why: "Allow the narrowest set of origins." },
    ],
  },
];

export const firebase = [
  {
    id: "i-fb-google", title: "Google sign-in and auth state in React", minutes: 25,
    goal: "Add Google sign-in and share the signed-in user across a React app.",
    body: [
      "Enable Google in Firebase Console → Authentication → Sign-in method. Then `signInWithPopup(auth, new GoogleAuthProvider())`.",
      "Wrap `onAuthStateChanged` in a React context so every component knows the user. Track a `loading` flag too: on page load Firebase needs a moment to restore the session.",
      "Until `loading` is false, show a skeleton, not the logged-out screen. Otherwise signed-in users see a flash of the sign-in page.",
      "Remember: hiding a page in React is only **UX**. Protect the data itself with Security Rules.",
    ],
    example: { lang: "jsx", run: "check", code:
`"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "./firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => onAuthStateChanged(auth, (u) => { setUser(u); setLoading(false); }), []);

  const value = {
    user,
    loading,
    signIn: () => signInWithPopup(auth, new GoogleAuthProvider()),
    signOut: () => signOut(auth),
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

export function AccountButton() {
  const { user, loading, signIn, signOut } = useAuth();
  if (loading) return <span aria-busy="true">…</span>;
  return user
    ? <button onClick={signOut}>Sign out {user.displayName}</button>
    : <button onClick={signIn}>Sign in with Google</button>;
}` },
    demo: [
      { lines: [9, 10], say: "The user, plus a loading flag that starts true." },
      { lines: [12], say: "onAuthStateChanged returns its unsubscribe function, which doubles as the effect's cleanup." },
      { lines: [17], say: "Google sign-in in one line." },
      { lines: [23, 24, 25, 26, 27], say: "The usual guard hook." },
      { lines: [31], say: "While Firebase restores the session, show a neutral placeholder." },
      { lines: [32, 33, 34], say: "Then the right button for the real state." },
    ],
    practice: { task: "Write a `RequireAuth` component that shows its children only when signed in, a sign-in button when not, and nothing while loading.",
      hint: "Read useAuth() and branch on loading, then user.",
      solution: { lang: "jsx", run: "check", code:
`export function RequireAuth({ children }) {
  const { user, loading, signIn } = useAuth();
  if (loading) return null;
  if (!user) return <button onClick={signIn}>Sign in to continue</button>;
  return children;
}` } },
    check: [
      { q: "Why track loading separately from user?", options: ["Speed", "user is null both before restore and when logged out", "Firebase requires it", "For SEO"], answer: 1, why: "Without it, signed-in users briefly see the logged-out UI." },
      { q: "Does hiding a page in React protect the data?", options: ["Yes", "No, use Security Rules"], answer: 1, why: "Client-side checks are UX only." },
    ],
  },
  {
    id: "i-fb-queries", title: "Firestore queries and real-time listeners", minutes: 25,
    goal: "Filter, sort and limit queries, and keep a list updated live with onSnapshot.",
    diagram: "firestore",
    body: [
      "`query(collection(db, \"notes\"), where(\"owner\", \"==\", uid), orderBy(\"createdAt\", \"desc\"), limit(20))`.",
      "Combining `where` on one field with `orderBy` on another needs a **composite index**. Firestore's error message includes a link that creates it for you.",
      "`onSnapshot(q, callback)` calls you now **and on every change**, from any device. It returns an unsubscribe function: call it in your effect's cleanup.",
      "Each document read counts toward your quota, so always `limit()` lists.",
    ],
    example: { lang: "jsx", run: "check", code:
`import { useEffect, useState } from "react";
import { collection, limit, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db } from "./firebase";

export function useMyNotes(uid) {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!uid) return;
    const q = query(
      collection(db, "notes"),
      where("owner", "==", uid),
      orderBy("createdAt", "desc"),
      limit(20),
    );
    return onSnapshot(
      q,
      (snap) => setNotes(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
      (err) => setError(err.message),
    );
  }, [uid]);

  return { notes, error };
}` },
    demo: [
      { lines: [5], say: "A custom hook: any component can get the user's live notes." },
      { lines: [10], say: "No user yet? Don't query." },
      { lines: [11, 12, 13, 14, 15, 16], say: "My notes, newest first, at most 20." },
      { lines: [17, 18, 19], say: "Runs now and every time a matching note changes, even from another device." },
      { lines: [20], say: "Errors (missing index, denied by rules) are surfaced, not swallowed." },
      { lines: [17], say: "Returning onSnapshot's unsubscribe stops listening on unmount." },
    ],
    practice: { task: "Change the hook so it also returns a `loading` boolean that's true until the first snapshot arrives.",
      hint: "Start loading at true, and set it false in both callbacks.",
      solution: { lang: "jsx", run: "check", code:
`const [loading, setLoading] = useState(true);
// in onSnapshot:
// (snap) => { setNotes(...); setLoading(false); },
// (err) => { setError(err.message); setLoading(false); }
// return { notes, error, loading };` } },
    check: [
      { q: "What does onSnapshot return?", options: ["The documents", "An unsubscribe function", "A Promise", "Nothing"], answer: 1, why: "Call it to stop listening." },
      { q: "where on owner + orderBy on createdAt needs…", options: ["Nothing", "A composite index", "Two queries", "Cloud Functions"], answer: 1, why: "Firestore needs an index for that combination." },
    ],
  },
  {
    id: "i-fb-rules", title: "Security Rules basics", minutes: 25,
    goal: "Write Firestore rules so users can only read and write their own data.",
    body: [
      "Security Rules run on Google's servers for **every** read and write. They're the real protection, because anyone can call Firestore directly with your public config.",
      "`request.auth` is the signed-in user (null if not signed in). `resource.data` is the document **as it is now**, and `request.resource.data` is the document **as it would be** after the write.",
      "Start from **deny everything**, then open exactly what each collection needs.",
      "Test rules in the Rules Playground in the console, or with the Firebase emulator (Advanced).",
    ],
    example: { lang: "text", code:
`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /notes/{noteId} {
      allow read, delete: if request.auth != null
                          && request.auth.uid == resource.data.owner;
      allow create: if request.auth != null
                    && request.auth.uid == request.resource.data.owner
                    && request.resource.data.text is string
                    && request.resource.data.text.size() <= 500;
      allow update: if request.auth != null
                    && request.auth.uid == resource.data.owner
                    && request.resource.data.owner == resource.data.owner;
    }

    match /{document=**} {
      allow read, write: if false;
    }
  }
}` },
    demo: [
      { lines: [5], say: "Rules for each document in notes." },
      { lines: [6, 7], say: "Read or delete only your own notes: compare the user id to the stored owner." },
      { lines: [8, 9, 10, 11], say: "Create only as yourself, with text that's a string of at most 500 characters." },
      { lines: [12, 13, 14], say: "Update your own notes, and you can't hand them to someone else." },
      { lines: [17, 18, 19], say: "Everything else is denied." },
    ],
    practice: { task: "Write a rule for a `profiles/{uid}` collection: anyone signed in can read profiles, but only the owner (where uid matches) can write theirs.",
      hint: "Compare `request.auth.uid == uid` using the wildcard.",
      solution: { lang: "text", code: "match /profiles/{uid} {\n  allow read: if request.auth != null;\n  allow write: if request.auth != null && request.auth.uid == uid;\n}" } },
    check: [
      { q: "request.resource.data is…", options: ["The current document", "The document as it would be after the write", "The user", "The query"], answer: 1, why: "resource.data is now; request.resource.data is after." },
      { q: "A good starting point for rules is…", options: ["allow read, write: if true", "Deny everything, then open what's needed", "No rules", "Rules in your React code"], answer: 1, why: "Default-deny is safest." },
    ],
  },
];

export const testing = [
  {
    id: "i-test-async", title: "Testing async code and mocking fetch", minutes: 30,
    goal: "Test functions that call APIs, without hitting the real network.",
    body: [
      "Tests that call real APIs are slow and flaky. Replace `fetch` with a **mock** that returns what you choose.",
      "`vi.fn()` makes a fake function that records how it was called. `vi.stubGlobal(\"fetch\", mockFn)` swaps the global fetch for one test, and `vi.unstubAllGlobals()` restores it.",
      "Use `async` tests and `await` the code. `await expect(promise).rejects.toThrow()` checks for failures.",
      "Test the **unhappy paths** too: 404, network failure, empty results. That's where real bugs live.",
    ],
    example: { lang: "js", run: "vitest", file: "getUser.test.js", code:
`import { describe, it, expect, vi, afterEach } from "vitest";

async function getUser(id) {
  const res = await fetch("https://api.example.com/users/" + id);
  if (!res.ok) throw new Error("User " + id + " not found");
  return res.json();
}

const reply = (status, body) => Promise.resolve({ ok: status < 400, status, json: async () => body });

describe("getUser", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("returns the user", async () => {
    const fetchMock = vi.fn(() => reply(200, { id: 1, name: "Ana" }));
    vi.stubGlobal("fetch", fetchMock);
    await expect(getUser(1)).resolves.toEqual({ id: 1, name: "Ana" });
    expect(fetchMock).toHaveBeenCalledWith("https://api.example.com/users/1");
  });

  it("throws on 404", async () => {
    vi.stubGlobal("fetch", vi.fn(() => reply(404, {})));
    await expect(getUser(99)).rejects.toThrow("User 99 not found");
  });

  it("passes network errors through", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.reject(new TypeError("Failed to fetch"))));
    await expect(getUser(1)).rejects.toThrow("Failed to fetch");
  });
});` },
    demo: [
      { lines: [3, 4, 5, 6, 7], say: "The code under test calls the real global fetch." },
      { lines: [9], say: "A helper that builds a fake Response with just the parts we use." },
      { lines: [12], say: "Put the real fetch back after each test." },
      { lines: [15, 16], say: "Swap in a mock that answers 200 with a user." },
      { lines: [17, 18], say: "Check the result, and that the right URL was requested." },
      { lines: [21, 22, 23, 24], say: "The 404 path: getUser should throw a clear error." },
      { lines: [26, 27, 28, 29], say: "A network failure (fetch itself rejects).", out: "✓ getUser (3 tests) passed" },
    ],
    practice: { task: "Write a test proving `searchBooks(\"\")` returns [] WITHOUT calling fetch at all.",
      hint: "Stub fetch with vi.fn(), then `expect(fetchMock).not.toHaveBeenCalled()`.",
      solution: { lang: "js", run: "vitest", code:
`import { it, expect, vi } from "vitest";

async function searchBooks(q) {
  if (!q.trim()) return [];
  const res = await fetch("/api/books?q=" + encodeURIComponent(q));
  return res.json();
}

it("skips the request for an empty query", async () => {
  const fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);
  expect(await searchBooks("  ")).toEqual([]);
  expect(fetchMock).not.toHaveBeenCalled();
  vi.unstubAllGlobals();
});` } },
    check: [
      { q: "Why mock fetch in unit tests?", options: ["It's required", "Real APIs make tests slow, flaky and dependent on the network", "To hide bugs", "Fetch doesn't work in Node"], answer: 1, why: "Mocks make tests fast and deterministic." },
      { q: "How do you test a rejected promise?", options: ["try/catch only", "await expect(p).rejects.toThrow()", "expect(p).toThrow()", "You can't"], answer: 1, why: "rejects unwraps the promise for the matcher." },
    ],
  },
  {
    id: "i-test-forms", title: "Testing forms, user events and custom hooks", minutes: 30,
    goal: "Test a form the way a user fills it in, and test a custom hook on its own.",
    body: [
      "Find inputs by label: `getByLabelText(\"Email\")`. If that fails, your form probably isn't accessible.",
      "`await user.type(input, \"ana@example.com\")`, `await user.click(button)`, `await user.keyboard(\"{Enter}\")` behave like a real person.",
      "Pass mock callbacks (`const onDone = vi.fn()`) and assert on what they received.",
      "`renderHook` from Testing Library runs a custom hook without a component. Wrap state changes in `act()`.",
    ],
    example: { lang: "jsx", run: "check", file: "Signup.test.jsx", code:
`import { render, screen, renderHook, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import Signup from "./Signup";
import { useToggle } from "./useToggle";

describe("Signup", () => {
  it("shows errors and does not submit when empty", async () => {
    const user = userEvent.setup();
    const onDone = vi.fn();
    render(<Signup onDone={onDone} />);
    await user.click(screen.getByRole("button", { name: "Sign up" }));
    expect(screen.getByText("Enter your name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toHaveAttribute("aria-invalid", "true");
    expect(onDone).not.toHaveBeenCalled();
  });

  it("submits valid data", async () => {
    const user = userEvent.setup();
    const onDone = vi.fn();
    render(<Signup onDone={onDone} />);
    await user.type(screen.getByLabelText("Name"), "Ana");
    await user.type(screen.getByLabelText("Email"), "ana@example.com");
    await user.click(screen.getByRole("button", { name: "Sign up" }));
    expect(onDone).toHaveBeenCalledWith({ name: "Ana", email: "ana@example.com" });
  });
});

it("useToggle flips", () => {
  const { result } = renderHook(() => useToggle(false));
  act(() => result.current[1]());
  expect(result.current[0]).toBe(true);
});` },
    demo: [
      { lines: [8, 9, 10, 11], say: "A mock callback stands in for the parent." },
      { lines: [12], say: "Click submit with empty fields." },
      { lines: [13, 14, 15], say: "Errors are shown, the field is marked invalid, and nothing is submitted." },
      { lines: [22, 23, 24], say: "Type into fields found by their labels, just like a user." },
      { lines: [25], say: "The callback got exactly the form data." },
      { lines: [29, 30, 31, 32, 33], say: "renderHook tests a hook alone. act() wraps the state change." },
    ],
    practice: { task: "Test that pressing Enter in the email field submits the form.",
      hint: "`await user.type(emailInput, \"ana@example.com{Enter}\")`",
      solution: { lang: "jsx", run: "check", code:
`it("submits on Enter", async () => {
  const user = userEvent.setup();
  const onDone = vi.fn();
  render(<Signup onDone={onDone} />);
  await user.type(screen.getByLabelText("Name"), "Ana");
  await user.type(screen.getByLabelText("Email"), "ana@example.com{Enter}");
  expect(onDone).toHaveBeenCalledTimes(1);
});` } },
    check: [
      { q: "getByLabelText fails to find your input. That suggests…", options: ["A Testing Library bug", "The input has no proper label", "You need getByTestId", "The test is too fast"], answer: 1, why: "If tests can't find it by label, screen readers can't either." },
      { q: "What is renderHook for?", options: ["Rendering pages", "Testing a custom hook without writing a component", "Snapshot tests", "Mocking fetch"], answer: 1, why: "It runs the hook inside a tiny test component for you." },
    ],
  },
  {
    id: "i-test-coverage", title: "Coverage, and pytest fixtures and parametrize", minutes: 25,
    goal: "Read a coverage report sensibly, and remove repetition from Python tests.",
    body: [
      "**Coverage** reports which lines ran during your tests: `npx vitest run --coverage` or `pytest --cov`. Low coverage shows untested code. **High coverage doesn't prove the tests are good**: a test can run a line without checking its result.",
      "Aim coverage at what matters: business logic, validation and edge cases. Don't chase 100% on simple glue code.",
      "**Fixtures** in pytest provide setup for tests: a function decorated with `@pytest.fixture`, requested by naming it as a test parameter.",
      "`@pytest.mark.parametrize` runs one test with many inputs. Each case is reported separately.",
    ],
    example: { lang: "python", run: "pytest", file: "test_cart.py", code:
`import pytest

class Cart:
    def __init__(self):
        self.items = {}
    def add(self, sku, qty=1):
        if qty < 1:
            raise ValueError("qty must be at least 1")
        self.items[sku] = self.items.get(sku, 0) + qty
    def count(self):
        return sum(self.items.values())

@pytest.fixture
def cart():
    c = Cart()
    c.add("fern", 2)
    return c

def test_adds_to_existing(cart):
    cart.add("fern")
    assert cart.items["fern"] == 3

@pytest.mark.parametrize("sku, qty, expected", [
    ("cactus", 1, 3),
    ("cactus", 5, 7),
    ("fern", 1, 3),
])
def test_count(cart, sku, qty, expected):
    cart.add(sku, qty)
    assert cart.count() == expected

@pytest.mark.parametrize("bad", [0, -1])
def test_rejects_bad_qty(cart, bad):
    with pytest.raises(ValueError):
        cart.add("fern", bad)`,
      output: "6 passed" },
    demo: [
      { lines: [13, 14, 15, 16, 17], say: "A fixture: every test that asks for cart gets a fresh one with 2 ferns." },
      { lines: [19, 20, 21], say: "Request the fixture by naming it as a parameter." },
      { lines: [23, 24, 25, 26, 27], say: "One test, three cases. Each shows up separately in the results." },
      { lines: [28, 29, 30], say: "The test body runs once per row." },
      { lines: [32, 33, 34, 35], say: "Parametrize the edge cases too.", out: "6 passed" },
    ],
    practice: { task: "Parametrize a test for `is_leap(year)` with 2024 → True, 1900 → False, 2000 → True, 2023 → False.",
      hint: "`@pytest.mark.parametrize(\"year, expected\", [...])`",
      solution: { lang: "python", run: "pytest", code:
`import pytest

def is_leap(year):
    return (year % 4 == 0 and year % 100 != 0) or year % 400 == 0

@pytest.mark.parametrize("year, expected", [(2024, True), (1900, False), (2000, True), (2023, False)])
def test_is_leap(year, expected):
    assert is_leap(year) == expected`, output: "4 passed" } },
    check: [
      { q: "100% coverage means…", options: ["No bugs", "Every line ran during tests, not that results were checked", "Tests are fast", "The app is secure"], answer: 1, why: "Coverage measures execution, not correctness." },
      { q: "How does a test get a pytest fixture?", options: ["Import it", "Name it as a parameter", "Call it in setUp", "Decorate the test"], answer: 1, why: "pytest injects fixtures by parameter name." },
    ],
  },
];

export const interview = [
  {
    id: "i-int-patterns", title: "Patterns: two pointers, sliding window, hash maps", minutes: 30,
    goal: "Recognize the three patterns behind most junior and mid-level array and string problems.",
    body: [
      "**Hash map** (a JavaScript `Map` or object): when you need \"have I seen this?\" or \"how many of each?\", trade memory for speed. It turns O(n²) nested loops into O(n).",
      "**Two pointers**: one index at each end (or a slow and a fast pointer) moving toward each other. Good for sorted arrays, palindromes, and removing items in place.",
      "**Sliding window**: a range `[left, right]` that grows to the right and shrinks from the left. Good for \"longest/shortest substring or subarray that…\" problems.",
      "Say the pattern out loud in interviews: \"This looks like a sliding window because…\". It shows how you think.",
    ],
    example: { lang: "js", run: "node", code:
`// Sliding window: longest substring without repeating characters
function longestUnique(s) {
  const lastSeen = new Map();
  let left = 0, best = 0;
  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    if (lastSeen.has(ch) && lastSeen.get(ch) >= left) left = lastSeen.get(ch) + 1;
    lastSeen.set(ch, right);
    best = Math.max(best, right - left + 1);
  }
  return best;
}

// Two pointers: move zeros to the end, in place
function moveZeros(nums) {
  let write = 0;
  for (let read = 0; read < nums.length; read++) {
    if (nums[read] !== 0) [nums[write++], nums[read]] = [nums[read], nums[write]];
  }
  return nums;
}

console.log(longestUnique("abcabcbb"), longestUnique("bbbb"), longestUnique(""));
console.log(moveZeros([0, 1, 0, 3, 12]));`,
      output: "3 1 0\n[ 1, 3, 12, 0, 0 ]" },
    demo: [
      { lines: [3, 4], say: "A Map remembers each character's last position. The window starts empty." },
      { lines: [5, 6, 7], say: "Grow the window to the right. On a repeat inside the window, jump left past it." },
      { lines: [8, 9], say: "Record the position and keep the best window length." },
      { lines: [15, 16, 17, 18], say: "Two pointers: read scans everything, write marks where the next non-zero goes." },
      { lines: [23], say: "\"abc\" is the longest unique run.", out: "3 1 0" },
      { lines: [24], say: "Zeros moved to the end, order kept, no extra array.", out: "[ 1, 3, 12, 0, 0 ]" },
    ],
    practice: { task: "Which pattern fits? (a) Is there a pair in a SORTED array summing to 10? (b) Find the first non-repeating character. (c) The maximum sum of any 3 consecutive numbers.",
      hint: "Sorted + pair → ?, counting → ?, fixed-size range → ?",
      solution: { lang: "text", code: "(a) Two pointers from both ends\n(b) Hash map of counts, then a second pass\n(c) Sliding window of size 3" } },
    check: [
      { q: "Turning nested loops into one pass usually uses…", options: ["Recursion", "A hash map", "Sorting", "Regex"], answer: 1, why: "Lookups in a Map are O(1)." },
      { q: "\"Longest substring with at most k distinct letters\" suggests…", options: ["Two pointers from both ends", "Sliding window", "Binary search", "Brute force"], answer: 1, why: "Grow and shrink a window while tracking counts." },
    ],
  },
  {
    id: "i-int-recursion", title: "Recursion and building a component live", minutes: 30,
    goal: "Solve problems with recursion, and handle a live \"build a component\" round.",
    body: [
      "A recursive function calls itself on a **smaller** input. It needs a **base case** that stops it: without one, it runs until the stack overflows.",
      "Good fits: nested data (flatten arrays, walk a folder tree or a menu), and splitting problems in half.",
      "Live component rounds (tabs, accordion, modal, autocomplete) are graded on: working state, **keyboard and screen-reader support**, clean structure, and talking through trade-offs. Start simple, get it working, then improve it.",
      "Tell them what you'd add with more time: tests, edge cases, animation, loading states.",
    ],
    example: { lang: "jsx", run: "check", code:
`// Recursion: total size of a folder tree
function totalSize(node) {
  if (!node.children) return node.size;          // base case: a file
  return node.children.reduce((sum, child) => sum + totalSize(child), 0);
}

// Live round: accessible tabs
import { useState } from "react";

export function Tabs({ tabs }) {
  const [active, setActive] = useState(0);
  function onKeyDown(e) {
    if (e.key === "ArrowRight") setActive((i) => (i + 1) % tabs.length);
    if (e.key === "ArrowLeft") setActive((i) => (i - 1 + tabs.length) % tabs.length);
  }
  return (
    <div>
      <div role="tablist" onKeyDown={onKeyDown}>
        {tabs.map((t, i) => (
          <button key={t.id} role="tab" id={"tab-" + t.id} aria-selected={i === active}
            aria-controls={"panel-" + t.id} tabIndex={i === active ? 0 : -1} onClick={() => setActive(i)}>
            {t.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={"panel-" + tabs[active].id} aria-labelledby={"tab-" + tabs[active].id}>
        {tabs[active].content}
      </div>
    </div>
  );
}` },
    demo: [
      { lines: [3], say: "Base case: a file has no children, so return its size." },
      { lines: [4], say: "Recursive case: the folder's size is the sum of its children's sizes." },
      { lines: [10, 11], say: "One piece of state: which tab is active." },
      { lines: [12, 13, 14, 15], say: "Arrow keys move between tabs, wrapping around at the ends." },
      { lines: [18, 19, 20, 21], say: "ARIA roles and states tell screen readers it's a tab list." },
      { lines: [21], say: "Only the active tab is in the Tab order (a \"roving tabindex\")." },
      { lines: [26, 27, 28], say: "The panel is linked to its tab." },
    ],
    practice: { task: "Write a recursive `countKeys(obj)` that counts every key in a nested object (including keys inside nested objects).",
      hint: "For each key: 1, plus countKeys(value) if the value is an object.",
      solution: { lang: "js", run: "node", code:
`function countKeys(obj) {
  let n = 0;
  for (const value of Object.values(obj)) {
    n += 1;
    if (value && typeof value === "object" && !Array.isArray(value)) n += countKeys(value);
  }
  return n;
}
console.log(countKeys({ a: 1, b: { c: 2, d: { e: 3 } } }));`, output: "5" } },
    check: [
      { q: "What stops recursion?", options: ["A loop", "The base case", "return null", "try/catch"], answer: 1, why: "Without a base case, it never stops." },
      { q: "In a live component round, what comes first?", options: ["Perfect styling", "A simple working version, then improvements", "Writing tests first", "Choosing a library"], answer: 1, why: "Working beats polished-but-unfinished." },
    ],
  },
  {
    id: "i-int-story", title: "Talking about your projects (STAR)", minutes: 20,
    goal: "Explain a project and a challenge clearly in two minutes.",
    body: [
      "Use **STAR**: **S**ituation (the context), **T**ask (your goal), **A**ction (what *you* did, and why), **R**esult (the outcome, with a number if you have one).",
      "Pick a real **technical decision**: why server components, why you lifted state, how you fixed a bug. Interviewers dig into the \"why\".",
      "Be honest about tools, including AI help: \"I used Claude to scaffold the layout, then wrote the auth flow and tests myself\" is a strong answer when you can walk through the code.",
      "End with what you'd improve. It shows you can judge your own work.",
    ],
    example: { lang: "text", code:
`S  "In my internship project, Summarist, users saw the logged-out page flash
    for a second after refreshing, even when they were signed in."
T  "I needed the app to wait for Firebase to restore the session."
A  "I added an AuthListener that writes the user to Redux, with an
    'initializing' flag. Protected pages show a skeleton until it's false,
    and a separate isPremium value starts as null meaning 'still checking'."
R  "The flash is gone, and premium users are never wrongly redirected
    to the plans page."
+  "Next I'd move the premium check to the server so it can't be bypassed."` },
    demo: [
      { lines: [1, 2], say: "Situation: a specific, visible problem." },
      { lines: [3], say: "Task: what you set out to do." },
      { lines: [4, 5, 6], say: "Action: what you built, using the right terms." },
      { lines: [7, 8], say: "Result: what changed for users." },
      { lines: [9], say: "Bonus: what you'd do next, which shows judgment." },
    ],
    practice: { task: "Write a STAR answer for one bug you fixed in any of your projects. Keep it under 120 words, and say it out loud in under 90 seconds.",
      hint: "Choose a bug where you learned why it happened, not just how to fix it.",
      solution: { lang: "text", code: "There's no single answer. Check yours against this list:\n- Does Situation name the project and the symptom?\n- Is Action about what YOU did, with the reason?\n- Is Result specific?\n- Could you answer \"why did that happen?\" if they asked?" } },
    check: [
      { q: "STAR stands for…", options: ["Start, Talk, Answer, Repeat", "Situation, Task, Action, Result", "Skills, Tools, Achievements, References", "Story, Theme, Arc, Resolution"], answer: 1, why: "Situation, Task, Action, Result." },
    ],
  },
];

// Intermediate coding problems
export const problems = [
  { id: "longest-unique", title: "Longest substring without repeats", level: "Medium", topic: "Sliding window", tier: "intermediate",
    prompt: "Return the length of the longest part of the string with no repeated characters.",
    approach: "Keep a window [left, right] and a Map of each character's last index. When a character repeats inside the window, move left past its previous position.",
    solution: `function longestUnique(s) {\n  const last = new Map();\n  let left = 0, best = 0;\n  for (let right = 0; right < s.length; right++) {\n    if (last.has(s[right]) && last.get(s[right]) >= left) left = last.get(s[right]) + 1;\n    last.set(s[right], right);\n    best = Math.max(best, right - left + 1);\n  }\n  return best;\n}`,
    fn: "longestUnique", tests: [[["abcabcbb"], 3], [["bbbbb"], 1], [["pwwkew"], 3], [[""], 0]],
    followUp: "What's the time complexity, and why isn't it O(n²)?" },
  { id: "valid-brackets", title: "Valid brackets", level: "Medium", topic: "Stacks", tier: "intermediate",
    prompt: "Return true if every (, [ and { in the string is closed by the matching bracket in the right order.",
    approach: "Push opening brackets onto a stack. For a closing bracket, the top of the stack must be its partner. At the end the stack must be empty.",
    solution: `function isValid(s) {\n  const pairs = { ")": "(", "]": "[", "}": "{" };\n  const stack = [];\n  for (const ch of s) {\n    if ("([{".includes(ch)) stack.push(ch);\n    else if (ch in pairs) {\n      if (stack.pop() !== pairs[ch]) return false;\n    }\n  }\n  return stack.length === 0;\n}`,
    fn: "isValid", tests: [[["()[]{}"], true], [["([)]"], false], [["{[()]}"], true], [["(("], false], [[""], true]],
    followUp: "Where would you use this in a real app? (Think: code editors, form input for formulas.)" },
  { id: "group-anagrams", title: "Group anagrams", level: "Medium", topic: "Hash maps", tier: "intermediate",
    prompt: "Group words that are anagrams of each other. Return the groups in the order their first word appears.",
    approach: "Sort each word's letters to make a key, and collect words under that key in a Map (which keeps insertion order).",
    solution: `function groupAnagrams(words) {\n  const groups = new Map();\n  for (const w of words) {\n    const key = [...w].sort().join("");\n    if (!groups.has(key)) groups.set(key, []);\n    groups.get(key).push(w);\n  }\n  return [...groups.values()];\n}`,
    fn: "groupAnagrams", tests: [[[["eat", "tea", "tan", "ate", "nat", "bat"]], [["eat", "tea", "ate"], ["tan", "nat"], ["bat"]]], [[[]], []]],
    followUp: "Can you build the key without sorting? (A 26-letter count string.)" },
  { id: "move-zeros", title: "Move zeros to the end", level: "Easy", topic: "Two pointers", tier: "intermediate",
    prompt: "Move every 0 to the end of the array, keeping the order of the other numbers. Change the array in place and return it.",
    approach: "A write pointer marks where the next non-zero goes. Swap each non-zero into it.",
    solution: `function moveZeros(nums) {\n  let write = 0;\n  for (let read = 0; read < nums.length; read++) {\n    if (nums[read] !== 0) {\n      [nums[write], nums[read]] = [nums[read], nums[write]];\n      write++;\n    }\n  }\n  return nums;\n}`,
    fn: "moveZeros", tests: [[[[0, 1, 0, 3, 12]], [1, 3, 12, 0, 0]], [[[0, 0]], [0, 0]], [[[1, 2]], [1, 2]]],
    followUp: "Why is in-place important? What does it save?" },
  { id: "chunk", title: "Chunk an array", level: "Easy", topic: "Arrays", tier: "intermediate",
    prompt: "Split an array into groups of `size`. The last group may be smaller.",
    approach: "Step through the array `size` at a time and slice.",
    solution: `function chunk(arr, size) {\n  const out = [];\n  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));\n  return out;\n}`,
    fn: "chunk", tests: [[[[1, 2, 3, 4, 5], 2], [[1, 2], [3, 4], [5]]], [[[], 3], []], [[[1, 2, 3], 5], [[1, 2, 3]]]],
    followUp: "Where does this show up in UI work? (Pagination, rows of cards.)" },
  { id: "binary-search", title: "Binary search", level: "Medium", topic: "Searching", tier: "intermediate",
    prompt: "Given a SORTED array and a target, return the target's index, or -1. It must be faster than checking every item.",
    approach: "Look at the middle. If it's too small, search the right half; if it's too big, the left half. Halving each step gives O(log n).",
    solution: `function search(nums, target) {\n  let lo = 0, hi = nums.length - 1;\n  while (lo <= hi) {\n    const mid = Math.floor((lo + hi) / 2);\n    if (nums[mid] === target) return mid;\n    if (nums[mid] < target) lo = mid + 1;\n    else hi = mid - 1;\n  }\n  return -1;\n}`,
    fn: "search", tests: [[[[1, 3, 5, 7, 9, 11], 7], 3], [[[1, 3, 5], 4], -1], [[[], 1], -1], [[[2], 2], 0]],
    followUp: "How many steps does it take for 1,000,000 items? (About 20.)" },
];
