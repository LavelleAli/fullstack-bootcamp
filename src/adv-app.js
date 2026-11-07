// Advanced lessons: React, Next.js, Python, PostgreSQL
export const react = [
  {
    id: "a-react-reducer", title: "useReducer and state machines", minutes: 30,
    goal: "Move complex state logic into a pure reducer, and make impossible states impossible.",
    body: [
      "When several pieces of state change together, or the next state depends on the previous one in complicated ways, use `useReducer(reducer, initialState)`.",
      "A **reducer** is a pure function `(state, action) => newState`. All the update logic lives in one place, and you can unit-test it without React.",
      "Components just `dispatch({ type: \"added\", text })`. They say *what happened*, not how to update.",
      "Thinking in **states** (idle → submitting → success | error) rather than booleans is a **state machine**. Each action is only allowed from certain states, which stops bugs like submitting twice.",
    ],
    example: { lang: "js", run: "node", code:
`const initial = { status: "idle", items: [], error: null };

function checkoutReducer(state, action) {
  switch (action.type) {
    case "add":
      if (state.status === "submitting") return state;
      return { ...state, items: [...state.items, action.item] };
    case "submit":
      if (state.status === "submitting" || state.items.length === 0) return state;
      return { ...state, status: "submitting", error: null };
    case "succeeded":
      return { ...initial, status: "success" };
    case "failed":
      return { ...state, status: "error", error: action.message };
    default:
      throw new Error("Unknown action: " + action.type);
  }
}

let s = initial;
s = checkoutReducer(s, { type: "submit" });
console.log(s.status);
s = checkoutReducer(s, { type: "add", item: "fern" });
s = checkoutReducer(s, { type: "submit" });
s = checkoutReducer(s, { type: "submit" });
console.log(s.status, s.items);
s = checkoutReducer(s, { type: "failed", message: "Card declined" });
console.log(s.status, s.error);

// In a component:
// const [state, dispatch] = useReducer(checkoutReducer, initial);
// <button disabled={state.status === "submitting"} onClick={() => dispatch({ type: "submit" })}>Pay</button>`,
      output: "idle\nsubmitting [ 'fern' ]\nerror Card declined" },
    demo: [
      { lines: [1], say: "One state object with a status, instead of isLoading/isError/isDone booleans." },
      { lines: [5, 6, 7], say: "You can't change the cart while a payment is in progress." },
      { lines: [8, 9, 10], say: "Submitting twice, or with an empty cart, does nothing. The double-click bug is impossible." },
      { lines: [15, 16], say: "Unknown actions fail loudly during development." },
      { lines: [20, 21, 22], say: "Submit on an empty cart is ignored.", out: "idle" },
      { lines: [23, 24, 25, 26], say: "The second submit is ignored too.", out: "submitting [ 'fern' ]" },
      { lines: [27, 28], say: "A failure moves to error and keeps the message for the UI.", out: "error Card declined" },
    ],
    practice: { task: "Add a `retry` action that only works from the error state and moves back to submitting.",
      hint: "Check state.status === \"error\" first.",
      solution: { lang: "js", run: "node", code:
`function reducer(state, action) {
  if (action.type === "retry") {
    return state.status === "error" ? { ...state, status: "submitting", error: null } : state;
  }
  return state;
}
console.log(reducer({ status: "error" }, { type: "retry" }).status, reducer({ status: "idle" }, { type: "retry" }).status);`, output: "submitting idle" } },
    check: [
      { q: "What must a reducer be?", options: ["Async", "Pure: same input, same output, no side effects", "A class", "Connected to the DOM"], answer: 1, why: "Purity makes it predictable and testable." },
      { q: "Why model state as a status string?", options: ["Fewer characters", "Impossible combinations of booleans can't happen", "Required by React", "Faster renders"], answer: 1, why: "A state machine is always in exactly one state." },
    ],
  },
  {
    id: "a-react-perf", title: "React performance: memo, useMemo, useCallback and the compiler", minutes: 30,
    goal: "Find real slowdowns, and know which tools fix which problem.",
    body: [
      "**Measure first.** React DevTools → Profiler shows which components rendered and how long they took. Don't optimize guesses.",
      "A component re-renders when its parent re-renders, even if its props didn't change. `memo(Component)` skips the render when the props are the same.",
      "`memo` compares props **by reference**, so new objects or functions created each render break it. `useMemo` keeps an object (or an expensive calculation) stable, and `useCallback` keeps a function stable.",
      "The **React Compiler** (on in many new Next.js projects) adds this memoization automatically. With it, you rarely write these hooks by hand.",
      "Other big wins: **virtualize** long lists (only render what's visible), and keep fast-changing state low in the tree.",
    ],
    example: { lang: "jsx", run: "check", code:
`import { memo, useCallback, useMemo, useState } from "react";

const Row = memo(function Row({ item, onToggle }) {
  return (
    <li>
      <label><input type="checkbox" checked={item.done} onChange={() => onToggle(item.id)} /> {item.title}</label>
    </li>
  );
});

export default function TodoList({ items, setItems }) {
  const [filter, setFilter] = useState("");

  const visible = useMemo(
    () => items.filter((i) => i.title.toLowerCase().includes(filter.toLowerCase())),
    [items, filter],
  );

  const toggle = useCallback(
    (id) => setItems((list) => list.map((i) => (i.id === id ? { ...i, done: !i.done } : i))),
    [setItems],
  );

  return (
    <>
      <input aria-label="Filter" value={filter} onChange={(e) => setFilter(e.target.value)} />
      <ul>{visible.map((item) => <Row key={item.id} item={item} onToggle={toggle} />)}</ul>
    </>
  );
}` },
    demo: [
      { lines: [3], say: "memo: Row only re-renders when its props change." },
      { lines: [14, 15, 16, 17], say: "useMemo: the filtered list is recalculated only when items or filter change." },
      { lines: [19, 20, 21, 22], say: "useCallback: the same toggle function every render, so memo(Row) can do its job." },
      { lines: [20], say: "The functional update means toggle never needs `items` as a dependency." },
      { lines: [28], say: "Typing in the filter re-renders TodoList, but unchanged rows are skipped." },
    ],
    practice: { task: "A memo'd `Chart` still re-renders on every keystroke. Its parent passes `options={{ color: \"red\" }}`. Why, and what's the fix?",
      hint: "Object identity.",
      solution: { lang: "jsx", run: "check", code:
`// A new object literal every render means props are "different" every time.
// Fix: create it once, outside the component (or with useMemo).
const CHART_OPTIONS = { color: "red" };
function Parent() {
  return <Chart options={CHART_OPTIONS} />;
}` } },
    check: [
      { q: "What should you do before optimizing?", options: ["Add memo everywhere", "Measure with the Profiler", "Rewrite in a class", "Remove state"], answer: 1, why: "Optimize what's actually slow." },
      { q: "memo fails when you pass…", options: ["Strings", "Numbers", "A new inline object or function each render", "Booleans"], answer: 2, why: "Props are compared by reference." },
    ],
  },
  {
    id: "a-react-redux", title: "Global state with Redux Toolkit", minutes: 30,
    goal: "Know when an app needs a global store, and build one with Redux Toolkit.",
    body: [
      "Reach for a store when many distant components read and change the same data, and Context re-renders too much. Examples: a cart, a signed-in user with permissions, a multi-step editor.",
      "**Redux Toolkit** (RTK) is the modern way to write Redux. `createSlice` makes the reducer and the action creators together.",
      "Inside a slice reducer you can \"mutate\" `state` directly. RTK uses Immer to turn that into a safe immutable update.",
      "Components read with `useSelector((s) => s.cart.items)` and update with `dispatch(addItem(...))`. Derived values (totals, counts) are computed in selectors, not stored.",
      "Lighter options: **Zustand** (a tiny store) and **TanStack Query** for server data (which shouldn't live in Redux at all).",
    ],
    example: { lang: "js", run: "node", code:
`import { configureStore, createSlice } from "@reduxjs/toolkit";

const cart = createSlice({
  name: "cart",
  initialState: { items: {} },
  reducers: {
    addItem(state, action) {
      const { id } = action.payload;
      state.items[id] = (state.items[id] ?? 0) + 1;
    },
    removeItem(state, action) {
      delete state.items[action.payload];
    },
  },
});

export const { addItem, removeItem } = cart.actions;
const store = configureStore({ reducer: { cart: cart.reducer } });

const selectCount = (s) => Object.values(s.cart.items).reduce((a, b) => a + b, 0);

const before = store.getState();
store.dispatch(addItem({ id: "fern" }));
store.dispatch(addItem({ id: "fern" }));
store.dispatch(addItem({ id: "cactus" }));
store.dispatch(removeItem("cactus"));

console.log(store.getState().cart.items, selectCount(store.getState()));
console.log(before === store.getState(), addItem({ id: "x" }).type);`,
      output: "{ fern: 2 } 2\nfalse cart/addItem" },
    demo: [
      { lines: [3, 4, 5], say: "A slice: a name, a starting state, and its reducers." },
      { lines: [7, 8, 9, 10], say: "It looks like mutation, but Immer produces a new state object." },
      { lines: [17], say: "Action creators are generated for you." },
      { lines: [18], say: "configureStore adds the dev tools and safety checks." },
      { lines: [20], say: "A selector derives the count. Never store values you can calculate." },
      { lines: [28], say: "Two ferns; the cactus was added then removed.", out: "{ fern: 2 } 2" },
      { lines: [29], say: "The old state is untouched (immutable), and actions are named slice/reducer.", out: "false cart/addItem" },
    ],
    practice: { task: "Add a `clear` reducer and a `selectIsEmpty` selector.",
      hint: "`clear(state) { state.items = {}; }`",
      solution: { lang: "js", run: "node", code:
`import { createSlice } from "@reduxjs/toolkit";
const cart = createSlice({
  name: "cart",
  initialState: { items: { fern: 1 } },
  reducers: { clear(state) { state.items = {}; } },
});
const selectIsEmpty = (s) => Object.keys(s.items).length === 0;
const next = cart.reducer(undefined, cart.actions.clear());
console.log(selectIsEmpty(next));`, output: "true" } },
    check: [
      { q: "Can you write state.count++ in an RTK reducer?", options: ["No, never", "Yes, Immer makes it a safe immutable update", "Only in classes", "Only with useState"], answer: 1, why: "RTK wraps reducers with Immer." },
      { q: "Where should a cart total live?", options: ["In its own state field", "Computed in a selector", "In localStorage", "In a ref"], answer: 1, why: "Derived data stays in sync automatically." },
    ],
  },
];

