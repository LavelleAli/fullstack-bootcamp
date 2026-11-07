// Intermediate lessons: React, Next.js, Python, PostgreSQL
export const react = [
  {
    id: "i-react-effects", title: "useEffect, cleanup and fetching data", minutes: 30,
    goal: "Sync a component with the outside world and clean up after yourself.",
    body: [
      "`useEffect(fn, deps)` runs **after** React draws the screen. Use it to sync with things outside React: timers, subscriptions, the document title, and fetching data.",
      "The **dependency array** says when to re-run: `[]` runs once on mount, and `[id]` runs again whenever id changes. Leaving the array out runs it after every render, which is usually a bug.",
      "Return a **cleanup** function to undo the effect: clear the timer, remove the listener, cancel the request. React runs it before the next run and on unmount.",
      "When fetching, ignore stale responses: if the id changes mid-request, the old answer must not overwrite the new one. An `ignore` flag or an `AbortController` handles it.",
      "Don't use effects for things you can calculate during render (filtered lists, totals).",
    ],
    example: { lang: "jsx", run: "check", code:
`import { useEffect, useState } from "react";

export default function UserCard({ id }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setError(null);
    fetch("https://jsonplaceholder.typicode.com/users/" + id, { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then(setUser)
      .catch((e) => { if (e.name !== "AbortError") setError(e.message); });

    return () => controller.abort();
  }, [id]);

  useEffect(() => {
    if (user) document.title = user.name + " · Directory";
  }, [user]);

  if (error) return <p role="alert">Couldn't load user: {error}</p>;
  if (!user) return <p>Loading…</p>;
  return <h2>{user.name}</h2>;
}` },
    demo: [
      { lines: [7, 8], say: "Each run makes its own AbortController." },
      { lines: [10, 11, 12, 13, 14, 15], say: "Fetch, check ok, parse, store." },
      { lines: [16], say: "An abort isn't a real error, so ignore it." },
      { lines: [18], say: "Cleanup: if id changes or the component unmounts, cancel the old request." },
      { lines: [19], say: "Re-run whenever id changes." },
      { lines: [21, 22, 23], say: "A second effect syncs the browser tab title with state." },
      { lines: [25, 26, 27], say: "Render each state: error, loading, success." },
    ],
    practice: { task: "Write a `Clock` component that shows the time and updates every second, without leaking timers.",
      hint: "setInterval in the effect, clearInterval in the cleanup, `[]` as deps.",
      solution: { lang: "jsx", run: "check", code:
`import { useEffect, useState } from "react";

export default function Clock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return <time dateTime={now.toISOString()}>{now.toLocaleTimeString()}</time>;
}` } },
    check: [
      { q: "useEffect(fn) with NO dependency array runs…", options: ["Once", "After every render", "Never", "Only on unmount"], answer: 1, why: "No array means every render, which is rarely what you want." },
      { q: "What is the cleanup function for?", options: ["Resetting state", "Undoing the effect: timers, listeners, requests", "Styling", "Error handling"], answer: 1, why: "It prevents leaks and stale updates." },
    ],
  },
  {
    id: "i-react-forms", title: "Controlled forms and lifting state up", minutes: 30,
    goal: "Build a validated form, and share state between sibling components.",
    body: [
      "A **controlled input** gets its `value` from state and updates it in `onChange`. React is the one source of truth.",
      "Keep form values in one object: `const [form, setForm] = useState({ name: \"\", email: \"\" })`, and update with spread and the input's `name`.",
      "Validate on submit (and optionally on blur). Show errors next to fields, connected with `aria-describedby`.",
      "**Lifting state up:** when two siblings need the same data, move the state to their closest shared parent and pass it down as props, along with functions to change it.",
    ],
    example: { lang: "jsx", run: "check", code:
`import { useState } from "react";

function validate(f) {
  const errors = {};
  if (!f.name.trim()) errors.name = "Enter your name";
  if (!/^\\S+@\\S+\\.\\S+$/.test(f.email)) errors.email = "Enter an email like ana@example.com";
  return errors;
}

export default function Signup({ onDone }) {
  const [form, setForm] = useState({ name: "", email: "" });
  const [errors, setErrors] = useState({});

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  function submit(e) {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length === 0) onDone(form);
  }

  return (
    <form onSubmit={submit} noValidate>
      <label htmlFor="name">Name</label>
      <input id="name" name="name" value={form.name} onChange={change}
        aria-invalid={!!errors.name} aria-describedby="name-err" />
      {errors.name && <p id="name-err">{errors.name}</p>}
      <label htmlFor="email">Email</label>
      <input id="email" name="email" type="email" value={form.email} onChange={change}
        aria-invalid={!!errors.email} aria-describedby="email-err" />
      {errors.email && <p id="email-err">{errors.email}</p>}
      <button>Sign up</button>
    </form>
  );
}` },
    demo: [
      { lines: [3, 4, 5, 6, 7, 8], say: "Validation is a pure function, which makes it easy to test." },
      { lines: [11, 12], say: "One state object for every field, plus one for errors." },
      { lines: [14], say: "One change handler for all inputs, using each input's name." },
      { lines: [16, 17, 18, 19, 20, 21], say: "On submit: validate, show the errors, and only continue when there are none." },
      { lines: [26, 27, 28], say: "value comes from state. The error is linked and announced." },
      { lines: [10], say: "onDone is lifted state: the parent decides what happens next." },
    ],
    practice: { task: "Lift state up: a parent `Shop` holds the cart count, a `ProductList` can add to it, and a `CartBadge` shows it.",
      hint: "The state lives in Shop; pass `onAdd` down to ProductList and `count` to CartBadge.",
      solution: { lang: "jsx", run: "check", code:
`import { useState } from "react";

const CartBadge = ({ count }) => <span aria-live="polite">Cart: {count}</span>;
const ProductList = ({ onAdd }) => <button onClick={onAdd}>Add fern</button>;

export default function Shop() {
  const [count, setCount] = useState(0);
  return (
    <>
      <CartBadge count={count} />
      <ProductList onAdd={() => setCount((c) => c + 1)} />
    </>
  );
}` } },
    check: [
      { q: "A controlled input's value comes from…", options: ["The DOM", "React state", "localStorage", "The server"], answer: 1, why: "State is the single source of truth." },
      { q: "Two siblings need the same data. You should…", options: ["Copy state into both", "Lift it to the shared parent", "Use a global variable", "Use refs"], answer: 1, why: "One owner, passed down as props." },
    ],
  },
  {
    id: "i-react-context", title: "Context and custom hooks", minutes: 30,
    goal: "Share state across the tree without prop drilling, and package logic in reusable hooks.",
    body: [
      "**Prop drilling** is passing props through components that don't use them. **Context** lets any component below a Provider read a value directly.",
      "Pattern: `createContext`, a Provider component that owns the state, and a `useX()` hook that reads the context and throws a clear error when used outside the Provider.",
      "Context is for app-wide things that change rarely: theme, signed-in user, cart. For fast-changing or complex state, look at Redux Toolkit or Zustand (Advanced).",
      "A **custom hook** is a function starting with `use` that calls other hooks. It shares *logic*, not state: each component calling it gets its own copy.",
    ],
    example: { lang: "jsx", run: "check", code:
`import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const toggle = () => setTheme((t) => (t === "light" ? "dark" : "light"));
  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}

export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try { return JSON.parse(localStorage.getItem(key)) ?? initial; } catch { return initial; }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  }, [key, value]);
  return [value, setValue];
}

export function ThemeButton() {
  const { theme, toggle } = useTheme();
  return <button onClick={toggle} aria-pressed={theme === "dark"}>Dark mode</button>;
}` },
    demo: [
      { lines: [3], say: "Create the context. null means \"no provider found\"." },
      { lines: [5, 6, 7, 8, 9], say: "The Provider owns the state and shares both the value and the way to change it." },
      { lines: [11, 12, 13, 14, 15], say: "A guard hook: a clear error beats a mysterious undefined." },
      { lines: [17, 18, 19, 20, 21, 22, 23, 24, 25], say: "A custom hook works like useState, but saves to localStorage, with try/catch because storage can fail." },
      { lines: [27, 28, 29, 30], say: "Any component under the Provider reads the theme directly. No drilling." },
    ],
    practice: { task: "Write a `useToggle(initial)` custom hook that returns `[on, toggle]`.",
      hint: "useState plus a toggle function wrapped in useCallback.",
      solution: { lang: "jsx", run: "check", code:
`import { useCallback, useState } from "react";

export function useToggle(initial = false) {
  const [on, setOn] = useState(initial);
  const toggle = useCallback(() => setOn((v) => !v), []);
  return [on, toggle];
}` } },
    check: [
      { q: "Two components call the same custom hook. Do they share state?", options: ["Yes", "No, each gets its own"], answer: 1, why: "Hooks share logic. Context shares state." },
      { q: "Context is a good fit for…", options: ["Text typed in an input", "Theme or signed-in user", "Mouse position", "Animation frames"], answer: 1, why: "Rarely-changing, widely-used values." },
    ],
  },
];

