// Advanced lessons: Express, Firebase, Writing Tests, Interview Prep (+ problems)
export const express = [
  {
    id: "a-ex-auth", title: "Authentication: password hashing and JWTs", minutes: 30,
    goal: "Store passwords safely and issue tokens that prove who a user is.",
    body: [
      "**Never store passwords.** Store a slow, salted **hash** (bcrypt or argon2). At login, hash the attempt and compare. Even you can't see users' passwords.",
      "After login the server needs to remember the user. Two common ways: a **session** (a random id in a cookie, with the data on the server) or a **JWT** (a signed token holding the user id).",
      "A JWT is **signed, not encrypted**: anyone can read its contents, but nobody can change them without the secret. Never put secrets inside one, and keep tokens short-lived.",
      "Send tokens in an `httpOnly`, `secure`, `sameSite` cookie, so JavaScript on the page (and any XSS attack) can't read them.",
    ],
    example: { lang: "js", run: "node", code:
`import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "dev-only-secret-change-me";

const stored = await bcrypt.hash("correct horse battery staple", 12);
console.log(stored.startsWith("$2"), stored.length);

console.log(await bcrypt.compare("correct horse battery staple", stored));
console.log(await bcrypt.compare("guess123", stored));

const token = jwt.sign({ sub: "user_42", role: "member" }, SECRET, { expiresIn: "15m" });
const payload = jwt.verify(token, SECRET);
console.log(payload.sub, payload.role);

const [, body] = token.split(".");
console.log(JSON.parse(Buffer.from(body, "base64url").toString()).role);

try {
  jwt.verify(token.slice(0, -2) + "xx", SECRET);
} catch (err) {
  console.log("rejected:", err.message);
}

// res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "lax", maxAge: 15 * 60 * 1000 });`,
      output: "true 60\ntrue\nfalse\nuser_42 member\nmember\nrejected: invalid signature" },
    demo: [
      { lines: [4], say: "The signing secret comes from the environment, never from git." },
      { lines: [6, 7], say: "Hash with cost 12. The result includes its own salt.", out: "true 60" },
      { lines: [9, 10], say: "Login: compare the attempt to the stored hash.", out: "true\nfalse" },
      { lines: [12, 13, 14], say: "Sign a short-lived token with the user id, then verify it on later requests.", out: "user_42 member" },
      { lines: [16, 17], say: "Anyone can decode the payload. Signed is not secret!", out: "member" },
      { lines: [19, 20, 21, 22, 23], say: "Tampering breaks the signature.", out: "rejected: invalid signature" },
      { lines: [25], say: "Deliver it in a cookie that page JavaScript can't read." },
    ],
    practice: { task: "Write `requireAuth` Express middleware that reads the token cookie, verifies it, puts the payload on `req.user`, and answers 401 otherwise.",
      hint: "Use cookie-parser for req.cookies, and jwt.verify in try/catch.",
      solution: { lang: "js", run: "check", code:
`import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ error: "Sign in required" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Session expired. Please sign in again." });
  }
}` } },
    check: [
      { q: "How should passwords be stored?", options: ["Encrypted", "As a slow salted hash (bcrypt/argon2)", "Plain text in a private table", "Base64"], answer: 1, why: "Hashes can't be reversed; slowness defeats guessing." },
      { q: "Can a user read the contents of their JWT?", options: ["No, it's encrypted", "Yes, it's only signed", "Only with the secret", "Only the server can"], answer: 1, why: "Signing prevents changes, not reading." },
    ],
  },
  {
    id: "a-ex-security", title: "Security headers, rate limiting and input limits", minutes: 25,
    goal: "Harden an Express API against the most common attacks.",
    body: [
      "**helmet** sets a batch of security headers in one line: no sniffing content types, no framing your site (clickjacking), strict HTTPS, and more.",
      "**Rate limiting** (`express-rate-limit`) caps requests per IP, which slows down password guessing and scraping. Use a strict limit on `/login`.",
      "**Limit body size**: `express.json({ limit: \"10kb\" })` stops someone sending a 1GB request.",
      "Other essentials: parameterized SQL (no injection), validate every input, never leak stack traces, keep dependencies updated (`npm audit`), and serve over HTTPS.",
    ],
    example: { lang: "js", run: "server", code:
`import express from "express";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";

const app = express();
app.disable("x-powered-by");
app.use(helmet());
app.use(express.json({ limit: "10kb" }));

app.use("/api", rateLimit({ windowMs: 60_000, limit: 100, standardHeaders: "draft-8", legacyHeaders: false }));
const loginLimiter = rateLimit({ windowMs: 15 * 60_000, limit: 5, message: { error: "Too many attempts. Try again later." } });

app.post("/api/login", loginLimiter, (req, res) => {
  res.status(401).json({ error: "Email or password is incorrect" });
});

app.get("/api/status", (req, res) => res.json({ ok: true }));

app.listen(3000);` },
    demo: [
      { lines: [6], say: "Don't advertise that you're running Express." },
      { lines: [7], say: "helmet adds headers like X-Content-Type-Options, X-Frame-Options and Strict-Transport-Security." },
      { lines: [8], say: "Bodies over 10kb are rejected with 413." },
      { lines: [10], say: "At most 100 API requests per minute per IP, with RateLimit headers telling clients where they stand." },
      { lines: [11, 13], say: "Login gets a much stricter limit: 5 tries per 15 minutes." },
      { lines: [14], say: "The same message whether the email or the password was wrong, so attackers can't discover which emails exist." },
      { lines: [17], say: "A normal route still works, now with helmet's headers on every response.", out: "200 {\"ok\":true} with helmet's security headers" },
    ],
    practice: { task: "Run `npm audit` on one of your projects. What do the severity levels mean, and what does `npm audit fix` do?",
      hint: "Look at the advisory links in the output.",
      solution: { lang: "text", code: "Levels: low, moderate, high, critical (how bad the vulnerability is if it's reachable).\nnpm audit fix upgrades to patched versions within your allowed ranges.\nnpm audit fix --force may install breaking major versions, so run your tests afterwards.\nCheck whether the vulnerable code is actually used: many dev-only advisories don't affect production." } },
    check: [
      { q: "Why give /login its own stricter rate limit?", options: ["Speed", "To slow down password guessing", "Required by Express", "SEO"], answer: 1, why: "Brute-force attacks target login." },
      { q: "Why the same error for 'wrong email' and 'wrong password'?", options: ["Simpler code", "So attackers can't learn which emails have accounts", "Required by HTTP", "Shorter responses"], answer: 1, why: "Different messages leak account existence." },
    ],
  },
  {
    id: "a-ex-production", title: "Production readiness: logs, health checks and shutdown", minutes: 25,
    goal: "Run a Node API the way production platforms expect.",
    body: [
      "Log **structured JSON** (one object per line, with a level, message and request id) so you can search logs. morgan's `combined` format or a logger like pino works well.",
      "Add a `GET /healthz` route that returns 200 when the app is ready. Hosting platforms and load balancers poll it.",
      "**Graceful shutdown:** on `SIGTERM` (sent when a platform redeploys), stop accepting new connections, finish the requests in flight, close the database pool, then exit.",
      "Read **all** config from environment variables, crash early with a clear message if one is missing, and run with `NODE_ENV=production`.",
    ],
    example: { lang: "js", run: "server", code:
`import express from "express";
import { randomUUID } from "node:crypto";

const app = express();

app.use((req, res, next) => {
  const id = randomUUID();
  const start = Date.now();
  res.setHeader("X-Request-Id", id);
  res.on("finish", () => {
    console.log(JSON.stringify({ level: "info", id, method: req.method, path: req.path, status: res.statusCode, ms: Date.now() - start }));
  });
  next();
});

app.get("/healthz", (req, res) => res.json({ status: "ok", uptime: Math.round(process.uptime()) }));
app.get("/api/status", (req, res) => res.json({ ok: true }));

const server = app.listen(process.env.PORT || 3000);

function shutdown(signal) {
  console.log(JSON.stringify({ level: "info", msg: "shutting down", signal }));
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10_000).unref();
}
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);` },
    demo: [
      { lines: [6, 7, 8, 9], say: "Every request gets an id, which is also sent back in a header for support tickets." },
      { lines: [10, 11, 12], say: "When the response finishes, log one JSON line.", out: "{\"level\":\"info\",\"method\":\"GET\",\"path\":\"/healthz\",\"status\":200,…}" },
      { lines: [16], say: "A health check for the platform to poll." },
      { lines: [21, 22, 23, 24, 25], say: "On SIGTERM: stop taking new requests, let current ones finish, then exit." },
      { lines: [24], say: "Don't hang forever: force-exit after 10 seconds. unref() keeps this timer from holding the process open." },
    ],
    practice: { task: "Write a `requireEnv(name)` helper that returns process.env[name] or throws a clear error at startup.",
      hint: "Call it at the top of server.js for every required variable.",
      solution: { lang: "js", run: "node", code:
`function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error("Missing environment variable: " + name);
  return value;
}
try { requireEnv("DATABASE_URL_THAT_DOES_NOT_EXIST"); } catch (e) { console.log(e.message); }`, output: "Missing environment variable: DATABASE_URL_THAT_DOES_NOT_EXIST" } },
    check: [
      { q: "What's SIGTERM?", options: ["A crash", "The polite 'please shut down' signal platforms send before stopping your app", "A database error", "A syntax error"], answer: 1, why: "Handle it to finish in-flight requests." },
      { q: "Why structured JSON logs?", options: ["Smaller files", "They can be searched and filtered by field", "Required by Node", "Faster"], answer: 1, why: "Log tools index the fields." },
    ],
  },
];

