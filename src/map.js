// Course map: every module, and the Intermediate + Advanced outlines.
// Beginner lessons live in the lessons-*.js files.

export const tiers = [
  { id: "beginner", name: "Beginner", blurb: "Core syntax and your first working pages, scripts, servers and queries." },
  { id: "intermediate", name: "Intermediate", blurb: "Real app patterns: state, data fetching, auth, relational data and testing in depth." },
  { id: "advanced", name: "Advanced", blurb: "Performance, architecture, security, deployment and senior-level interview prep." },
];

// order = suggested learning order
export const modules = [
  { id: "html", name: "HTML5", kind: "Language", lang: "html",
    blurb: "The structure and meaning of every web page.",
    docs: [{ label: "MDN: HTML", url: "https://developer.mozilla.org/en-US/docs/Web/HTML" }],
    video: "HTML tutorial for beginners",
    intermediate: ["Accessible forms: fieldset, legend, error messages", "Tables done right", "Media: video, audio, picture and srcset", "SEO and metadata: title, description, Open Graph", "Native dialog and details elements"],
    advanced: ["ARIA patterns and when not to use ARIA", "Web Components and the template element", "Performance: loading=lazy, preload, fetchpriority", "Microdata and structured data"] },

  { id: "css", name: "CSS3", kind: "Language", lang: "css",
    blurb: "Layout, color, type and motion for the page.",
    docs: [{ label: "MDN: CSS", url: "https://developer.mozilla.org/en-US/docs/Web/CSS" }],
    video: "CSS tutorial for beginners",
    intermediate: ["CSS Grid layouts", "Custom properties (variables) and theming", "Transitions and keyframe animations", "Positioning: relative, absolute, fixed, sticky", "Responsive units: rem, %, vw, clamp()"],
    advanced: ["Cascade layers and specificity strategy", "Container queries", "Animation performance: transform, opacity, will-change", "Design tokens and a small design system", "Dark mode with prefers-color-scheme"] },

  { id: "js", name: "JavaScript", kind: "Language", lang: "js",
    blurb: "The programming language of the browser (and Node.js).",
    docs: [{ label: "MDN: JavaScript Guide", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide" }],
    video: "JavaScript tutorial for beginners",
    intermediate: ["Objects, destructuring and spread", "Array methods: reduce, find, some, every, sort", "Promises and async/await in depth", "Modules: import and export", "Error handling with try/catch/finally", "Closures and scope"],
    advanced: ["The event loop, microtasks and timers", "Prototypes and classes", "Debounce, throttle and memoization", "Iterators and generators", "Memory leaks and cleanup"] },

  { id: "apis", name: "Working with APIs", kind: "Skill", lang: "js", libs: ["fetch", "axios"],
    blurb: "Talk to servers: HTTP, JSON, fetch and axios.",
    docs: [{ label: "MDN: Using Fetch", url: "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch" }, { label: "axios docs", url: "https://axios-http.com/docs/intro" }],
    video: "fetch API and axios tutorial",
    intermediate: ["Query params, headers and POST bodies", "Loading, error and empty states in the UI", "API keys and environment variables", "Pagination and load-more", "axios instances and interceptors"],
    advanced: ["Cancelling requests with AbortController", "Retries with backoff", "Caching and stale-while-revalidate", "CORS explained", "Rate limits and designing around them"] },

  { id: "ts", name: "TypeScript", kind: "Language", lang: "ts",
    blurb: "JavaScript with types, so mistakes show up before you run the code.",
    docs: [{ label: "TypeScript Handbook", url: "https://www.typescriptlang.org/docs/handbook/intro.html" }],
    video: "TypeScript tutorial for beginners",
    intermediate: ["Union types and narrowing", "Generics", "Typing React props, state and events", "Type vs interface", "Typing API responses"],
    advanced: ["Utility types: Partial, Pick, Omit, Record", "Discriminated unions", "Mapped and conditional types", "Strict mode and tsconfig", "Runtime validation with schemas"] },

  { id: "tailwind", name: "Tailwind CSS", kind: "Library", lang: "html",
    blurb: "Style with small utility classes right in your markup.",
    docs: [{ label: "Tailwind docs", url: "https://tailwindcss.com/docs" }],
    video: "Tailwind CSS tutorial for beginners",
    intermediate: ["Flex and grid layouts with utilities", "Theme customization with @theme", "Dark mode and custom variants", "Reusing styles: components vs @apply", "Arbitrary values"],
    advanced: ["Building a design system on Tailwind", "Animation utilities and keyframes", "Plugins and custom utilities", "Keeping class lists maintainable"] },

  { id: "react", name: "React", kind: "Library", lang: "jsx",
    blurb: "Build interfaces from reusable components.",
    docs: [{ label: "react.dev: Learn", url: "https://react.dev/learn" }],
    video: "React tutorial for beginners",
    intermediate: ["useEffect and cleanup", "Forms and controlled inputs", "Lifting state up", "Context for shared state", "Custom hooks", "Fetching data in components"],
    advanced: ["useReducer and state machines", "Performance: memo, useMemo, useCallback", "Refs and imperative APIs", "Portals and modals", "Global state: Redux Toolkit", "Suspense and error boundaries"] },

  { id: "next", name: "Next.js", kind: "Framework", lang: "jsx",
    blurb: "A React framework with routing, server rendering and deployment built in.",
    docs: [{ label: "Next.js Learn", url: "https://nextjs.org/learn" }],
    video: "Next.js app router tutorial for beginners",
    intermediate: ["Dynamic routes: [id]", "Fetching data in server components", "loading.js, error.js and not-found.js", "next/image and next/font", "Route handlers (API routes)"],
    advanced: ["Caching and revalidation", "Server actions", "Middleware and auth", "Metadata and SEO", "Deploying to Vercel and environment variables"] },

  { id: "python", name: "Python", kind: "Language", lang: "python",
    blurb: "A readable general-purpose language for scripts, data and back ends.",
    docs: [{ label: "The Python Tutorial", url: "https://docs.python.org/3/tutorial/" }],
    video: "Python tutorial for beginners",
    intermediate: ["Files and JSON", "Modules, packages and virtual environments", "Classes and objects", "Error handling", "Calling APIs with requests"],
    advanced: ["Comprehensions and generators", "Decorators", "Type hints", "A small web API with FastAPI or Flask", "Testing with pytest fixtures"] },

  { id: "postgres", name: "PostgreSQL", kind: "Database", lang: "sql",
    blurb: "Store and query data in tables with SQL.",
    docs: [{ label: "PostgreSQL Tutorial", url: "https://www.postgresql.org/docs/current/tutorial.html" }],
    video: "PostgreSQL tutorial for beginners",
    intermediate: ["Primary and foreign keys", "JOINs: inner and left", "GROUP BY and aggregates", "Constraints: NOT NULL, UNIQUE, CHECK", "Connecting from Node with pg"],
    advanced: ["Indexes and EXPLAIN", "Transactions", "Normalization and schema design", "Migrations", "Preventing SQL injection with parameters"] },

  { id: "express", name: "Express.js", kind: "Framework", lang: "js", libs: ["morgan"],
    blurb: "Build a Node.js web server and API, with morgan for request logging.",
    docs: [{ label: "Express: Hello world", url: "https://expressjs.com/en/starter/hello-world.html" }, { label: "morgan", url: "https://expressjs.com/en/resources/middleware/morgan.html" }],
    video: "Express.js tutorial for beginners",
    intermediate: ["A full CRUD REST API", "Routers and folder structure", "Validation and error-handling middleware", "Connecting Express to PostgreSQL", "CORS and environment variables"],
    advanced: ["Authentication with sessions or JWT", "Security headers and rate limiting", "Logging in production", "Testing APIs with supertest", "Deploying a Node server"] },

  { id: "firebase", name: "Firebase", kind: "Platform", lang: "js",
    blurb: "Google's back end for auth, a database and hosting, without running a server.",
    docs: [{ label: "Firebase: Add to a web app", url: "https://firebase.google.com/docs/web/setup" }],
    video: "Firebase tutorial for beginners web",
    intermediate: ["Google sign-in and auth state", "Firestore queries: where, orderBy, limit", "Real-time listeners with onSnapshot", "Security rules basics", "Using Firebase with React"],
    advanced: ["Data modeling in Firestore", "Cloud Functions", "Storage for file uploads", "Extensions (e.g. Stripe payments)", "Emulators for local testing"] },

  { id: "testing", name: "Writing Tests", kind: "Skill", lang: "js",
    blurb: "Prove your code works, and keep it working: Vitest, React Testing Library and pytest.",
    docs: [{ label: "Vitest guide", url: "https://vitest.dev/guide/" }, { label: "React Testing Library", url: "https://testing-library.com/docs/react-testing-library/intro/" }, { label: "pytest: Get started", url: "https://docs.pytest.org/en/stable/getting-started.html" }],
    video: "JavaScript unit testing tutorial for beginners",
    intermediate: ["Testing async code and mocked fetch", "User events: typing and clicking", "Testing custom hooks", "Test coverage and what it means", "pytest fixtures and parametrize"],
    advanced: ["Integration tests for APIs (supertest)", "End-to-end tests with Playwright", "Test-driven development (TDD)", "Testing in CI with GitHub Actions", "Mocking strategy: what not to mock"] },

  { id: "interview", name: "Interview Prep", kind: "Career", lang: "js",
    blurb: "The coding tests and questions junior developers get asked most.",
    docs: [{ label: "MDN: JavaScript reference", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference" }],
    video: "junior frontend developer interview questions",
    intermediate: ["Two pointers and sliding window", "Hash maps for counting", "Recursion basics", "Build a component live: tabs, accordion, modal", "Explaining your projects (STAR)"],
    advanced: ["Big-O analysis", "Trees and graphs: BFS and DFS", "Frontend system design", "Debouncing a search input live", "Behavioral questions and salary talk"] },
];

// Practice projects for the upper tiers (shown as outlines)
export const tierProjects = {
  intermediate: [
    { title: "Movie search app", uses: ["React", "APIs", "Tailwind", "Testing"], brief: "Search an open movie API, show loading and error states, paginate results, test the search box.",
      steps: ["Get a free TMDB API token and keep it in .env.local", "A Next.js route handler that calls TMDB with the secret token", "A debounced search box (client component) that calls your route", "Loading, error, empty and results states", "Load more pagination", "Tests: mock fetch, type a query, assert the results and the error state"],
      test: ["The token never appears in the browser's Network tab", "Typing fast sends one request, not one per key", "Offline shows a friendly error with Retry", "npm test passes"] },
    { title: "Notes API + database", uses: ["Express", "PostgreSQL", "morgan"], brief: "A full CRUD API for notes stored in Postgres, with logging and validation.",
      steps: ["Create the notes table with constraints", "Express app with morgan, json, cors and a notes Router", "GET, GET one, POST, PATCH, DELETE with parameterized queries", "Validation middleware and one error handler", "Settings in .env, loaded with --env-file"],
      test: ["Every route returns the right status (200, 201, 204, 400, 404)", "A title with a quote (') saves correctly (proof there's no SQL injection)", "Stopping the database gives a 500 with a safe message"] },
    { title: "Auth-protected dashboard", uses: ["Next.js", "Firebase", "TypeScript"], brief: "Sign in with Firebase, store per-user data in Firestore, protect pages from logged-out users.",
      steps: ["Next.js + TypeScript project with Firebase config in env vars", "AuthProvider with Google sign-in and a loading state", "A useMyItems hook with onSnapshot", "Add, edit and delete items", "Security Rules so users only see their own items"],
      test: ["Signed-out users never see a flash of the dashboard", "User B can't read user A's items, even from the console", "tsc --noEmit is clean"] },
  ],
  advanced: [
    { title: "Full-stack e-commerce", uses: ["Next.js", "PostgreSQL", "TypeScript", "Testing"], brief: "Products from a database, a cart, checkout with Stripe test mode, end-to-end tests.",
      steps: ["Schema: products, orders and order_items with constraints, an index on products(category), seeded with 20 products", "Next.js + TypeScript: product list and detail pages as Server Components reading Postgres (parameterized queries)", "A cart in a client component with useReducer, saved to localStorage", "A Server Action that validates the cart with zod and creates a Stripe Checkout Session in test mode", "A Stripe webhook route that marks the order paid inside a transaction", "Playwright: browse, add two items, check out with Stripe's test card, see the success page"],
      test: ["Prices come from the database at checkout, never from the browser", "Paying twice for the same session doesn't create two orders", "EXPLAIN shows the category index being used", "The Playwright journey passes in CI"] },
    { title: "Real-time chat", uses: ["React", "Firebase", "Tailwind"], brief: "Rooms, live messages with onSnapshot, presence, security rules.",
      steps: ["Data model: rooms/{roomId} and rooms/{roomId}/messages with authorName denormalized", "Google sign-in and a room list", "Live messages with onSnapshot, ordered by createdAt, newest 50", "A message box that sends with serverTimestamp; auto-scroll that respects users reading older messages", "Presence: write lastSeen every minute and show who's online", "Security Rules + emulator tests: only signed-in users read; you can only send as yourself"],
      test: ["Two browsers see each other's messages within a second", "A message can't be sent with someone else's uid (rules test proves it)", "The layout works at 390px wide with the keyboard open", "Unsubscribes on room change (no duplicate messages)"] },
    { title: "Data pipeline + API", uses: ["Python", "PostgreSQL", "Express"], brief: "A Python script cleans a CSV into Postgres, an Express API serves it, with tests on both sides.",
      steps: ["Pick a public CSV (e.g. city open data) and write a cleaning function: trim, fix types, drop duplicates", "pytest tests for the cleaning rules, using a small fixture CSV", "Load into Postgres inside one transaction (all rows or none), with a unique constraint to make re-runs safe", "Express API: list with filters and cursor pagination, plus one summary route using GROUP BY", "helmet, rate limiting, /healthz and JSON logs", "supertest integration tests against a test database"],
      test: ["Running the loader twice doesn't duplicate rows", "A malformed row is reported, not silently dropped", "Pagination never repeats or skips a row", "pytest and npm test both pass in GitHub Actions"] },
  ],
};