export const next = [
  {
    id: "i-next-dynamic", title: "Dynamic routes, static params and not-found", minutes: 30,
    goal: "Make one page file serve many URLs, pre-build them, and handle missing ones.",
    body: [
      "Square brackets make a **dynamic segment**: `app/books/[id]/page.js` matches `/books/1`, `/books/dune` and so on.",
      "In Next.js 15+, `params` is a **Promise**: `const { id } = await params;`.",
      "`generateStaticParams` lists the ids to build ahead of time, so those pages are static HTML and very fast.",
      "Call `notFound()` when the data doesn't exist. Next shows your `not-found.js` with a real 404 status.",
      "`generateMetadata` gives every page its own title and description.",
    ],
    example: { lang: "jsx", run: "check", file: "app/books/[id]/page.js", code:
`import { notFound } from "next/navigation";
import { getBook, getAllBooks } from "@/lib/books";

export async function generateStaticParams() {
  const books = await getAllBooks();
  return books.map((b) => ({ id: String(b.id) }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const book = await getBook(id);
  return book ? { title: book.title, description: book.summary } : {};
}

export default async function BookPage({ params }) {
  const { id } = await params;
  const book = await getBook(id);
  if (!book) notFound();

  return (
    <article>
      <h1>{book.title}</h1>
      <p>by {book.author}</p>
    </article>
  );
}` },
    demo: [
      { lines: [4, 5, 6, 7], say: "Build every book page at build time. Each id must be a string." },
      { lines: [9, 10, 11, 12, 13], say: "Each page gets its own title and description for search results." },
      { lines: [15, 16], say: "params is a Promise in modern Next.js, so await it." },
      { lines: [17, 18], say: "No book? notFound() shows the 404 page with the right status code." },
      { lines: [20, 21, 22, 23, 24, 25], say: "Plain server-rendered HTML." },
    ],
    practice: { task: "Create `app/shop/[category]/[slug]/page.js` that reads both params and shows them.",
      hint: "`const { category, slug } = await params;`",
      solution: { lang: "jsx", run: "check", code:
`export default async function ProductPage({ params }) {
  const { category, slug } = await params;
  return <h1>{category} / {slug}</h1>;
}` } },
    check: [
      { q: "What does app/blog/[slug]/page.js match?", options: ["Only /blog", "/blog/anything", "/[slug]", "/blog/slug only"], answer: 1, why: "The bracketed segment matches any value." },
      { q: "In Next 15+, params is…", options: ["A plain object", "A Promise you await", "A string", "Only on the client"], answer: 1, why: "params is async, so await it." },
    ],
  },
  {
    id: "i-next-data", title: "Server data fetching, loading.js and error.js", minutes: 30,
    goal: "Fetch on the server with caching, and give each route loading and error screens.",
    body: [
      "Server components can `await fetch()` directly. Run independent requests together with `Promise.all`.",
      "Control caching per request: `{ next: { revalidate: 3600 } }` caches for an hour, and `{ cache: \"no-store\" }` always fetches fresh.",
      "`loading.js` next to a page shows instantly while the page's data loads (it's a Suspense boundary).",
      "`error.js` catches errors in that route. It must be a client component and receives `error` and a `reset` function to retry.",
    ],
    example: { lang: "jsx", run: "check", file: "app/for-you/page.js", code:
`// app/for-you/page.js
const API = "https://example.com/api";
const hourly = { next: { revalidate: 3600 } };

async function getList(status) {
  const res = await fetch(API + "/books?status=" + status, hourly);
  if (!res.ok) throw new Error("Couldn't load " + status + " books");
  return res.json();
}

export default async function ForYou() {
  const [picked, suggested] = await Promise.all([getList("selected"), getList("suggested")]);
  return <><h1>For you</h1><p>{picked.length + suggested.length} books</p></>;
}

// app/for-you/loading.js
// export default function Loading() { return <p>Loading your books…</p>; }

// app/for-you/error.js
// "use client";
// export default function Error({ error, reset }) {
//   return <div role="alert"><p>{error.message}</p><button onClick={reset}>Try again</button></div>;
// }` },
    demo: [
      { lines: [3], say: "Cache responses for an hour. Most visitors get an instant page." },
      { lines: [5, 6, 7, 8, 9], say: "A small fetch helper that throws on bad responses." },
      { lines: [12], say: "Both lists load in parallel." },
      { lines: [16, 17], say: "loading.js appears immediately while the page awaits." },
      { lines: [19, 20, 21, 22, 23], say: "error.js catches the thrown error and offers a retry. It must be a client component." },
    ],
    practice: { task: "Which caching option would you use for: (a) a blog post list, (b) a user's shopping cart, (c) a currency exchange rate that changes every minute?",
      hint: "Think about how stale each can safely be.",
      solution: { lang: "text", code: "(a) revalidate: 3600 or longer, since posts rarely change\n(b) cache: \"no-store\", because it's per user and must be fresh\n(c) revalidate: 60" } },
    check: [
      { q: "What must error.js be?", options: ["A server component", "A client component", "A route handler", "A layout"], answer: 1, why: "It needs the reset function and interactivity." },
      { q: "{ cache: \"no-store\" } means…", options: ["Cache forever", "Always fetch fresh", "Cache for an hour", "Store in localStorage"], answer: 1, why: "no-store skips the cache." },
    ],
  },
  {
    id: "i-next-handlers", title: "Route handlers, next/image and next/font", minutes: 30,
    goal: "Build an API endpoint inside Next.js and use the built-in image and font optimizations.",
    body: [
      "A `route.js` file in `app/` is an API endpoint. Export functions named after HTTP methods: `GET`, `POST`, and so on. They receive a standard `Request` and return a `Response`.",
      "Route handlers run on the server, so they can use **secret keys** safely and hide them from the browser.",
      "`<Image>` from `next/image` resizes, converts formats, lazy-loads, and requires width and height (or `fill`) to prevent layout shift.",
      "`next/font` downloads fonts at build time and self-hosts them, so there's no extra request to Google and no layout jump.",
    ],
    example: { lang: "jsx", run: "check", file: "app/api/search/route.js", code:
`// app/api/search/route.js
export async function GET(request) {
  const q = new URL(request.url).searchParams.get("q")?.trim();
  if (!q) return Response.json({ error: "q is required" }, { status: 400 });

  const res = await fetch("https://api.themoviedb.org/3/search/movie?query=" + encodeURIComponent(q), {
    headers: { Authorization: "Bearer " + process.env.TMDB_TOKEN },
  });
  if (!res.ok) return Response.json({ error: "Upstream error" }, { status: 502 });
  const data = await res.json();
  return Response.json(data.results.slice(0, 10));
}

// app/layout.js
import { Inter } from "next/font/google";
import Image from "next/image";
const inter = Inter({ subsets: ["latin"] });

export function Logo() {
  return <Image src="/logo.png" alt="Plant Shop" width={120} height={40} priority className={inter.className} />;
}` },
    demo: [
      { lines: [2], say: "Export a function per method. This answers GET /api/search." },
      { lines: [3, 4], say: "Read the query string, and return 400 when it's missing." },
      { lines: [6, 7, 8], say: "The secret token is used on the server only. The browser never sees it." },
      { lines: [9], say: "Problems with the outside API become a clean 502." },
      { lines: [14, 16], say: "next/font self-hosts the font, so there's no request to Google from the browser." },
      { lines: [19], say: "Image needs width and height. priority loads it right away for above-the-fold images." },
    ],
    practice: { task: "Add a POST handler to app/api/newsletter/route.js that reads `{ email }` from the JSON body and returns 201, or 400 if the email is missing.",
      hint: "`const { email } = await request.json();`",
      solution: { lang: "jsx", run: "check", code:
`export async function POST(request) {
  const { email } = await request.json().catch(() => ({}));
  if (!email || !email.includes("@")) {
    return Response.json({ error: "A valid email is required" }, { status: 400 });
  }
  return Response.json({ subscribed: email }, { status: 201 });
}` } },
    check: [
      { q: "Where do secret API keys belong in Next.js?", options: ["A \"use client\" component", "A route handler or server component", "NEXT_PUBLIC_ variables", "localStorage"], answer: 1, why: "Server code never ships to the browser." },
      { q: "What does next/image require?", options: ["A CDN", "width and height (or fill)", "A .webp file", "JavaScript enabled"], answer: 1, why: "Known dimensions prevent layout shift." },
    ],
  },
];