export const firebase = [
  {
    id: "a-fb-model", title: "Data modeling in Firestore", minutes: 30,
    goal: "Shape Firestore data around your queries, not around tables.",
    diagram: "firestore",
    body: [
      "Firestore has **no joins**. Design documents around the screens that read them: ask \"what does this page need in one query?\"",
      "**Denormalize** small, rarely-changing data: store the author's name on each post, so a feed doesn't need a second read per post.",
      "**Subcollections** (`posts/{postId}/comments`) are good for unbounded lists that belong to one parent. A document has a 1MB limit, so never put a growing list in an array field.",
      "Use **counters** (updated with `increment()` or a Cloud Function) instead of counting thousands of documents, and **batched writes** to update several documents atomically.",
    ],
    example: { lang: "js", run: "check", code:
`import { doc, collection, writeBatch, increment, serverTimestamp, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db, auth } from "./firebase.js";

// posts/{postId}               { title, authorId, authorName, commentCount, createdAt }
// posts/{postId}/comments/{id} { text, authorId, authorName, createdAt }

export async function addComment(postId, text) {
  const user = auth.currentUser;
  const batch = writeBatch(db);
  const commentRef = doc(collection(db, "posts", postId, "comments"));

  batch.set(commentRef, {
    text,
    authorId: user.uid,
    authorName: user.displayName,
    createdAt: serverTimestamp(),
  });
  batch.update(doc(db, "posts", postId), { commentCount: increment(1) });

  await batch.commit();
}

export async function latestComments(postId) {
  const q = query(collection(db, "posts", postId, "comments"), orderBy("createdAt", "desc"), limit(20));
  return (await getDocs(q)).docs.map((d) => ({ id: d.id, ...d.data() }));
}` },
    demo: [
      { lines: [4, 5], say: "The plan: authorName is copied onto posts and comments so feeds need one read. commentCount avoids counting." },
      { lines: [9, 10], say: "A batch, and a new comment document in the post's subcollection." },
      { lines: [12, 13, 14, 15, 16, 17], say: "Denormalized: the author's name is stored with the comment." },
      { lines: [18], say: "increment() updates the counter safely, even with many users at once." },
      { lines: [20], say: "Both writes succeed or neither does." },
      { lines: [23, 24, 25, 26], say: "Read the 20 newest comments for one post." },
    ],
    practice: { task: "A user changes their display name. What has to happen with the denormalized authorName copies, and where should that code run?",
      hint: "Many documents, triggered by one change.",
      solution: { lang: "text", code: "Every post and comment with that authorId needs its authorName updated.\nRun it in a Cloud Function triggered when users/{uid} changes, using batched writes (max 500 per batch).\nOr decide that old posts keep the old name, which is often fine and much cheaper.\nThis trade-off is the cost of denormalizing." } },
    check: [
      { q: "Where should an unbounded list of comments go?", options: ["An array field on the post", "A subcollection", "A single big document", "localStorage"], answer: 1, why: "Documents max out at 1MB; subcollections don't." },
      { q: "Why store authorName on each post?", options: ["Required", "So a feed can render without an extra read per post", "Security", "Smaller documents"], answer: 1, why: "Firestore has no joins; denormalize for reads." },
    ],
  },
  {
    id: "a-fb-functions", title: "Cloud Functions", minutes: 30,
    goal: "Run trusted server code on Firebase: triggers, callable functions and scheduled jobs.",
    body: [
      "**Cloud Functions** run your Node code on Google's servers. Use them for anything the client must not be trusted with: payments, sending email, keeping counters, admin actions.",
      "**Triggers** run when data changes: `onDocumentCreated(\"posts/{id}/comments/{cid}\", ...)`.",
      "**Callable functions** (`onCall`) are called from your app like an API, and arrive with the user's auth already verified.",
      "Functions use the **Admin SDK**, which ignores Security Rules, so check permissions yourself. Store secrets with `defineSecret`, never in code. Functions require the pay-as-you-go plan (with a generous free tier).",
    ],
    example: { lang: "js", run: "check", file: "functions/index.js", code:
`import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { onSchedule } from "firebase-functions/v2/scheduler";
import { initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

initializeApp();
const db = getFirestore();

export const onComment = onDocumentCreated("posts/{postId}/comments/{commentId}", async (event) => {
  await db.doc("posts/" + event.params.postId).update({ commentCount: FieldValue.increment(1) });
});

export const deletePost = onCall(async (request) => {
  if (!request.auth) throw new HttpsError("unauthenticated", "Sign in first");
  const post = await db.doc("posts/" + request.data.postId).get();
  if (post.get("authorId") !== request.auth.uid) throw new HttpsError("permission-denied", "Not your post");
  await post.ref.delete();
  return { deleted: true };
});

export const nightlyCleanup = onSchedule("every day 03:00", async () => {
  const old = await db.collection("drafts").where("updatedAt", "<", new Date(Date.now() - 30 * 864e5)).limit(500).get();
  const batch = db.batch();
  old.forEach((d) => batch.delete(d.ref));
  await batch.commit();
});` },
    demo: [
      { lines: [7, 8], say: "The Admin SDK: full access, ignoring Security Rules." },
      { lines: [10, 11, 12], say: "A trigger keeps the counter correct, so clients can't fake it." },
      { lines: [14, 15], say: "Callable: auth arrives verified. Reject anonymous calls." },
      { lines: [16, 17], say: "Admin access means YOU must check ownership." },
      { lines: [22, 23, 24, 25, 26, 27], say: "A scheduled job: delete drafts untouched for 30 days, 500 at a time." },
    ],
    practice: { task: "Call deletePost from a React button.",
      hint: "httpsCallable(getFunctions(), \"deletePost\")",
      solution: { lang: "js", run: "check", code:
`import { getFunctions, httpsCallable } from "firebase/functions";

const deletePost = httpsCallable(getFunctions(), "deletePost");

export async function onDelete(postId) {
  try {
    await deletePost({ postId });
  } catch (err) {
    alert(err.code === "functions/permission-denied" ? "You can only delete your own posts" : "Delete failed");
  }
}` } },
    check: [
      { q: "Do Security Rules apply to the Admin SDK?", options: ["Yes", "No, so check permissions in your function"], answer: 1, why: "Admin access bypasses rules." },
      { q: "Good job for a Cloud Function?", options: ["Changing button colors", "Charging a card or sending email", "Reading a public list", "Form layout"], answer: 1, why: "Trusted work that needs secrets." },
    ],
  },
  {
    id: "a-fb-emulators", title: "The Emulator Suite and testing Security Rules", minutes: 30,
    goal: "Develop against local Firebase emulators and prove your rules with tests.",
    body: [
      "The **Emulator Suite** runs Auth, Firestore, Functions and Storage on your machine: `firebase emulators:start`. There's no risk to real data and no cost, and you can reset everything.",
      "Point your app at them in development with `connectFirestoreEmulator(db, \"127.0.0.1\", 8080)` and `connectAuthEmulator`.",
      "**Test your Security Rules** with `@firebase/rules-unit-testing`: create fake signed-in users and assert what each can and can't do. Rules are security code, so they deserve tests.",
      "Run these tests in CI so a rule change can never silently open up your data.",
    ],
    example: { lang: "js", run: "check", file: "rules.test.js", code:
`import { readFileSync } from "node:fs";
import { initializeTestEnvironment, assertFails, assertSucceeds } from "@firebase/rules-unit-testing";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { afterAll, beforeAll, beforeEach, it } from "vitest";

let env;
beforeAll(async () => {
  env = await initializeTestEnvironment({
    projectId: "demo-notes",
    firestore: { rules: readFileSync("firestore.rules", "utf8"), host: "127.0.0.1", port: 8080 },
  });
});
beforeEach(() => env.clearFirestore());
afterAll(() => env.cleanup());

it("lets a user create their own note", async () => {
  const ana = env.authenticatedContext("ana").firestore();
  await assertSucceeds(setDoc(doc(ana, "notes/n1"), { owner: "ana", text: "hi" }));
});

it("blocks creating a note for someone else", async () => {
  const ana = env.authenticatedContext("ana").firestore();
  await assertFails(setDoc(doc(ana, "notes/n2"), { owner: "bo", text: "sneaky" }));
});

it("blocks reading another user's note", async () => {
  await env.withSecurityRulesDisabled((ctx) => setDoc(doc(ctx.firestore(), "notes/n3"), { owner: "bo", text: "private" }));
  const ana = env.authenticatedContext("ana").firestore();
  await assertFails(getDoc(doc(ana, "notes/n3")));
});` },
    demo: [
      { lines: [8, 9, 10, 11], say: "Load your real rules file into the local emulator. \"demo-\" projects never touch the cloud." },
      { lines: [13], say: "Every test starts with an empty database." },
      { lines: [16, 17, 18, 19], say: "A fake signed-in user, Ana, may create her own note." },
      { lines: [21, 22, 23, 24], say: "She may NOT create a note owned by Bo." },
      { lines: [26, 27, 28, 29, 30], say: "Seed Bo's note with rules off, then prove Ana can't read it." },
    ],
    practice: { task: "Add a test proving a signed-OUT visitor can't read any note.",
      hint: "env.unauthenticatedContext()",
      solution: { lang: "js", run: "check", code:
`it("blocks signed-out visitors", async () => {
  const guest = env.unauthenticatedContext().firestore();
  await assertFails(getDoc(doc(guest, "notes/n1")));
});` } },
    check: [
      { q: "Why use the emulators in development?", options: ["They're faster than production", "No risk to real data, no cost, easy reset", "Required by Firebase", "Better SEO"], answer: 1, why: "Safe, free and repeatable." },
      { q: "Rules tests should cover…", options: ["Only the happy path", "What each kind of user can AND can't do", "Only admins", "Only reads"], answer: 1, why: "Security is about what's denied." },
    ],
  },
];