export const next = [
  {
    id: "a-next-cache", title: "Caching, revalidation and streaming", minutes: 30,
    goal: "Control exactly when Next.js data is fresh, and stream slow parts of a page.",
    body: [
      "Tag cached data with `fetch(url, { next: { tags: [\"books\"] } })`. After data changes, call `revalidateTag(\"books\", \"max\")` in a Server Action or route handler. The next visitor gets stale data instantly while fresh data loads in the background.",
      "In Next.js 16, `revalidateTag` takes a second argument (a cache profile). `\"max\"` is the recommended one. Use `updateTag` in a Server Action when the user must see their own change immediately.",
      "`revalidatePath(\"/books\")` refreshes everything on a route.",
      "**Streaming:** wrap a slow component in `<Suspense fallback={...}>`. The rest of the page is sent at once, and the slow part streams in when ready.",
    ],
    example: { lang: "jsx", run: "check", file: "app/books/page.js", code:
`import { Suspense } from "react";

async function getBooks() {
  const res = await fetch("https://example.com/api/books", { next: { tags: ["books"], revalidate: 3600 } });
  return res.json();
}

async function Reviews() {
  const res = await fetch("https://example.com/api/reviews", { cache: "no-store" });
  const reviews = await res.json();
  return <ul>{reviews.map((r) => <li key={r.id}>{r.text}</li>)}</ul>;
}

export default async function BooksPage() {
  const books = await getBooks();
  return (
    <main>
      <h1>{books.length} books</h1>
      <Suspense fallback={<p>Loading reviews…</p>}>
        <Reviews />
      </Suspense>
    </main>
  );
}

// app/actions.js
// "use server";
// import { revalidateTag } from "next/cache";
// export async function addBook(formData) {
//   await db.books.insert({ title: formData.get("title") });
//   revalidateTag("books", "max");
// }` },
    demo: [
      { lines: [4], say: "Cached for an hour AND tagged \"books\", so it can be refreshed on demand." },
      { lines: [9], say: "Reviews are always fresh, and slow." },
      { lines: [19, 20, 21], say: "Suspense: the page shows at once, and reviews stream in when ready." },
      { lines: [29, 30, 31, 32], say: "After adding a book, mark the tag stale. The next visit refreshes the list in the background." },
    ],
    practice: { task: "A product price changed in your CMS. Which do you call, and from where: revalidatePath or revalidateTag?",
      hint: "Which pages show that product?",
      solution: { lang: "text", code: "If the price appears on several pages (list, detail, cart), tag every fetch with \"product-<id>\" and call revalidateTag(\"product-<id>\", \"max\") from a route handler that the CMS webhook calls.\nIf it's on one route only, revalidatePath(\"/products/<id>\") works too." } },
    check: [
      { q: "What does <Suspense> around a slow component do?", options: ["Hides it", "Lets the rest of the page render while it streams in later", "Caches it", "Makes it a client component"], answer: 1, why: "Streaming sends ready parts first." },
      { q: "Where can revalidateTag be called?", options: ["Client components", "Server Actions and route handlers", "CSS", "Proxy"], answer: 1, why: "It's a server-only function." },
    ],
  },
  {
    id: "a-next-actions", title: "Server Actions and forms", minutes: 30,
    goal: "Handle form submissions on the server without writing an API route.",
    body: [
      "A **Server Action** is an async function marked `\"use server\"`. Pass it to `<form action={fn}>` and it runs on the server with the form's `FormData`.",
      "**Always validate** inside the action (Zod is ideal). It's a public endpoint: anyone can call it with any data.",
      "`useActionState(action, initialState)` gives you the action's last return value (like validation errors) and a pending flag.",
      "Forms with Server Actions work **before JavaScript loads** (progressive enhancement).",
      "Check **authorization** in every action. Never trust that the button was only shown to allowed users.",
    ],
    example: { lang: "jsx", run: "check", code:
`// app/newsletter/actions.js
"use server";
import * as z from "zod";

const Schema = z.object({ email: z.email({ error: "Enter a valid email" }) });

export async function subscribe(prevState, formData) {
  const parsed = Schema.safeParse({ email: formData.get("email") });
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  // await db.subscribers.insert(parsed.data);
  return { ok: true };
}

// app/newsletter/Form.js
// "use client";
// import { useActionState } from "react";
// import { subscribe } from "./actions";
// export default function Form() {
//   const [state, action, pending] = useActionState(subscribe, {});
//   return (
//     <form action={action}>
//       <label htmlFor="email">Email</label>
//       <input id="email" name="email" type="email" required aria-describedby="email-msg" />
//       <button disabled={pending}>{pending ? "Subscribing…" : "Subscribe"}</button>
//       <p id="email-msg" role="status">{state.error || (state.ok && "You're subscribed!")}</p>
//     </form>
//   );
// }` },
    demo: [
      { lines: [2], say: "Everything exported from this file runs only on the server." },
      { lines: [7, 8, 9], say: "With useActionState, the action receives the previous state, then the FormData. Validate first." },
      { lines: [11], say: "Return plain data. It becomes the new state in the component." },
      { lines: [19], say: "state is the last return value, action goes on the form, and pending is true while it runs." },
      { lines: [21], say: "The form posts straight to the server function. It works even before JS loads." },
      { lines: [24, 25], say: "Show the pending state, then the result, in a live region." },
    ],
    practice: { task: "Why must the action re-check that the user is allowed to subscribe, even though the form is only shown to signed-in users?",
      hint: "How could someone call it without the form?",
      solution: { lang: "text", code: "A Server Action is a public HTTP endpoint. Anyone can call it directly with crafted FormData, without ever seeing your UI. Check the session and permissions inside the action, every time." } },
    check: [
      { q: "Do Server Action forms work before JavaScript loads?", options: ["No", "Yes, they degrade to a normal form post"], answer: 1, why: "Progressive enhancement is built in." },
      { q: "Validation should happen…", options: ["Only in the browser", "Inside the server action", "Not at all with TypeScript", "In CSS"], answer: 1, why: "Client checks are only for UX." },
    ],
  },
  {
    id: "a-next-proxy", title: "Proxy (formerly middleware), auth and deployment", minutes: 30,
    goal: "Run code before a request reaches a page, and ship a Next.js app safely.",
    body: [
      "In Next.js 16 the `middleware` file is renamed **`proxy.js`** (with `export function proxy`). It runs before matching requests: redirects, rewrites, setting headers.",
      "Use it for **optimistic** checks, like \"no session cookie, redirect to /login\". Still verify the session properly in the page, action or route that reads the data. Proxy isn't a full security boundary.",
      "Always set a `matcher`. Without one, proxy runs on every request, including CSS, JS and images.",
      "**Deploying to Vercel:** connect the GitHub repo, set environment variables per environment (Production, Preview), and every pull request gets its own preview URL.",
    ],
    example: { lang: "jsx", run: "check", file: "proxy.js", code:
`// proxy.js (project root)
import { NextResponse } from "next/server";

export function proxy(request) {
  const session = request.cookies.get("session")?.value;
  const { pathname } = request.nextUrl;

  if (!session && pathname.startsWith("/dashboard")) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  const res = NextResponse.next();
  res.headers.set("X-Frame-Options", "DENY");
  return res;
}

export const config = {
  matcher: ["/dashboard/:path*", "/account/:path*"],
};` },
    demo: [
      { lines: [4], say: "Next.js 16 names it proxy. Older versions call the same thing middleware." },
      { lines: [5, 6], say: "Read a cookie and the requested path." },
      { lines: [8, 9, 10, 11, 12], say: "No session on a dashboard URL? Redirect to login, remembering where they were going." },
      { lines: [14, 15, 16], say: "Otherwise continue, adding a security header." },
      { lines: [19, 20, 21], say: "Only run on these paths, never on static files." },
    ],
    practice: { task: "List the environment variables your Summarist-style app needs on Vercel, and mark which ones may start with NEXT_PUBLIC_.",
      hint: "Firebase web config is public; secret server keys are not.",
      solution: { lang: "text", code: "NEXT_PUBLIC_FIREBASE_API_KEY (public: identifies the project)\nNEXT_PUBLIC_FIREBASE_PROJECT_ID (public)\nNEXT_PUBLIC_SITE_URL (public)\nSTRIPE_SECRET_KEY (secret: server only)\nFIREBASE_ADMIN_PRIVATE_KEY (secret: server only)\nSet each for Production and Preview separately." } },
    check: [
      { q: "What is middleware called in Next.js 16?", options: ["edge.js", "proxy.js", "server.js", "guard.js"], answer: 1, why: "The convention was renamed to proxy." },
      { q: "Why always set a matcher?", options: ["Required syntax", "Otherwise proxy runs on every request, including static files", "For SEO", "To enable caching"], answer: 1, why: "It can block CSS, JS and images and slow everything down." },
    ],
  },
];