export const python = [
  {
    id: "i-py-files", title: "Files, JSON and handling errors", minutes: 25,
    goal: "Read and write files and JSON safely, and handle what can go wrong.",
    body: [
      "`with open(path) as f:` opens a file and **always closes it**, even if an error happens.",
      "`json.load(f)` reads JSON from a file, and `json.dump(data, f, indent=2)` writes it. `json.loads` and `json.dumps` work with strings.",
      "`try / except SomeError / else / finally`. Catch **specific** errors (`FileNotFoundError`, `json.JSONDecodeError`, `ValueError`), never a bare `except:` that hides bugs.",
      "`pathlib.Path` is the modern way to build file paths that work on any operating system.",
    ],
    example: { lang: "python", run: "python", code:
`import json
from pathlib import Path

path = Path("scores.json")

def load_scores():
    try:
        with open(path) as f:
            return json.load(f)
    except FileNotFoundError:
        return {}
    except json.JSONDecodeError:
        print("scores.json is damaged, starting fresh")
        return {}

scores = load_scores()
scores["ana"] = max(scores.get("ana", 0), 42)

with open(path, "w") as f:
    json.dump(scores, f, indent=2)

print(load_scores())
path.write_text("{oops")
print(load_scores())
path.unlink()`,
      output: "{'ana': 42}\nscores.json is damaged, starting fresh\n{}" },
    demo: [
      { lines: [6, 7, 8, 9], say: "Try to read the file. with closes it automatically." },
      { lines: [10, 11], say: "No file yet? That's fine: start empty." },
      { lines: [12, 13, 14], say: "A damaged file gets a clear message instead of a crash." },
      { lines: [17], say: "Keep the best score." },
      { lines: [19, 20], say: "Write the JSON back, nicely indented." },
      { lines: [22], say: "Read it back.", out: "{'ana': 42}" },
      { lines: [23, 24], say: "Simulate a damaged file.", out: "scores.json is damaged, starting fresh\n{}" },
    ],
    practice: { task: "Write `safe_int(text, default=0)` that converts text to int, returning the default on bad input.",
      hint: "`int()` raises ValueError on things like \"abc\".",
      solution: { lang: "python", run: "python", code:
`def safe_int(text, default=0):
    try:
        return int(text)
    except (ValueError, TypeError):
        return default

print(safe_int("12"), safe_int("abc"), safe_int(None, -1))`, output: "12 0 -1" } },
    check: [
      { q: "Why use `with open(...)`?", options: ["It's faster", "The file is always closed, even on errors", "It creates the file", "Required for JSON"], answer: 1, why: "with is a context manager that guarantees cleanup." },
      { q: "Why avoid a bare `except:`?", options: ["Syntax error", "It hides real bugs, even typos", "It's slow", "It's deprecated"], answer: 1, why: "Catch only the errors you expect." },
    ],
  },
  {
    id: "i-py-classes", title: "Classes and objects", minutes: 25,
    goal: "Bundle data and behavior together with classes.",
    body: [
      "A **class** is a blueprint and an **object** is one thing built from it. `__init__` sets up a new object, and `self` is that object.",
      "**Methods** are functions on the class. They always take `self` first.",
      "`__repr__` controls how an object prints, which is great for debugging.",
      "**Inheritance**: `class Ebook(Book):` gets everything from Book and can add or change methods. `super()` calls the parent's version.",
      "`@dataclass` writes `__init__` and `__repr__` for you when a class is mostly data.",
    ],
    example: { lang: "python", run: "python", code:
`from dataclasses import dataclass

class Account:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("Deposit must be positive")
        self.balance += amount
        return self.balance

    def __repr__(self):
        return f"Account({self.owner!r}, {self.balance})"

class Savings(Account):
    def add_interest(self, rate):
        return self.deposit(round(self.balance * rate, 2))

@dataclass
class Point:
    x: int
    y: int

acct = Savings("Lee", 100)
acct.add_interest(0.05)
print(acct, Point(2, 3))`,
      output: "Account('Lee', 105.0) Point(x=2, y=3)" },
    demo: [
      { lines: [3, 4, 5, 6], say: "__init__ stores the data on self, this particular object." },
      { lines: [8, 9, 10, 11, 12], say: "A method with a rule: no negative deposits." },
      { lines: [14, 15], say: "__repr__ makes print() show something useful." },
      { lines: [17, 18, 19], say: "Savings inherits deposit and repr, and adds interest." },
      { lines: [21, 22, 23, 24], say: "dataclass generates __init__ and __repr__ from the fields." },
      { lines: [26, 27, 28], say: "5% interest is added, and both objects print readably.", out: "Account('Lee', 105.0) Point(x=2, y=3)" },
    ],
    practice: { task: "Make a `Stack` class with push, pop (raising IndexError when empty), peek and `__len__`.",
      hint: "Store items in a list on self.",
      solution: { lang: "python", run: "python", code:
`class Stack:
    def __init__(self):
        self._items = []
    def push(self, item):
        self._items.append(item)
    def pop(self):
        if not self._items:
            raise IndexError("pop from empty stack")
        return self._items.pop()
    def peek(self):
        return self._items[-1] if self._items else None
    def __len__(self):
        return len(self._items)

s = Stack(); s.push(1); s.push(2)
print(s.pop(), len(s), s.peek())`, output: "2 1 1" } },
    check: [
      { q: "What is `self`?", options: ["The class", "The specific object the method was called on", "A keyword for private", "The parent class"], answer: 1, why: "self is the instance." },
      { q: "What does @dataclass generate?", options: ["Database tables", "__init__ and __repr__ (and more) from the fields", "Tests", "JSON files"], answer: 1, why: "It removes boilerplate for data classes." },
    ],
  },
  {
    id: "i-py-requests", title: "Modules, virtual environments and calling APIs", minutes: 25,
    goal: "Organize code into modules, isolate dependencies, and call a web API.",
    body: [
      "Any `.py` file is a **module**: `from utils import slugify`. Code under `if __name__ == \"__main__\":` only runs when the file is executed directly, not when it's imported.",
      "A **virtual environment** keeps each project's packages separate: `python3 -m venv .venv`, then `source .venv/bin/activate` (Mac/Linux) or `.venv\\Scripts\\activate` (Windows).",
      "Install packages with `pip install requests`, and record them with `pip freeze > requirements.txt`.",
      "`requests.get(url, params=..., timeout=10)` calls an API. Call `raise_for_status()` to turn 4xx/5xx into an exception, and always set a **timeout**.",
    ],
    example: { lang: "python", run: "check", code:
`# weather.py
import requests

API = "https://api.open-meteo.com/v1/forecast"

def current_temp(lat, lon):
    resp = requests.get(API, params={"latitude": lat, "longitude": lon, "current": "temperature_2m"}, timeout=10)
    resp.raise_for_status()
    return resp.json()["current"]["temperature_2m"]

if __name__ == "__main__":
    try:
        print("Atlanta:", current_temp(33.75, -84.39), "°C")
    except requests.RequestException as err:
        print("Couldn't get the weather:", err)` },
    demo: [
      { lines: [2], say: "Installed with pip inside the project's virtual environment." },
      { lines: [6, 7], say: "params builds the query string, and timeout stops it hanging forever." },
      { lines: [8], say: "Turn HTTP errors into exceptions." },
      { lines: [9], say: "Dig into the JSON for the value you need." },
      { lines: [11], say: "This only runs with `python weather.py`, not on `import weather`." },
      { lines: [14, 15], say: "RequestException covers timeouts, bad statuses and network errors." },
    ],
    practice: { task: "Write the terminal commands to set up a new project folder with a venv, install requests and pytest, and save requirements.",
      hint: "venv, activate, pip install, pip freeze.",
      solution: { lang: "text", code: "mkdir weather && cd weather\npython3 -m venv .venv\nsource .venv/bin/activate\npip install requests pytest\npip freeze > requirements.txt\necho .venv >> .gitignore" } },
    check: [
      { q: "Why use a virtual environment?", options: ["Speed", "Each project gets its own package versions", "Required by Python", "Security scanning"], answer: 1, why: "It avoids version clashes between projects." },
      { q: "Why pass timeout= to requests?", options: ["Required", "Without it a slow server can hang your script forever", "It's faster", "Caching"], answer: 1, why: "requests waits indefinitely by default." },
    ],
  },
];