export const testing = [
  {
    id: "a-test-api", title: "Integration tests for APIs with supertest", minutes: 30,
    goal: "Test real HTTP routes, status codes and validation without starting a server.",
    body: [
      "**Integration tests** exercise several parts together, here the routing, middleware, validation and handler, through real HTTP requests.",
      "**supertest** sends requests straight to your Express `app` object; no port needed. Export `app` separately from the file that calls `listen`.",
      "Assert on **status codes, response bodies and headers**: the contract your frontend depends on.",
      "Use a separate test database (or an in-memory store) and reset it before each test, so tests don't depend on each other.",
    ],
    example: { lang: "js", run: "vitest", file: "notes.api.test.js", code:
`import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import express from "express";

function createApp() {
  const notes = [];
  const app = express();
  app.use(express.json());
  app.get("/api/notes", (req, res) => res.json(notes));
  app.post("/api/notes", (req, res) => {
    if (!req.body?.title) return res.status(400).json({ error: "title is required" });
    const note = { id: notes.length + 1, title: req.body.title };
    notes.push(note);
    res.status(201).json(note);
  });
  return app;
}

describe("notes API", () => {
  let app;
  beforeEach(() => { app = createApp(); });

  it("creates a note", async () => {
    const res = await request(app).post("/api/notes").send({ title: "Proof dough" });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ id: 1, title: "Proof dough" });
  });

  it("rejects a missing title", async () => {
    const res = await request(app).post("/api/notes").send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/title/);
  });

  it("starts empty for every test", async () => {
    const res = await request(app).get("/api/notes").expect("Content-Type", /json/);
    expect(res.body).toEqual([]);
  });
});` },
    demo: [
      { lines: [5, 6, 7], say: "A factory gives every test a fresh app with empty data. In real code, import it from app.js." },
      { lines: [21], say: "beforeEach resets state, so the order of tests doesn't matter." },
      { lines: [23, 24, 25, 26, 27], say: "A real POST through Express. Check the status and the exact body." },
      { lines: [29, 30, 31, 32, 33], say: "The unhappy path: validation must answer 400." },
      { lines: [35, 36, 37, 38], say: "supertest can assert headers too.", out: "✓ notes API (3 tests) passed" },
    ],
    practice: { task: "Add a test that a body over 10kb gets a 413 when the app uses `express.json({ limit: \"10kb\" })`.",
      hint: "Send `{ title: \"x\".repeat(20000) }`.",
      solution: { lang: "js", run: "vitest", code:
`import { it, expect } from "vitest";
import request from "supertest";
import express from "express";

it("rejects huge bodies", async () => {
  const app = express();
  app.use(express.json({ limit: "10kb" }));
  app.post("/api/notes", (req, res) => res.status(201).end());
  const res = await request(app).post("/api/notes").send({ title: "x".repeat(20000) });
  expect(res.status).toBe(413);
});` } },
    check: [
      { q: "Why export app separately from app.listen()?", options: ["Style", "So tests can import the app without starting a server", "Required by Express", "Performance"], answer: 1, why: "supertest drives the app object directly." },
      { q: "Integration tests check…", options: ["One function alone", "Several parts working together through a real interface", "Only CSS", "Only the database"], answer: 1, why: "Here: routing + middleware + handler over HTTP." },
    ],
  },
  {
    id: "a-test-e2e", title: "End-to-end tests with Playwright", minutes: 30,
    goal: "Test whole user journeys in a real browser.",
    body: [
      "**End-to-end (E2E)** tests drive a real browser through your running app: open the page, click, type, check what's shown. They catch problems unit tests can't, like broken routing, missing env vars and CSS hiding a button.",
      "**Playwright** runs Chromium, Firefox and WebKit, waits for elements automatically, and records traces and videos when tests fail. Set up with `npm init playwright@latest`.",
      "Use the same user-facing locators as Testing Library: `getByRole`, `getByLabel`, `getByText`.",
      "E2E tests are slower and more fragile, so keep them for **critical journeys** (sign up, checkout, the main feature) and use unit tests for the details. That's the **testing pyramid**.",
    ],
    example: { lang: "js", run: "check", file: "e2e/lesson.spec.js", code:
`import { test, expect } from "@playwright/test";

test.describe("lesson journey", () => {
  test("a learner completes a lesson and sees progress", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /Start:/ }).click();

    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Page structure and semantic tags");

    await page.getByRole("button", { name: "Next step" }).click();
    await expect(page.getByText("step 1/6")).toBeVisible();

    await page.getByRole("button", { name: "Mark complete" }).click();
    await expect(page.getByText("Lesson complete.")).toBeVisible();

    await page.goto("/");
    await expect(page.getByRole("link", { name: /Continue:/ })).toBeVisible();
  });

  test("works on a phone", async ({ browser }) => {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.goto("/learn/css/css-box");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
});` },
    demo: [
      { lines: [5, 6], say: "Start where a real learner starts, and click the Start button." },
      { lines: [8], say: "Assertions wait automatically until they pass (or time out)." },
      { lines: [10, 11], say: "Use the walkthrough like a user would." },
      { lines: [13, 14], say: "Complete the lesson and check the confirmation." },
      { lines: [16, 17], say: "Progress survives navigation: the home page now says Continue." },
      { lines: [20, 21, 22, 23, 24, 25], say: "A phone-sized check that nothing scrolls sideways." },
    ],
    practice: { task: "Which of these deserve an E2E test? (a) a formatPrice function, (b) the checkout flow, (c) a button's hover color, (d) sign-up then sign-in.",
      hint: "Critical journeys only.",
      solution: { lang: "text", code: "(a) No: a unit test is faster and more precise.\n(b) Yes: it's where money is made.\n(c) No: visual detail; a screenshot test at most.\n(d) Yes: if sign-in breaks, nothing else matters." } },
    check: [
      { q: "The testing pyramid says to have…", options: ["Mostly E2E tests", "Many unit tests, fewer integration tests, few E2E tests", "Only manual testing", "Equal numbers of each"], answer: 1, why: "Fast, precise tests at the base; slow, broad ones at the top." },
      { q: "Why does Playwright rarely need manual waits?", options: ["It's fast", "Actions and assertions auto-wait for elements", "It skips animations", "It caches pages"], answer: 1, why: "Auto-waiting removes most flakiness." },
    ],
  },
  {
    id: "a-test-tdd-ci", title: "TDD, and running tests in CI", minutes: 30,
    goal: "Write tests first when it helps, and make every push run the tests automatically.",
    body: [
      "**Test-driven development (TDD):** **Red** (write a failing test for the next small behavior), **Green** (write the simplest code that passes), **Refactor** (clean up with the test as a safety net). Repeat.",
      "TDD shines for logic with clear rules: validation, pricing, parsers. It's less useful for exploratory UI work.",
      "**Mock at the boundaries** (network, time, randomness), not your own internal functions. Over-mocking makes tests pass while the real code is broken.",
      "**Continuous integration (CI):** GitHub Actions runs your tests on every push and pull request. A red check means don't merge.",
    ],
    example: { lang: "js", run: "vitest", file: "slug.test.js", code:
`import { describe, it, expect } from "vitest";

// Built test-first: each test below was written, seen failing, then made to pass.
function slugify(title) {
  return title
    .normalize("NFKD")
    .replace(/[\\u0300-\\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

describe("slugify", () => {
  it("lowercases and joins words with hyphens", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });
  it("drops punctuation", () => {
    expect(slugify("React: The Good Parts!")).toBe("react-the-good-parts");
  });
  it("removes accents", () => {
    expect(slugify("Café Crème")).toBe("cafe-creme");
  });
  it("trims leading and trailing separators", () => {
    expect(slugify("  --Next.js 16--  ")).toBe("next-js-16");
  });
});` },
    demo: [
      { lines: [14, 15, 16], say: "Red → green 1: the simplest case. The first version was just lowercase plus replacing spaces." },
      { lines: [17, 18, 19], say: "Red → green 2: punctuation forced the [^a-z0-9]+ rule." },
      { lines: [20, 21, 22], say: "Red → green 3: accents. normalize() splits é into e plus an accent mark, which we then remove." },
      { lines: [23, 24, 25], say: "Red → green 4: trimming. Then refactor, with all four tests protecting you.", out: "✓ slugify (4 tests) passed" },
    ],
    practice: { task: "Write a GitHub Actions workflow that runs `npm ci` and `npm test -- --run` on every push and pull request.",
      hint: "Save it as .github/workflows/test.yml.",
      solution: { lang: "text", code: "name: Tests\non: [push, pull_request]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: 22\n          cache: npm\n      - run: npm ci\n      - run: npm test -- --run" } },
    check: [
      { q: "The TDD cycle is…", options: ["Code, test, ship", "Red, green, refactor", "Plan, build, deploy", "Mock, stub, spy"], answer: 1, why: "Failing test, passing code, then clean up." },
      { q: "What should you usually mock?", options: ["Your own helper functions", "Boundaries: network, time, randomness", "Everything", "Nothing"], answer: 1, why: "Over-mocking hides real bugs." },
    ],
  },
];