export const python = [
  {
    id: "a-py-generators", title: "Comprehensions and generators", minutes: 25,
    goal: "Transform data concisely, and process huge data without loading it all into memory.",
    body: [
      "List, dict and set **comprehensions** build collections in one expression: `{name: len(name) for name in names}`.",
      "A **generator** produces values one at a time with `yield`, pausing in between. It uses almost no memory, even for millions of items.",
      "Generator **expressions** look like comprehensions in parentheses: `sum(x * x for x in range(10**6))`.",
      "Chain generators into **pipelines**: read lines → parse → filter → total, processing one row at a time.",
    ],
    example: { lang: "python", run: "python", code:
`import sys

names = ["ana", "bo", "cyrus", "di"]
lengths = {n: len(n) for n in names}
short = {n.upper() for n in names if len(n) <= 2}
print(lengths, sorted(short))

def read_orders(lines):
    for line in lines:
        customer, total = line.split(",")
        yield customer, float(total)

def big_orders(orders, minimum):
    for customer, total in orders:
        if total >= minimum:
            yield customer, total

raw = ["ana,20", "bo,75.5", "cy,120", "di,9"]
pipeline = big_orders(read_orders(raw), 50)
print(next(pipeline))
print(sum(total for _, total in pipeline))

squares_list = [x * x for x in range(100_000)]
squares_gen = (x * x for x in range(100_000))
print(sys.getsizeof(squares_list) > 100 * sys.getsizeof(squares_gen))`,
      output: "{'ana': 3, 'bo': 2, 'cyrus': 5, 'di': 2} ['BO', 'DI']\n('bo', 75.5)\n120.0\nTrue" },
    demo: [
      { lines: [3, 4, 5, 6], say: "A dict comprehension and a set comprehension with a filter.", out: "{'ana': 3, 'bo': 2, 'cyrus': 5, 'di': 2} ['BO', 'DI']" },
      { lines: [8, 9, 10, 11], say: "yield makes this a generator: it hands back one order at a time." },
      { lines: [13, 14, 15, 16], say: "Generators chain: this one filters the stream from the first." },
      { lines: [19, 20], say: "Nothing has run yet. next() pulls exactly one item through the pipeline.", out: "('bo', 75.5)" },
      { lines: [21], say: "sum pulls the rest. The pipeline remembers where it stopped.", out: "120.0" },
      { lines: [23, 24, 25], say: "The list holds 100,000 numbers; the generator holds almost nothing.", out: "True" },
    ],
    practice: { task: "Write a generator `chunks(items, size)` that yields lists of `size` items at a time.",
      hint: "Loop with range(0, len(items), size) and yield slices.",
      solution: { lang: "python", run: "python", code:
`def chunks(items, size):
    for i in range(0, len(items), size):
        yield items[i:i + size]

print(list(chunks([1, 2, 3, 4, 5], 2)))`, output: "[[1, 2], [3, 4], [5]]" } },
    check: [
      { q: "What does yield do?", options: ["Ends the function", "Returns a value and pauses until the next one is requested", "Raises an error", "Prints"], answer: 1, why: "Generators resume where they left off." },
      { q: "Why use a generator for a 5GB log file?", options: ["It's sorted", "It processes one line at a time without loading the file into memory", "It's encrypted", "Faster to write"], answer: 1, why: "Memory stays tiny." },
    ],
  },
  {
    id: "a-py-decorators", title: "Decorators and type hints", minutes: 30,
    goal: "Wrap functions with reusable behavior, and document types for tools and teammates.",
    body: [
      "A **decorator** is a function that takes a function and returns a new one that adds behavior: timing, logging, caching, auth checks. `@timer` above a def is shorthand for `fn = timer(fn)`.",
      "Use `functools.wraps` inside so the wrapped function keeps its name and docstring.",
      "The standard library has great ones: `@functools.cache`, `@dataclass`, `@property`, `@staticmethod`.",
      "**Type hints** (`def total(prices: list[float]) -> float:`) aren't enforced when the code runs, but editors and **mypy** use them to catch bugs before running.",
    ],
    example: { lang: "python", run: "python", code:
`import functools
import time
from typing import Callable

def retry(times: int) -> Callable:
    def decorator(fn: Callable) -> Callable:
        @functools.wraps(fn)
        def wrapper(*args, **kwargs):
            for attempt in range(1, times + 1):
                try:
                    return fn(*args, **kwargs)
                except ConnectionError:
                    print(f"attempt {attempt} failed")
            raise ConnectionError(f"{fn.__name__} failed {times} times")
        return wrapper
    return decorator

calls = 0

@retry(times=3)
def flaky_fetch(url: str) -> str:
    global calls
    calls += 1
    if calls < 3:
        raise ConnectionError("network down")
    return f"200 OK from {url}"

@functools.cache
def fib(n: int) -> int:
    return n if n < 2 else fib(n - 1) + fib(n - 2)

print(flaky_fetch("/api/books"))
print(flaky_fetch.__name__, fib(80))`,
      output: "attempt 1 failed\nattempt 2 failed\n200 OK from /api/books\nflaky_fetch 23416728348467685" },
    demo: [
      { lines: [5, 6, 7, 8], say: "A decorator factory: retry(times) returns the actual decorator, which returns a wrapper." },
      { lines: [9, 10, 11, 12, 13], say: "The wrapper calls the real function, catching connection errors." },
      { lines: [7], say: "wraps keeps the original name and docstring." },
      { lines: [20, 21], say: "@retry(times=3) wraps flaky_fetch." },
      { lines: [28, 29, 30], say: "functools.cache memoizes, so fib(80) is instant instead of taking forever." },
      { lines: [32], say: "Two failures, then success.", out: "attempt 1 failed\nattempt 2 failed\n200 OK from /api/books" },
      { lines: [33], say: "The name survived thanks to wraps.", out: "flaky_fetch 23416728348467685" },
    ],
    practice: { task: "Write a `@timer` decorator that prints how long the function took in milliseconds.",
      hint: "time.perf_counter() before and after the call.",
      solution: { lang: "python", run: "python", code:
`import functools, time

def timer(fn):
    @functools.wraps(fn)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = fn(*args, **kwargs)
        print(f"{fn.__name__} took {(time.perf_counter() - start) * 1000:.0f} ms")
        return result
    return wrapper

@timer
def nap():
    time.sleep(0.05)

nap()` } },
    check: [
      { q: "@timer above def f is the same as…", options: ["timer()", "f = timer(f)", "f.timer = True", "import timer"], answer: 1, why: "Decorators are just functions applied at definition time." },
      { q: "Does Python enforce type hints when running?", options: ["Yes", "No; tools like mypy check them"], answer: 1, why: "Hints are for tools and humans." },
    ],
  },
  {
    id: "a-py-fastapi", title: "A small web API with FastAPI", minutes: 30,
    goal: "Build a typed Python API with automatic validation and docs.",
    body: [
      "**FastAPI** builds APIs from type hints: declare the parameter types and request models, and it validates input and writes the docs for you.",
      "Request bodies are **Pydantic** models, which validate the JSON automatically and answer 422 with details on bad input.",
      "Run it with `fastapi dev main.py` and open `/docs` for interactive API docs.",
      "It pairs well with a React or Next.js frontend, and it's popular for AI and data APIs.",
    ],
    example: { lang: "python", run: "check", file: "main.py", code:
`from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

app = FastAPI(title="Notes API")

class NoteIn(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    done: bool = False

class Note(NoteIn):
    id: int

notes: dict[int, Note] = {}

@app.get("/notes")
def list_notes(done: bool | None = None) -> list[Note]:
    items = list(notes.values())
    return [n for n in items if done is None or n.done == done]

@app.post("/notes", status_code=201)
def create_note(body: NoteIn) -> Note:
    note = Note(id=len(notes) + 1, **body.model_dump())
    notes[note.id] = note
    return note

@app.get("/notes/{note_id}")
def get_note(note_id: int) -> Note:
    if note_id not in notes:
        raise HTTPException(status_code=404, detail="Note not found")
    return notes[note_id]` },
    demo: [
      { lines: [6, 7, 8], say: "A Pydantic model: title must be 1 to 200 characters, and done defaults to false." },
      { lines: [10, 11], say: "The stored note adds an id." },
      { lines: [15, 16, 17, 18], say: "?done=true is parsed into a bool from the type hint alone." },
      { lines: [20, 21], say: "The body is validated against NoteIn automatically. Bad JSON gets a 422 with details." },
      { lines: [26, 27, 28, 29, 30], say: "note_id is converted to int, and a missing note raises a 404." },
    ],
    practice: { task: "Add `PATCH /notes/{note_id}` that accepts only `done` and updates it.",
      hint: "A small model class NoteUpdate(BaseModel): done: bool.",
      solution: { lang: "python", run: "check", code:
`from pydantic import BaseModel

class NoteUpdate(BaseModel):
    done: bool

# @app.patch("/notes/{note_id}")
# def update_note(note_id: int, body: NoteUpdate) -> Note:
#     if note_id not in notes:
#         raise HTTPException(status_code=404, detail="Note not found")
#     notes[note_id].done = body.done
#     return notes[note_id]` } },
    check: [
      { q: "What validates a FastAPI request body?", options: ["Your own if statements", "The Pydantic model in the type hint", "The database", "Nothing"], answer: 1, why: "Declare the model; FastAPI validates." },
      { q: "Where are FastAPI's interactive docs?", options: ["/help", "/docs", "/api", "/swagger.json only"], answer: 1, why: "Generated automatically at /docs." },
    ],
  },
];