export const postgres = [
  {
    id: "i-sql-keys", title: "Primary keys, foreign keys and constraints", minutes: 30,
    goal: "Connect tables with foreign keys, and let the database enforce your rules.",
    diagram: "client-server-db",
    body: [
      "A **foreign key** column stores another table's primary key, which links the rows: `author_id INTEGER REFERENCES authors(id)`.",
      "The database then **refuses** bad data: you can't add a book for an author that doesn't exist.",
      "`ON DELETE CASCADE` deletes child rows with their parent. `ON DELETE SET NULL` keeps them but clears the link.",
      "Constraints are rules the database enforces for you: `NOT NULL`, `UNIQUE`, `CHECK (price >= 0)`. Data stays valid even if your app has a bug.",
    ],
    example: { lang: "sql", run: "sql", code:
`CREATE TABLE authors (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  price NUMERIC(6,2) CHECK (price >= 0),
  author_id INTEGER NOT NULL REFERENCES authors(id) ON DELETE CASCADE
);

INSERT INTO authors (name) VALUES ('Octavia Butler'), ('Frank Herbert');
INSERT INTO books (title, price, author_id) VALUES ('Kindred', 12.50, 1), ('Dune', 9.99, 2);

DELETE FROM authors WHERE name = 'Frank Herbert';
SELECT title FROM books;`,
      output: "CREATE TABLE\nCREATE TABLE\nINSERT 0 2\nINSERT 0 2\nDELETE 1\n  title  \n---------\n Kindred\n(1 row)" },
    demo: [
      { lines: [1, 2, 3, 4], say: "Authors, with unique names." },
      { lines: [9], say: "CHECK refuses negative prices." },
      { lines: [10], say: "Every book must point at a real author. Deleting the author deletes their books." },
      { lines: [13, 14], say: "Insert parents first, then children that reference them." },
      { lines: [16, 17], say: "Deleting Frank Herbert cascades to Dune.", out: "Kindred" },
    ],
    practice: { task: "What happens with `INSERT INTO books (title, price, author_id) VALUES ('Ghost', 5, 99);` and with a price of -3? Write a reviews table that references books.",
      hint: "Both inserts fail. A review needs a book_id foreign key and a rating CHECK between 1 and 5.",
      solution: { lang: "sql", run: "sql", setup: "CREATE TABLE books (id SERIAL PRIMARY KEY, title TEXT);",
        code: "CREATE TABLE reviews (\n  id SERIAL PRIMARY KEY,\n  book_id INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,\n  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),\n  body TEXT\n);",
        output: "CREATE TABLE" } },
    check: [
      { q: "What does a foreign key guarantee?", options: ["Speed", "The referenced row exists", "Unique values", "Encryption"], answer: 1, why: "It enforces the link between tables." },
      { q: "ON DELETE CASCADE means…", options: ["Deleting the parent deletes its children", "Children can't be deleted", "Nothing happens", "Parents are archived"], answer: 0, why: "The delete flows down to the referencing rows." },
    ],
  },
  {
    id: "i-sql-joins", title: "JOINs: combining tables", minutes: 30,
    goal: "Read data from several tables at once with INNER and LEFT JOIN.",
    body: [
      "`JOIN ... ON` matches rows across tables: `FROM books JOIN authors ON books.author_id = authors.id`.",
      "**INNER JOIN** (or plain JOIN) keeps only rows that match on both sides.",
      "**LEFT JOIN** keeps **every** row from the left table, filling in NULL when there's no match. Use it for \"authors and their books, including authors with none\".",
      "Short **aliases** (`books b`, `authors a`) keep queries readable.",
    ],
    example: { lang: "sql", run: "sql", setup:
`CREATE TABLE authors (id SERIAL PRIMARY KEY, name TEXT);
CREATE TABLE books (id SERIAL PRIMARY KEY, title TEXT, author_id INTEGER REFERENCES authors(id));
INSERT INTO authors (name) VALUES ('Octavia Butler'), ('Frank Herbert'), ('New Author');
INSERT INTO books (title, author_id) VALUES ('Kindred', 1), ('Dawn', 1), ('Dune', 2);`,
      code:
`SELECT b.title, a.name
FROM books b
JOIN authors a ON a.id = b.author_id
ORDER BY b.title;

SELECT a.name, b.title
FROM authors a
LEFT JOIN books b ON b.author_id = a.id
ORDER BY a.name, b.title;`,
      output: "" },
    demo: [
      { lines: [1, 2, 3], say: "Each book with its author's name. b and a are aliases." },
      { lines: [4], say: "Inner join: only books that have an author.", out: "Dawn | Octavia Butler\nDune | Frank Herbert\nKindred | Octavia Butler" },
      { lines: [6, 7, 8], say: "LEFT JOIN keeps every author, even one with no books." },
      { lines: [9], say: "New Author appears with a NULL title.", out: "Frank Herbert | Dune\nNew Author | (no books, so NULL)\nOctavia Butler | Dawn\nOctavia Butler | Kindred" },
    ],
    practice: { task: "List authors who have NO books.",
      hint: "LEFT JOIN, then `WHERE b.id IS NULL`.",
      solution: { lang: "sql", run: "sql", setup: "CREATE TABLE authors (id SERIAL PRIMARY KEY, name TEXT); CREATE TABLE books (id SERIAL PRIMARY KEY, author_id INTEGER); INSERT INTO authors (name) VALUES ('A'), ('B'); INSERT INTO books (author_id) VALUES (1);",
        code: "SELECT a.name FROM authors a LEFT JOIN books b ON b.author_id = a.id WHERE b.id IS NULL;",
        output: " name \n------\n B\n(1 row)" } },
    check: [
      { q: "Which JOIN keeps left rows with no match?", options: ["INNER JOIN", "LEFT JOIN", "CROSS JOIN", "None"], answer: 1, why: "LEFT JOIN keeps every left row and fills NULLs." },
      { q: "An INNER JOIN drops…", options: ["Nothing", "Rows without a match on both sides", "Duplicate rows", "NULL columns only"], answer: 1, why: "Only matching pairs survive." },
    ],
  },
  {
    id: "i-sql-group", title: "GROUP BY, HAVING, and querying from Node", minutes: 30,
    goal: "Summarize data per group, and run safe parameterized queries from Node.js.",
    body: [
      "`GROUP BY` collapses rows into groups, and aggregates (`COUNT`, `SUM`, `AVG`) run per group.",
      "`WHERE` filters rows **before** grouping. `HAVING` filters groups **after**: `HAVING COUNT(*) > 1`.",
      "From Node, use the `pg` package with a connection **Pool**.",
      "**Always use parameters** (`$1`, `$2`) for values. Never build SQL by joining strings with user input: that's **SQL injection**, one of the most common security holes.",
    ],
    example: { lang: "sql", run: "sql", setup:
`CREATE TABLE orders (id SERIAL PRIMARY KEY, customer TEXT, total NUMERIC(8,2));
INSERT INTO orders (customer, total) VALUES ('ana', 20), ('ana', 35), ('bo', 12), ('cy', 50), ('cy', 5), ('cy', 10);`,
      code:
`SELECT customer, COUNT(*) AS orders, SUM(total) AS spent
FROM orders
GROUP BY customer
HAVING COUNT(*) > 1
ORDER BY spent DESC;

-- From Node.js with the pg package:
-- import pg from "pg";
-- const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
-- const { rows } = await pool.query(
--   "SELECT * FROM orders WHERE customer = $1 AND total > $2",
--   [req.query.customer, 10]
-- );`,
      output: " customer | orders | spent \n----------+--------+-------\n cy       |      3 | 65.00\n ana      |      2 | 55.00\n(2 rows)" },
    demo: [
      { lines: [1, 2, 3], say: "One row per customer, with a count and a total." },
      { lines: [4], say: "HAVING filters groups: only repeat customers." },
      { lines: [5], say: "Biggest spenders first.", out: "cy | 3 | 65.00\nana | 2 | 55.00" },
      { lines: [9], say: "A Pool reuses connections. The URL comes from an environment variable." },
      { lines: [10, 11, 12, 13], say: "$1 and $2 are placeholders. pg sends the values separately, so input can never change the SQL." },
    ],
    practice: { task: "Find each customer's average order, only for orders over $8, showing customers whose average is above 20.",
      hint: "WHERE total > 8, GROUP BY customer, HAVING AVG(total) > 20.",
      solution: { lang: "sql", run: "sql", setup: "CREATE TABLE orders (customer TEXT, total NUMERIC(8,2)); INSERT INTO orders VALUES ('ana', 20), ('ana', 35), ('bo', 12), ('cy', 50), ('cy', 5), ('cy', 10);",
        code: "SELECT customer, ROUND(AVG(total), 2) AS avg_order\nFROM orders\nWHERE total > 8\nGROUP BY customer\nHAVING AVG(total) > 20\nORDER BY customer;",
        output: " customer | avg_order \n----------+-----------\n ana      |     27.50\n cy       |     30.00\n(2 rows)" } },
    check: [
      { q: "WHERE vs HAVING?", options: ["Same thing", "WHERE filters rows before grouping, HAVING filters groups after", "HAVING is faster", "WHERE works only on numbers"], answer: 1, why: "HAVING can use aggregates like COUNT(*)." },
      { q: "How do you prevent SQL injection?", options: ["Escape quotes by hand", "Use parameterized queries ($1, $2)", "Use LIMIT", "Hide the database URL"], answer: 1, why: "Parameters are never parsed as SQL." },
    ],
  },
];