export const interview = [
  {
    id: "a-int-bigo", title: "Big-O: how code scales", minutes: 30,
    goal: "Estimate how running time grows with input size, and explain it in an interview.",
    body: [
      "**Big-O** describes how work grows as input grows, ignoring constants. O(1) constant, O(log n) halving (binary search), O(n) one pass, O(n log n) good sorting, O(n²) nested loops over the same data.",
      "Count the **loops over the input**: one loop is O(n), a loop inside a loop over the same array is O(n²). Array methods are loops too: `includes`, `indexOf` and `find` are O(n), so calling them inside a loop is O(n²).",
      "**Space complexity** counts extra memory: a Map of n items is O(n) space.",
      "In interviews, state it plainly: \"This is O(n) time and O(n) space because of the Map. The brute force was O(n²).\"",
    ],
    example: { lang: "js", run: "node", code:
`function hasDuplicateSlow(nums) {
  for (let i = 0; i < nums.length; i++)
    for (let j = i + 1; j < nums.length; j++)
      if (nums[i] === nums[j]) return true;
  return false;
}

function hasDuplicateFast(nums) {
  const seen = new Set();
  for (const n of nums) {
    if (seen.has(n)) return true;
    seen.add(n);
  }
  return false;
}

function countSteps(n) {
  let slow = 0, fast = 0;
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) slow++;
  for (let i = 0; i < n; i++) fast++;
  return { n, slow, fast };
}

console.log(countSteps(10));
console.log(countSteps(1000));
const big = Array.from({ length: 5000 }, (_, i) => i);
console.log(hasDuplicateSlow(big), hasDuplicateFast(big));`,
      output: "{ n: 10, slow: 45, fast: 10 }\n{ n: 1000, slow: 499500, fast: 1000 }\nfalse false" },
    demo: [
      { lines: [1, 2, 3, 4, 5, 6], say: "Compare every pair: a loop inside a loop is O(n²)." },
      { lines: [8, 9, 10, 11, 12, 13, 14, 15], say: "One pass with a Set: O(n) time, O(n) extra space." },
      { lines: [24], say: "For 10 items the difference is small.", out: "{ n: 10, slow: 45, fast: 10 }" },
      { lines: [25], say: "100× more input means about 10,000× more work for O(n²), but only 100× for O(n).", out: "{ n: 1000, slow: 499500, fast: 1000 }" },
      { lines: [26, 27], say: "Same answers; only the scaling differs.", out: "false false" },
    ],
    practice: { task: "What's the Big-O? `for (const a of list) { if (other.includes(a)) count++ }` where both arrays have n items. How do you make it O(n)?",
      hint: "includes is a hidden loop.",
      solution: { lang: "js", run: "node", code:
`// O(n²): includes scans 'other' for every item in 'list'.
// O(n): build a Set once, then each lookup is O(1).
function countShared(list, other) {
  const set = new Set(other);
  let count = 0;
  for (const a of list) if (set.has(a)) count++;
  return count;
}
console.log(countShared([1, 2, 3, 4], [3, 4, 5]));`, output: "2" } },
    check: [
      { q: "Binary search is…", options: ["O(n)", "O(log n)", "O(n²)", "O(1)"], answer: 1, why: "It halves the search space each step." },
      { q: "arr.indexOf(x) inside a loop over arr is…", options: ["O(n)", "O(n²)", "O(log n)", "O(1)"], answer: 1, why: "indexOf is itself a loop." },
    ],
  },
  {
    id: "a-int-graphs", title: "Trees and graphs: BFS and DFS", minutes: 35,
    goal: "Traverse trees and graphs, and know which search finds the shortest path.",
    body: [
      "A **graph** is nodes plus connections (edges). A **tree** is a graph with no cycles and one root, like the DOM, a folder structure or comment threads.",
      "**DFS (depth-first)** goes as deep as possible before backing up. Use recursion or a stack. Good for exploring everything, like counting files or finding connected regions.",
      "**BFS (breadth-first)** explores level by level with a **queue**. In an unweighted graph, **BFS finds the shortest path**.",
      "Always track **visited** nodes in graphs, or cycles will loop forever.",
    ],
    example: { lang: "js", run: "node", code:
`const routes = {
  home: ["about", "shop"],
  about: ["team"],
  shop: ["cart", "product"],
  product: ["cart"],
  cart: ["checkout"],
  team: [],
  checkout: ["home"],
};

function shortestPath(graph, start, goal) {
  const queue = [[start]];
  const visited = new Set([start]);
  while (queue.length) {
    const path = queue.shift();
    const node = path.at(-1);
    if (node === goal) return path;
    for (const next of graph[node]) {
      if (!visited.has(next)) {
        visited.add(next);
        queue.push([...path, next]);
      }
    }
  }
  return null;
}

function countReachable(graph, node, seen = new Set()) {
  if (seen.has(node)) return 0;
  seen.add(node);
  return 1 + graph[node].reduce((sum, next) => sum + countReachable(graph, next, seen), 0);
}

console.log(shortestPath(routes, "home", "checkout").join(" → "));
console.log(shortestPath(routes, "team", "home"));
console.log(countReachable(routes, "home"));`,
      output: "home → shop → cart → checkout\nnull\n7" },
    demo: [
      { lines: [1, 2, 3, 4, 5, 6, 7, 8, 9], say: "Pages and their links, as an adjacency list. checkout links back to home, so there's a cycle." },
      { lines: [12, 13], say: "BFS: a queue of paths, and a visited set so the cycle can't loop forever." },
      { lines: [15, 16, 17], say: "Take the oldest path first. That's what makes it level by level." },
      { lines: [18, 19, 20, 21, 22, 23], say: "Queue each unvisited neighbor as a longer path." },
      { lines: [28, 29, 30, 31, 32], say: "DFS by recursion: count every page reachable from here." },
      { lines: [34], say: "BFS found the shortest route, skipping the longer one through product.", out: "home → shop → cart → checkout" },
      { lines: [35], say: "There's no path from team.", out: "null" },
      { lines: [36], say: "All 7 pages are reachable from home.", out: "7" },
    ],
    practice: { task: "Write `maxDepth(node)` for a tree where each node is `{ value, children: [] }`.",
      hint: "Base case: no children means depth 1.",
      solution: { lang: "js", run: "node", code:
`function maxDepth(node) {
  if (!node.children.length) return 1;
  return 1 + Math.max(...node.children.map(maxDepth));
}
const tree = { value: "html", children: [{ value: "body", children: [{ value: "main", children: [] }] }, { value: "head", children: [] }] };
console.log(maxDepth(tree));`, output: "3" } },
    check: [
      { q: "Shortest path in an unweighted graph?", options: ["DFS", "BFS", "Binary search", "Sorting"], answer: 1, why: "BFS reaches nodes in order of distance." },
      { q: "Why track visited nodes?", options: ["Speed only", "Graphs can have cycles that loop forever", "Required syntax", "To sort them"], answer: 1, why: "Without it, a cycle never ends." },
    ],
  },
  {
    id: "a-int-design", title: "Frontend system design and the offer stage", minutes: 30,
    goal: "Structure a frontend design interview, and handle behavioral and salary questions.",
    body: [
      "**Frontend system design** questions: \"Design a news feed\", \"Design an autocomplete\", \"Design a photo gallery\". You have about 45 minutes and no single right answer.",
      "Use a framework: **Requirements** (features, users, devices; ask questions) → **Architecture** (components, data flow, server vs client) → **Data model and API** (endpoints, pagination, caching) → **Deep dive** (performance, accessibility, loading/error states, offline) → **Trade-offs**.",
      "**Behavioral** questions (\"Tell me about a conflict\", \"a time you failed\") use STAR. Prepare 5–6 stories you can adapt. A career change is a strength: you've learned new domains before and you bring real-world experience.",
      "**Salary:** research the range first (levels.fyi, Glassdoor, local job posts). When asked early, give a researched range or ask for theirs. Negotiate the whole offer: base, sign-on, PTO, remote days, learning budget. Get it in writing.",
    ],
    example: { lang: "text", code:
`DESIGN AN AUTOCOMPLETE (search box with suggestions)

1 Requirements
  - Suggestions after 2+ characters, max 8, keyboard selectable
  - Fast on slow phones; accessible to screen readers

2 Architecture
  <SearchBox> → useDebouncedValue(query, 250) → useSuggestions(q)
  <SuggestionList> as role="listbox", options as role="option"

3 Data / API
  GET /api/suggest?q=rea → [{ id, label }]
  Cache by query (in memory, LRU of 50); cancel stale requests (AbortController)

4 Deep dive
  - Keyboard: ↑ ↓ to move, Enter to pick, Esc to close (aria-activedescendant)
  - Announce "8 suggestions" in a live region
  - Highlight the matched part; handle empty, error and slow states

5 Trade-offs
  - Debounce delay vs. responsiveness
  - Client-side filtering of a small static list vs. server search for large data` },
    demo: [
      { lines: [3, 4, 5], say: "Start with requirements, out loud. Ask; don't assume." },
      { lines: [7, 8, 9], say: "Name the components and how data flows between them." },
      { lines: [11, 12, 13], say: "The API shape, caching and cancelling. This is where seniority shows." },
      { lines: [15, 16, 17, 18], say: "Accessibility and edge states are what most candidates forget." },
      { lines: [20, 21, 22], say: "End with trade-offs: there's no perfect design, only choices." },
    ],
    practice: { task: "Outline \"Design an infinite-scroll photo feed\" using the five steps. Spend 10 minutes, then compare with the checklist in the solution.",
      hint: "Think about pagination, image loading, memory and accessibility.",
      solution: { lang: "text", code: "Checklist:\n- Cursor-based pagination (not page numbers) so new posts don't cause duplicates\n- IntersectionObserver on a sentinel to load the next page\n- Responsive images (srcset), lazy-loading, reserved aspect-ratio boxes (no layout shift)\n- Virtualize the list after a few hundred items to save memory\n- Loading skeletons, error + retry, and an end-of-feed message\n- A \"Load more\" button as an accessible alternative to endless scroll\n- Keep the scroll position when returning from a photo's detail page" } },
    check: [
      { q: "What should come first in a system design interview?", options: ["Drawing components", "Clarifying requirements", "Choosing a framework", "Writing code"], answer: 1, why: "Design for the right problem." },
      { q: "Asked for salary expectations early, a good answer is…", options: ["Whatever you offer", "A researched range, or asking for their range", "Your current pay", "Refusing to answer"], answer: 1, why: "Anchor on research, not on your past." },
    ],
  },
];