export const postgres = [
  {
    id: "a-sql-indexes", title: "Indexes and EXPLAIN", minutes: 30,
    goal: "Make slow queries fast with indexes, and read a query plan.",
    body: [
      "Without an index, Postgres reads **every row** to find matches (a **Seq Scan**). An index is a sorted lookup structure, like a book's index, that jumps straight to matching rows.",
      "`EXPLAIN ANALYZE SELECT ...` shows the plan Postgres chose and the real time each step took.",
      "Index the columns you **filter, join and sort** on often, such as foreign keys and email lookups. Primary keys and UNIQUE columns are indexed automatically.",
      "Indexes aren't free: they use space and slow down writes slightly. Don't index everything.",
    ],
    example: { lang: "sql", run: "sql", code:
`CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  kind TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO events (user_id, kind)
SELECT (random() * 5000)::int, (ARRAY['view','click','buy'])[1 + (random() * 2)::int]
FROM generate_series(1, 50000);
ANALYZE events;

EXPLAIN (COSTS OFF) SELECT * FROM events WHERE user_id = 42;

CREATE INDEX events_user_id_idx ON events (user_id);

EXPLAIN (COSTS OFF) SELECT * FROM events WHERE user_id = 42;`,
      output: "" },
    demo: [
      { lines: [8, 9, 10, 11], say: "50,000 fake events for 5,000 users. ANALYZE updates the statistics the planner uses." },
      { lines: [13], say: "No index: Postgres must read every row.", out: "Seq Scan on events\n  Filter: (user_id = 42)" },
      { lines: [15], say: "Add an index on the column we filter by." },
      { lines: [17], say: "Now it looks up the matching rows directly.", out: "Bitmap Heap Scan on events\n  -> Bitmap Index Scan on events_user_id_idx" },
    ],
    practice: { task: "Which index helps `SELECT * FROM events WHERE user_id = 42 ORDER BY created_at DESC LIMIT 20`?",
      hint: "One index can cover both the filter and the sort.",
      solution: { lang: "sql", run: "sql", setup: "CREATE TABLE events (id SERIAL PRIMARY KEY, user_id INTEGER, created_at TIMESTAMPTZ DEFAULT now());",
        code: "CREATE INDEX events_user_recent_idx ON events (user_id, created_at DESC);",
        output: "CREATE INDEX" } },
    check: [
      { q: "What does a Seq Scan mean?", options: ["Index used", "Every row is read", "Query cached", "Rows sorted"], answer: 1, why: "A sequential scan reads the whole table." },
      { q: "A cost of adding indexes?", options: ["Slower reads", "Extra storage and slightly slower writes", "Data loss", "None"], answer: 1, why: "Every insert or update must also update the index." },
    ],
  },
  {
    id: "a-sql-transactions", title: "Transactions", minutes: 25,
    goal: "Group changes so they all succeed or all fail together.",
    body: [
      "A **transaction** wraps several statements: `BEGIN; ... COMMIT;`. If anything goes wrong, `ROLLBACK` undoes everything since BEGIN.",
      "Classic example: a transfer must take money from one account **and** add it to another. Half a transfer is a disaster.",
      "Postgres guarantees **ACID**: Atomic (all or nothing), Consistent (constraints hold), Isolated (others don't see half-done work), Durable (committed means saved).",
      "In Node with `pg`, take one client from the pool, run BEGIN, your queries and COMMIT on that **same client**, and ROLLBACK in `catch`.",
    ],
    example: { lang: "sql", run: "sql", code:
`CREATE TABLE accounts (
  id INTEGER PRIMARY KEY,
  owner TEXT NOT NULL,
  balance NUMERIC(10,2) NOT NULL CHECK (balance >= 0)
);
INSERT INTO accounts VALUES (1, 'ana', 100), (2, 'bo', 20);

BEGIN;
UPDATE accounts SET balance = balance - 30 WHERE id = 1;
UPDATE accounts SET balance = balance + 30 WHERE id = 2;
COMMIT;

BEGIN;
UPDATE accounts SET balance = balance + 500 WHERE id = 2;
SELECT balance FROM accounts WHERE id = 1;
ROLLBACK;

SELECT owner, balance FROM accounts ORDER BY id;`,
      output: "" },
    demo: [
      { lines: [4], say: "A CHECK constraint: balances can never go negative." },
      { lines: [8, 9, 10, 11], say: "Both updates commit together. Ana has 70 and Bo has 50." },
      { lines: [13, 14], say: "Start a transfer that's too big..." },
      { lines: [15], say: "...but Ana only has 70. (Taking 500 would also break the CHECK and abort the transaction.)", out: " balance\n---------\n   70.00" },
      { lines: [16], say: "Roll back: Bo's +500 is undone as if it never happened." },
      { lines: [18], say: "Only the first transfer happened.", out: "ana | 70.00\nbo  | 50.00" },
    ],
    practice: { task: "Write the Node.js version of a transfer with pg, using one client and ROLLBACK on error.",
      hint: "`const client = await pool.connect()` … `finally { client.release() }`",
      solution: { lang: "js", run: "check", code:
`async function transfer(pool, from, to, amount) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("UPDATE accounts SET balance = balance - $1 WHERE id = $2", [amount, from]);
    await client.query("UPDATE accounts SET balance = balance + $1 WHERE id = $2", [amount, to]);
    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}` } },
    check: [
      { q: "What does ROLLBACK do?", options: ["Deletes the table", "Undoes everything since BEGIN", "Undoes only the last statement", "Restarts the server"], answer: 1, why: "All or nothing." },
      { q: "Why use one client for the whole transaction?", options: ["Speed", "A transaction belongs to one connection", "Required by SQL syntax", "Security"], answer: 1, why: "Queries on other pool connections aren't in the transaction." },
    ],
  },
  {
    id: "a-sql-design", title: "Schema design, normalization and migrations", minutes: 30,
    goal: "Design tables that avoid duplicate data, and change schemas safely over time.",
    body: [
      "**Normalization** means storing each fact once. If an author's name is copied into every book row, renaming them means updating many rows, and missing one causes contradictions.",
      "**Many-to-many** relationships (books ↔ tags) need a **join table** with two foreign keys and a composite primary key.",
      "**Denormalize on purpose** only when reads are slow and measured, and keep the copy in sync.",
      "**Migrations** are versioned SQL files (`001_create_books.sql`, `002_add_tags.sql`) applied in order, checked into git. Tools: node-pg-migrate, Prisma Migrate, Drizzle Kit. Never edit a migration that has already run in production; add a new one.",
    ],
    example: { lang: "sql", run: "sql", code:
`-- 001_create_books.sql
CREATE TABLE authors (id SERIAL PRIMARY KEY, name TEXT NOT NULL);
CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  author_id INTEGER NOT NULL REFERENCES authors(id)
);

-- 002_add_tags.sql
CREATE TABLE tags (id SERIAL PRIMARY KEY, name TEXT NOT NULL UNIQUE);
CREATE TABLE book_tags (
  book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,
  tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (book_id, tag_id)
);

INSERT INTO authors (name) VALUES ('Octavia Butler');
INSERT INTO books (title, author_id) VALUES ('Kindred', 1), ('Dawn', 1);
INSERT INTO tags (name) VALUES ('sci-fi'), ('classic');
INSERT INTO book_tags VALUES (1, 1), (1, 2), (2, 1);

SELECT t.name, COUNT(*) AS books
FROM tags t JOIN book_tags bt ON bt.tag_id = t.id
GROUP BY t.name ORDER BY books DESC;`,
      output: "" },
    demo: [
      { lines: [1, 2, 3, 4, 5, 6, 7], say: "Migration 1: the author's name is stored once; books point to it." },
      { lines: [9, 10, 11, 12, 13, 14, 15], say: "Migration 2 adds tags. A book has many tags, and a tag has many books: a join table." },
      { lines: [14], say: "The composite primary key stops the same tag being added to a book twice." },
      { lines: [20], say: "Kindred is sci-fi and classic; Dawn is sci-fi." },
      { lines: [22, 23, 24], say: "Count books per tag through the join table.", out: "sci-fi | 2\nclassic | 1" },
    ],
    practice: { task: "A `students` table has columns course1, course2, course3. What's wrong, and what's the better design?",
      hint: "What happens with a fourth course?",
      solution: { lang: "sql", run: "sql", code: "CREATE TABLE students (id SERIAL PRIMARY KEY, name TEXT NOT NULL);\nCREATE TABLE courses (id SERIAL PRIMARY KEY, title TEXT NOT NULL);\nCREATE TABLE enrollments (\n  student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,\n  course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,\n  PRIMARY KEY (student_id, course_id)\n);",
        output: "CREATE TABLE\nCREATE TABLE\nCREATE TABLE" } },
    check: [
      { q: "Many-to-many needs…", options: ["Two foreign keys in one table", "A join table", "An array column", "A JSON column"], answer: 1, why: "A join table holds one row per pair." },
      { q: "A migration already ran in production and has a bug. You should…", options: ["Edit it", "Write a new migration that fixes it", "Delete the table", "Ignore it"], answer: 1, why: "Migrations are history; add, don't rewrite." },
    ],
  },
];