// Advanced coding problems
export const problems = [
  { id: "merge-intervals", title: "Merge overlapping intervals", level: "Medium", topic: "Sorting", tier: "advanced",
    prompt: "Given [start, end] pairs, merge every overlapping pair and return the result sorted by start. Touching intervals like [1,3] and [3,5] count as overlapping.",
    approach: "Sort by start. Walk through, extending the last merged interval when the next one starts before (or at) its end; otherwise push a new one. O(n log n) for the sort.",
    solution: `function merge(intervals) {\n  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);\n  const out = [];\n  for (const [start, end] of sorted) {\n    const last = out.at(-1);\n    if (last && start <= last[1]) last[1] = Math.max(last[1], end);\n    else out.push([start, end]);\n  }\n  return out;\n}`,
    fn: "merge", tests: [[[[[1, 3], [8, 10], [2, 6], [15, 18]]], [[1, 6], [8, 10], [15, 18]]], [[[[1, 4], [4, 5]]], [[1, 5]]], [[[]], []], [[[[5, 7], [1, 10]]], [[1, 10]]]],
    followUp: "Where would this appear in a real app? (Calendar availability, booking systems.)" },
  { id: "top-k", title: "Top k frequent words", level: "Medium", topic: "Hash maps + sorting", tier: "advanced",
    prompt: "Return the k most frequent words, most frequent first. Break ties alphabetically.",
    approach: "Count with a Map, then sort the entries by count descending, then by word ascending, and take k.",
    solution: `function topK(words, k) {\n  const counts = new Map();\n  for (const w of words) counts.set(w, (counts.get(w) || 0) + 1);\n  return [...counts.entries()]\n    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))\n    .slice(0, k)\n    .map(([w]) => w);\n}`,
    fn: "topK", tests: [[[["i", "love", "code", "i", "love", "js"], 2], ["i", "love"]], [[["b", "a", "c"], 2], ["a", "b"]], [[[], 3], []]],
    followUp: "With millions of words and small k, how could a heap beat sorting everything?" },
  { id: "grid-path", title: "Shortest path in a grid", level: "Hard", topic: "BFS", tier: "advanced",
    prompt: "In a grid of 0s (open) and 1s (walls), return the fewest steps from the top-left to the bottom-right moving up, down, left or right, or -1 if impossible.",
    approach: "BFS from [0,0] with a queue of [row, col, steps] and a visited set. The first time you reach the goal is the shortest path.",
    solution: `function shortestGridPath(grid) {\n  const rows = grid.length, cols = grid[0]?.length ?? 0;\n  if (!rows || grid[0][0] === 1 || grid[rows - 1][cols - 1] === 1) return -1;\n  const queue = [[0, 0, 0]];\n  const seen = new Set(["0,0"]);\n  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];\n  for (let i = 0; i < queue.length; i++) {\n    const [r, c, d] = queue[i];\n    if (r === rows - 1 && c === cols - 1) return d;\n    for (const [dr, dc] of dirs) {\n      const nr = r + dr, nc = c + dc, key = nr + "," + nc;\n      if (nr >= 0 && nc >= 0 && nr < rows && nc < cols && grid[nr][nc] === 0 && !seen.has(key)) {\n        seen.add(key);\n        queue.push([nr, nc, d + 1]);\n      }\n    }\n  }\n  return -1;\n}`,
    fn: "shortestGridPath", tests: [[[[[0, 0, 0], [1, 1, 0], [0, 0, 0]]], 4], [[[[0, 1], [1, 0]]], -1], [[[[0]]], 0], [[[[0, 0, 1], [1, 0, 1], [1, 0, 0]]], 4]],
    followUp: "Why is the queue read with an index instead of shift()? (shift is O(n).)" },
  { id: "lru", title: "LRU cache", level: "Hard", topic: "Design", tier: "advanced",
    prompt: "Simulate an LRU cache with a capacity. `lru(capacity, ops)` gets ops like [\"put\", key, value] and [\"get\", key], and returns the results of every get (-1 when missing). When full, evict the least recently used key.",
    approach: "A JavaScript Map remembers insertion order. On get, delete and re-insert the key to mark it as recently used. On put when full, evict the first key (map.keys().next().value). Every operation is O(1).",
    solution: `function lru(capacity, ops) {\n  const cache = new Map();\n  const out = [];\n  for (const [op, key, value] of ops) {\n    if (op === "get") {\n      if (!cache.has(key)) { out.push(-1); continue; }\n      const v = cache.get(key);\n      cache.delete(key);\n      cache.set(key, v);\n      out.push(v);\n    } else {\n      cache.delete(key);\n      cache.set(key, value);\n      if (cache.size > capacity) cache.delete(cache.keys().next().value);\n    }\n  }\n  return out;\n}`,
    fn: "lru", tests: [[[2, [["put", 1, 1], ["put", 2, 2], ["get", 1], ["put", 3, 3], ["get", 2], ["put", 4, 4], ["get", 1], ["get", 3], ["get", 4]]], [1, -1, -1, 3, 4]], [[1, [["put", "a", 1], ["put", "b", 2], ["get", "a"], ["get", "b"]]], [-1, 2]]],
    followUp: "Without a Map's ordering, you'd use a hash map plus a doubly linked list. Explain why." },
  { id: "islands", title: "Count islands", level: "Medium", topic: "DFS", tier: "advanced",
    prompt: "In a grid of 1s (land) and 0s (water), count the islands. Land cells connect up, down, left and right.",
    approach: "Scan every cell. When you find unvisited land, count an island and flood-fill it with DFS (marking cells as visited) so it isn't counted again.",
    solution: `function countIslands(grid) {\n  const g = grid.map((row) => [...row]);\n  let count = 0;\n  const sink = (r, c) => {\n    if (r < 0 || c < 0 || r >= g.length || c >= g[0].length || g[r][c] !== 1) return;\n    g[r][c] = 0;\n    sink(r + 1, c); sink(r - 1, c); sink(r, c + 1); sink(r, c - 1);\n  };\n  for (let r = 0; r < g.length; r++)\n    for (let c = 0; c < g[0].length; c++)\n      if (g[r][c] === 1) { count++; sink(r, c); }\n  return count;\n}`,
    fn: "countIslands", tests: [[[[[1, 1, 0, 0], [1, 0, 0, 1], [0, 0, 1, 1], [0, 0, 0, 0]]], 2], [[[[0, 0], [0, 0]]], 0], [[[[1, 0, 1], [0, 1, 0], [1, 0, 1]]], 5], [[[]], 0]],
    followUp: "Why copy the grid first? (Don't mutate the caller's input.)" },
];
