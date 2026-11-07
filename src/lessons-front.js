// Beginner lessons: Working with APIs, TypeScript, Tailwind, React, Next.js
// run values: "node" runs and compares output, "ts" type-checks and runs, "check" syntax-checks only

export const apis = {
  lessons: [
    {
      id: "api-what", title: "What an API is: HTTP and JSON", minutes: 20,
      goal: "Read an HTTP request and response and parse JSON.",
      diagram: "http-cycle",
      body: [
        "An **API** is a way for one program to ask another for data or actions. On the web, that conversation happens over **HTTP**.",
        "Your code sends a **request**: a **method** (`GET` to read, `POST` to create, `PUT`/`PATCH` to update, `DELETE` to remove) and a **URL** (the endpoint). The server sends back a **response** with a **status code** and usually a **JSON** body.",
        "Status codes in short: **2xx** worked (200 OK, 201 Created), **4xx** your request was wrong (400 Bad Request, 401 not logged in, 404 Not Found), **5xx** the server broke.",
        "**JSON** is text shaped like JavaScript objects. `JSON.parse` turns text into an object, and `JSON.stringify` turns an object into text.",
      ],
      example: { lang: "js", run: "node", code:
`const text = '{"id": 1, "name": "Leanne", "tags": ["admin"]}';

const user = JSON.parse(text);
console.log(user.name, user.tags[0]);

const body = JSON.stringify({ title: "Hello", done: false });
console.log(body);
console.log(typeof text, typeof user);`,
        output: "Leanne admin\n{\"title\":\"Hello\",\"done\":false}\nstring object" },
      demo: [
        { lines: [1], say: "This is what a response body looks like: plain text in JSON format." },
        { lines: [3, 4], say: "JSON.parse turns it into a real object you can read.", out: "Leanne admin" },
        { lines: [6, 7], say: "JSON.stringify turns an object into text, ready to send in a POST body.", out: "{\"title\":\"Hello\",\"done\":false}" },
        { lines: [8], say: "Text in, object out.", out: "string object" },
      ],
      practice: { task: "Which method and status would you expect when: (a) loading a user profile, (b) creating a new post, (c) asking for a user that doesn't exist?",
        hint: "Think: read, create, not found.",
        solution: { lang: "text", code: "(a) GET → 200 OK\n(b) POST → 201 Created\n(c) GET → 404 Not Found" } },
      check: [
        { q: "Which status means the server crashed?", options: ["200", "404", "401", "500"], answer: 3, why: "5xx codes are server errors." },
        { q: "Which method creates a new resource?", options: ["GET", "POST", "DELETE", "HEAD"], answer: 1, why: "POST creates." },
      ],
    },
    {
      id: "api-fetch", title: "fetch with async/await", minutes: 25,
      goal: "Request data with fetch, check for errors, and use the JSON.",
      body: [
        "`fetch(url)` returns a **Promise**: a value that arrives later. `await` pauses the function until it arrives. You can only use `await` inside an `async` function (or at the top level of a module).",
        "**fetch does not throw on 404 or 500.** It only throws when the network fails. Always check `response.ok` yourself.",
        "`await response.json()` reads and parses the body.",
        "Wrap it all in `try/catch` so one failed request doesn't crash your app.",
      ],
      example: { lang: "js", run: "check", code:
`async function getUser(id) {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users/" + id);
    if (!response.ok) {
      throw new Error("Request failed: " + response.status);
    }
    const user = await response.json();
    return user;
  } catch (error) {
    console.error(error.message);
    return null;
  }
}

getUser(1).then((user) => console.log(user?.name));` },
      demo: [
        { lines: [1], say: "`async` lets this function use `await`." },
        { lines: [3], say: "Send a GET request and wait for the response." },
        { lines: [4, 5, 6], say: "fetch won't throw on 404, so check `ok` yourself and throw." },
        { lines: [7, 8], say: "Read the JSON body and return it." },
        { lines: [9, 10, 11], say: "Network or status errors land here. Return null so callers can handle it." },
        { lines: [15], say: "An async function returns a Promise, so use .then() or await to get the value.", out: "Leanne Graham" },
      ],
      practice: { task: "Write `getTodos()` that fetches https://jsonplaceholder.typicode.com/todos?_limit=5 and returns only the titles.",
        hint: "After `response.json()`, use `.map((t) => t.title)`.",
        solution: { lang: "js", run: "check", code:
`async function getTodos() {
  const res = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=5");
  if (!res.ok) throw new Error("HTTP " + res.status);
  const todos = await res.json();
  return todos.map((t) => t.title);
}` } },
      check: [
        { q: "fetch gets a 404 response. What happens?", options: ["It throws", "It resolves with ok: false", "It returns null", "It retries"], answer: 1, why: "fetch only rejects on network failure. Check response.ok." },
        { q: "Where can you use await?", options: ["Anywhere", "Inside async functions (or module top level)", "Only in loops", "Only with fetch"], answer: 1, why: "await needs an async context." },
      ],
    },
    {
      id: "api-axios", title: "axios: a friendlier HTTP client", minutes: 20,
      goal: "Make GET and POST requests with axios and handle its errors.",
      body: [
        "**axios** is a popular library that wraps HTTP requests. Install it with `npm install axios`.",
        "Differences from fetch: axios **parses JSON for you** (it's in `response.data`), and it **throws on 4xx and 5xx** responses, so `try/catch` catches HTTP errors too.",
        "`params` builds the query string for you, and the second argument to `axios.post` is the body, sent as JSON.",
        "Both work. fetch needs no install. axios saves boilerplate and adds features like interceptors.",
      ],
      example: { lang: "js", run: "check", code:
`import axios from "axios";

const api = "https://jsonplaceholder.typicode.com";

async function demo() {
  try {
    const { data: posts } = await axios.get(api + "/posts", {
      params: { userId: 1, _limit: 3 },
    });
    console.log(posts.length);

    const { data: created } = await axios.post(api + "/posts", {
      title: "Hi", body: "First post", userId: 1,
    });
    console.log(created.id);
  } catch (error) {
    console.error(error.response?.status, error.message);
  }
}
demo();` },
      demo: [
        { lines: [1], say: "Import axios after installing it." },
        { lines: [7, 8, 9], say: "`params` becomes `?userId=1&_limit=3`. The parsed JSON is in `data`." },
        { lines: [10], say: "Three posts came back.", out: "3" },
        { lines: [12, 13, 14], say: "The second argument is the request body, sent as JSON automatically." },
        { lines: [15], say: "The fake API answers with the new id.", out: "101" },
        { lines: [16, 17], say: "axios throws on 4xx and 5xx, and `error.response.status` has the code." },
      ],
      practice: { task: "Rewrite your getTodos() from the fetch lesson with axios.",
        hint: "No `.ok` check and no `.json()` needed.",
        solution: { lang: "js", run: "check", code:
`import axios from "axios";

async function getTodos() {
  const { data } = await axios.get("https://jsonplaceholder.typicode.com/todos", {
    params: { _limit: 5 },
  });
  return data.map((t) => t.title);
}` } },
      check: [
        { q: "Where is the parsed body in an axios response?", options: ["response.body", "response.json()", "response.data", "response.text"], answer: 2, why: "axios puts the parsed JSON in response.data." },
        { q: "axios gets a 500. What happens?", options: ["Resolves normally", "Throws (rejects)", "Returns null", "Retries"], answer: 1, why: "axios rejects for status codes outside 2xx." },
      ],
    },
  ],
  project: { title: "Random user card", brief: "Fetch a random person from the free randomuser.me API and show their photo, name and city in a card, with a New person button, a loading message and an error message.",
    steps: ["HTML card plus a button", "async function loadUser() with fetch or axios", "Show 'Loading…' while waiting", "Fill in the card from the JSON", "Show a friendly error when offline"],
    test: ["Turn off Wi-Fi: an error message appears, not a blank card", "The button is disabled while loading", "The photo has alt text with the person's name"] },
};

export const ts = {
  lessons: [
    {
      id: "ts-basics", title: "Why TypeScript, and basic types", minutes: 25,
      goal: "Add type annotations and read a type error.",
      body: [
        "TypeScript is JavaScript plus **types**. A checker reads your code **before** it runs and flags mistakes like passing a string where a number is expected.",
        "Annotate with a colon: `let age: number = 30;`. Often you don't need to, because TypeScript **infers** the type from the value.",
        "Basic types: `string`, `number`, `boolean`, arrays like `string[]`, and `any` (switches checking off, so avoid it).",
        "A **union** like `string | null` means \"one of these\".",
        "TypeScript files end in `.ts` (or `.tsx` with JSX). They're compiled to plain JavaScript.",
      ],
      example: { lang: "ts", run: "ts", code:
`let username: string = "maya";
let points = 40;
const tags: string[] = ["new", "trial"];

function addPoints(current: number, extra: number): number {
  return current + extra;
}

points = addPoints(points, 10);
let nickname: string | null = null;
nickname = "May";

console.log(username, points, tags.length, nickname);
// addPoints("40", 10);  <- error: Argument of type 'string' is not assignable to parameter of type 'number'.`,
        output: "maya 50 2 May" },
      demo: [
        { lines: [1], say: "An explicit annotation: username must be a string." },
        { lines: [2], say: "No annotation needed: TypeScript infers number from 40." },
        { lines: [3], say: "An array of strings." },
        { lines: [5, 6, 7], say: "Parameters and the return value are typed." },
        { lines: [10, 11], say: "A union: nickname can be a string or null." },
        { lines: [13], say: "Runs like normal JavaScript.", out: "maya 50 2 May" },
        { lines: [14], say: "Uncomment this and the checker stops you before the code ever runs." },
      ],
      practice: { task: "Type a function `formatPrice(amount: number, currency: string): string` that returns e.g. \"$12.50\" when currency is \"$\".",
        hint: "Use `amount.toFixed(2)`.",
        solution: { lang: "ts", run: "ts", code:
`function formatPrice(amount: number, currency: string): string {
  return currency + amount.toFixed(2);
}
console.log(formatPrice(12.5, "$"));`, output: "$12.50" } },
      check: [
        { q: "What does `any` do?", options: ["Allows any number", "Turns off type checking for that value", "Means null", "Is the same as unknown"], answer: 1, why: "any skips checking, so avoid it when you can." },
        { q: "When does TypeScript catch type errors?", options: ["At runtime", "Before running, during type checking", "Never", "Only in the browser"], answer: 1, why: "Type checking happens before the code runs." },
      ],
    },
    {
      id: "ts-objects", title: "Typing objects with interfaces", minutes: 25,
      goal: "Describe object shapes with interfaces and optional properties.",
      body: [
        "An **interface** describes the shape of an object: which properties it has and their types.",
        "A `?` marks a property as **optional**: `bio?: string`.",
        "`readonly` stops a property being changed after creation.",
        "Interfaces make editor autocomplete work, and they catch typos like `user.emial`.",
      ],
      example: { lang: "ts", run: "ts", code:
`interface User {
  readonly id: number;
  name: string;
  email: string;
  bio?: string;
}

function greet(user: User): string {
  const extra = user.bio ? " (" + user.bio + ")" : "";
  return "Hi " + user.name + extra;
}

const u: User = { id: 1, name: "Rae", email: "rae@example.com" };
const users: User[] = [u, { id: 2, name: "Lu", email: "lu@example.com", bio: "Designer" }];

console.log(users.map(greet));`,
        output: "[ 'Hi Rae', 'Hi Lu (Designer)' ]" },
      demo: [
        { lines: [1, 2, 3, 4, 5, 6], say: "The User shape: id can't be changed, and bio is optional." },
        { lines: [8], say: "greet only accepts objects with this shape." },
        { lines: [9], say: "bio may be missing, so check it before using it." },
        { lines: [13], say: "Valid with no bio, because it's optional." },
        { lines: [14], say: "An array of User objects." },
        { lines: [16], say: "map passes each user to greet.", out: "[ 'Hi Rae', 'Hi Lu (Designer)' ]" },
      ],
      practice: { task: "Write a `Product` interface (id, title, price, optional discount) and a function `finalPrice(p: Product): number` that applies the discount percent if there is one.",
        hint: "`p.discount ? p.price * (1 - p.discount / 100) : p.price`",
        solution: { lang: "ts", run: "ts", code:
`interface Product { id: number; title: string; price: number; discount?: number; }
function finalPrice(p: Product): number {
  return p.discount ? p.price * (1 - p.discount / 100) : p.price;
}
console.log(finalPrice({ id: 1, title: "Lamp", price: 40, discount: 25 }));`, output: "30" } },
      check: [
        { q: "What does `bio?: string` mean?", options: ["bio is required", "bio may be missing", "bio can be any type", "bio is a function"], answer: 1, why: "? makes the property optional." },
        { q: "What does readonly prevent?", options: ["Reading the value", "Changing it after creation", "Deleting the object", "Typing it"], answer: 1, why: "readonly blocks reassignment." },
      ],
    },
  ],
  project: { title: "Typed tip calculator", brief: "Convert your JavaScript tip calculator to TypeScript: add a `SplitResult` interface, type every function, and fix every error the checker finds.",
    steps: ["Rename .js to .ts", "Add an interface for the result", "Type calcSplit's parameters and return value", "Handle the null from querySelector with a check", "Run tsc --noEmit until it's clean"],
    test: ["tsc --noEmit prints no errors", "Passing a string to calcSplit is a type error"] },
};

export const tailwind = {
  lessons: [
    {
      id: "tw-utilities", title: "Utility classes and setup", minutes: 20,
      goal: "Style an element entirely with Tailwind utility classes.",
      body: [
        "Tailwind gives you small single-purpose classes: `p-4` (padding), `text-xl` (font size), `bg-sky-400` (background), `rounded-lg` (corners). You combine them in your HTML instead of writing CSS.",
        "The spacing scale steps by 4px: `p-1` is 4px, `p-4` is 16px, `p-8` is 32px.",
        "Colors use a name and a shade: `bg-red-500`, `text-yellow-300`. Lower numbers are lighter.",
        "Setup in a Vite or Next.js project (Tailwind v4): install `tailwindcss` and its plugin, then add `@import \"tailwindcss\";` to your main CSS file. Next.js's create-next-app can set it up for you.",
      ],
      example: { lang: "html", code:
`<div class="max-w-sm mx-auto p-6 bg-white rounded-xl shadow-md">
  <h2 class="text-xl font-bold text-sky-600">Weekend Sale</h2>
  <p class="mt-2 text-gray-600">Everything 20% off until Sunday.</p>
  <button class="mt-4 px-4 py-2 bg-yellow-400 text-black font-semibold rounded-lg">
    Shop now
  </button>
</div>` },
      demo: [
        { lines: [1], say: "Max width, centered, 24px padding, white background, rounded corners, a soft shadow." },
        { lines: [2], say: "A large, bold, sky-blue heading." },
        { lines: [3], say: "8px of space above, gray body text." },
        { lines: [4], say: "Horizontal and vertical padding, a yellow background, bold text, rounded corners." },
      ],
      practice: { task: "Style a red alert box: light red background, dark red text, 16px padding, rounded corners and a left border.",
        hint: "Try `bg-red-100 text-red-800 p-4 rounded border-l-4 border-red-500`.",
        solution: { lang: "html", code:
`<div class="bg-red-100 text-red-800 p-4 rounded border-l-4 border-red-500">
  Your session has expired.
</div>` } },
      check: [
        { q: "How many pixels is p-4?", options: ["4px", "8px", "16px", "40px"], answer: 2, why: "Each step is 4px, so 4 × 4 = 16px." },
        { q: "Which is lighter?", options: ["bg-sky-200", "bg-sky-800", "They're the same", "Depends on the theme"], answer: 0, why: "Lower shade numbers are lighter." },
      ],
    },
    {
      id: "tw-responsive", title: "Responsive design and states", minutes: 25,
      goal: "Use breakpoint and state prefixes like md: and hover:.",
      body: [
        "Prefix a class with a breakpoint to apply it only from that width up: `md:flex-row` means \"from 768px up\". Tailwind is mobile-first, so un-prefixed classes are the phone styles.",
        "Breakpoints: `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px.",
        "State prefixes apply on interaction: `hover:`, `focus-visible:`, `disabled:`. Always give keyboard users a `focus-visible:` style.",
        "`dark:` applies when the user's system is in dark mode.",
      ],
      example: { lang: "html", code:
`<nav class="flex flex-col gap-2 md:flex-row md:justify-between md:items-center p-4">
  <a href="/" class="text-2xl font-bold">Logo</a>
  <div class="flex gap-4">
    <a href="/about" class="hover:text-sky-500 focus-visible:outline-2 focus-visible:outline-sky-500">About</a>
    <a href="/shop" class="hover:text-sky-500 focus-visible:outline-2 focus-visible:outline-sky-500">Shop</a>
  </div>
  <button class="bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white px-3 py-1 rounded" disabled>
    Sold out
  </button>
</nav>` },
      demo: [
        { lines: [1], say: "Phones: a stacked column. From md (768px) up: a row with space between and items centered." },
        { lines: [4, 5], say: "Links turn sky blue on hover and show an outline for keyboard focus." },
        { lines: [7], say: "Darker red on hover, and half opacity while disabled." },
      ],
      practice: { task: "Make a 1-column card grid on phones, 2 columns from md, and 3 from lg, with 16px gaps.",
        hint: "`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`",
        solution: { lang: "html", code:
`<section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <article class="p-4 rounded-lg bg-sky-50">One</article>
  <article class="p-4 rounded-lg bg-sky-50">Two</article>
  <article class="p-4 rounded-lg bg-sky-50">Three</article>
</section>` } },
      check: [
        { q: "md:text-lg applies…", options: ["Only below 768px", "From 768px and up", "Only at 768px", "On hover"], answer: 1, why: "Breakpoint prefixes are min-width, so mobile-first." },
        { q: "Which prefix styles keyboard focus without affecting mouse clicks?", options: ["focus:", "focus-visible:", "active:", "hover:"], answer: 1, why: "focus-visible shows when the browser decides focus should be visible, e.g. keyboard navigation." },
      ],
    },
  ],
  project: { title: "Tailwind product page", brief: "Rebuild your landing page with Tailwind only: a responsive navbar, a hero, and a product grid that goes 1 → 2 → 3 columns.",
    steps: ["Set up Tailwind in a Vite or Next.js project", "Navbar with responsive flex classes", "Hero with large type and a CTA", "A product card grid", "Hover and focus-visible states on everything clickable"],
    test: ["No custom CSS file except the @import", "Tab through the page: every link shows an outline", "Check 375px, 768px and 1280px widths"] },
};

export const react = {
  lessons: [
    {
      id: "react-components", title: "Components and JSX", minutes: 25,
      goal: "Write function components that return JSX.",
      diagram: "component-tree",
      body: [
        "A React **component** is a function that returns **JSX**: HTML-like syntax inside JavaScript. Component names start with a **capital letter**.",
        "JSX rules: return **one** parent element (or a fragment `<>...</>`), use `className` instead of `class`, close every tag (`<img />`), and put JavaScript inside `{ }`.",
        "You build a page by nesting components, like `<App>` containing `<Header>` and `<ProductList>`. That's the **component tree**.",
        "Start a project with `npm create vite@latest` (React template) or with Next.js.",
      ],
      example: { lang: "jsx", run: "check", code:
`function Header() {
  return (
    <header className="header">
      <h1>Plant Shop</h1>
    </header>
  );
}

function App() {
  const count = 3;
  return (
    <>
      <Header />
      <p>{count} plants in stock</p>
    </>
  );
}

export default App;` },
      demo: [
        { lines: [1], say: "A component is a capitalized function." },
        { lines: [2, 3, 4, 5, 6], say: "It returns JSX. Note `className`, not `class`." },
        { lines: [10], say: "Normal JavaScript can sit above the return." },
        { lines: [12, 15], say: "A fragment `<>...</>` wraps several elements without adding a div." },
        { lines: [13], say: "Use your component like a tag." },
        { lines: [14], say: "Curly braces put a JavaScript value into the JSX.", out: "3 plants in stock" },
      ],
      practice: { task: "Create a `Footer` component that shows \"© 2026 Plant Shop\" and add it under the paragraph in App.",
        hint: "Same pattern as Header, then `<Footer />` inside the fragment.",
        solution: { lang: "jsx", run: "check", code:
`function Footer() {
  return <footer>© 2026 Plant Shop</footer>;
}

function App() {
  return (
    <>
      <p>3 plants in stock</p>
      <Footer />
    </>
  );
}` } },
      check: [
        { q: "Why must component names be capitalized?", options: ["Style convention only", "React treats lowercase tags as HTML elements", "For TypeScript", "They don't need to be"], answer: 1, why: "`<header>` is HTML; `<Header>` is your component." },
        { q: "In JSX, CSS classes use…", options: ["class", "className", "cssClass", "styleName"], answer: 1, why: "`class` is a reserved word in JavaScript." },
      ],
    },
    {
      id: "react-props", title: "Props: passing data down", minutes: 25,
      goal: "Make components reusable by passing them props.",
      body: [
        "**Props** are a component's inputs, passed like HTML attributes: `<PlantCard name=\"Fern\" price={12} />`.",
        "Inside, props arrive as one object. Destructure them: `function PlantCard({ name, price })`.",
        "Data flows **down**: parents pass props to children. A child never changes its props.",
        "`children` is a special prop: whatever you put between the opening and closing tags.",
      ],
      example: { lang: "jsx", run: "check", code:
`function PlantCard({ name, price, onSale = false }) {
  return (
    <article className="card">
      <h2>{name}</h2>
      <p>\${price}{onSale && " (sale!)"}</p>
    </article>
  );
}

function Panel({ title, children }) {
  return <section><h2>{title}</h2>{children}</section>;
}

export default function App() {
  return (
    <Panel title="Today's plants">
      <PlantCard name="Fern" price={12} />
      <PlantCard name="Cactus" price={8} onSale />
    </Panel>
  );
}` },
      demo: [
        { lines: [1], say: "Destructure the props. onSale defaults to false." },
        { lines: [4], say: "Show the name prop." },
        { lines: [5], say: "`&&` shows \" (sale!)\" only when onSale is true." },
        { lines: [10, 11], say: "children is whatever sits between <Panel> and </Panel>." },
        { lines: [17], say: "Strings in quotes, numbers in braces." },
        { lines: [18], say: "Writing just `onSale` passes true.", out: "Cactus  $8 (sale!)" },
      ],
      practice: { task: "Make a `Badge` component with `label` and `color` props, and render three badges: New, Hot and Sold out.",
        hint: "Use the color in a style or className: `style={{ background: color }}`.",
        solution: { lang: "jsx", run: "check", code:
`function Badge({ label, color }) {
  return <span style={{ background: color, padding: "2px 8px" }}>{label}</span>;
}

export default function App() {
  return (
    <div>
      <Badge label="New" color="skyblue" />
      <Badge label="Hot" color="red" />
      <Badge label="Sold out" color="gold" />
    </div>
  );
}` } },
      check: [
        { q: "Can a child component change its props?", options: ["Yes", "No, props are read-only", "Only strings", "Only with useEffect"], answer: 1, why: "Props come from the parent. To change data, use state." },
        { q: "How do you pass the number 12 as a prop?", options: ["price=\"12\"", "price={12}", "price=12", "price:12"], answer: 1, why: "Braces pass a JavaScript value; quotes pass a string." },
      ],
    },
    {
      id: "react-state", title: "State and events with useState", minutes: 30,
      goal: "Store changing data in state and update it from events.",
      body: [
        "**State** is data a component remembers between renders. `const [count, setCount] = useState(0);` gives you the current value and a setter function.",
        "Calling the setter **re-renders** the component with the new value. Never change state directly (`count++` won't update the screen).",
        "Events use camelCase and receive a function: `onClick={() => setCount(count + 1)}`.",
        "When the new value depends on the old one, pass a function: `setCount((c) => c + 1)`. It always uses the latest value.",
      ],
      example: { lang: "jsx", run: "check", code:
`import { useState } from "react";

export default function LikeButton() {
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  function handleClick() {
    setLikes((n) => (liked ? n - 1 : n + 1));
    setLiked(!liked);
  }

  return (
    <button onClick={handleClick} aria-pressed={liked}>
      {liked ? "♥ Liked" : "♡ Like"} · {likes}
    </button>
  );
}` },
      demo: [
        { lines: [1], say: "Import the hook from React." },
        { lines: [4, 5], say: "Two pieces of state: a number and a boolean." },
        { lines: [8], say: "A functional update: change the count based on the previous one." },
        { lines: [9], say: "Flip liked. React re-renders with both new values." },
        { lines: [13], say: "onClick gets the function itself. aria-pressed tells screen readers it's a toggle." },
        { lines: [14], say: "The label is based on the current state.", out: "♥ Liked · 1" },
      ],
      practice: { task: "Build a counter with − and + buttons that never goes below 0.",
        hint: "`setCount((c) => Math.max(0, c - 1))`",
        solution: { lang: "jsx", run: "check", code:
`import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <button onClick={() => setCount((c) => Math.max(0, c - 1))}>−</button>
      <span>{count}</span>
      <button onClick={() => setCount((c) => c + 1)}>+</button>
    </div>
  );
}` } },
      check: [
        { q: "What does calling setCount do?", options: ["Changes the variable instantly", "Schedules a re-render with the new value", "Nothing", "Reloads the page"], answer: 1, why: "React re-renders the component with the updated state." },
        { q: "Which is correct?", options: ["onclick={handle()}", "onClick={handle}", "onClick=\"handle\"", "onClick={handle()}"], answer: 1, why: "Pass the function itself. handle() would run it during render." },
      ],
    },
    {
      id: "react-lists", title: "Rendering lists with keys", minutes: 25,
      goal: "Turn an array into elements with map and give each a stable key.",
      body: [
        "Use `.map()` to turn an array of data into an array of JSX elements.",
        "Each element needs a **key** prop that is unique and stable, usually the item's id. React uses keys to know which item is which when the list changes.",
        "Avoid using the array index as the key when items can be added, removed or re-ordered. It causes subtle bugs, like the wrong item keeping its typed input.",
        "Combine with `.filter()` to show only some items.",
      ],
      example: { lang: "jsx", run: "check", code:
`import { useState } from "react";

const plants = [
  { id: "p1", name: "Fern", price: 12 },
  { id: "p2", name: "Cactus", price: 8 },
  { id: "p3", name: "Monstera", price: 30 },
];

export default function PlantList() {
  const [max, setMax] = useState(50);
  const visible = plants.filter((p) => p.price <= max);

  return (
    <>
      <label htmlFor="max">Max price: {max}</label>
      <input id="max" type="range" min="0" max="50" value={max}
        onChange={(e) => setMax(Number(e.target.value))} />
      <ul>
        {visible.map((p) => (
          <li key={p.id}>{p.name}: \${p.price}</li>
        ))}
      </ul>
    </>
  );
}` },
      demo: [
        { lines: [3, 4, 5, 6, 7], say: "The data: an array of objects, each with a unique id." },
        { lines: [10], say: "State for the price filter." },
        { lines: [11], say: "Derived data: calculate the visible list on every render. No extra state needed." },
        { lines: [15, 16, 17], say: "A controlled input: its value comes from state, and onChange updates the state." },
        { lines: [19, 20, 21], say: "map turns each plant into an <li>, and the key is the stable id." },
      ],
      practice: { task: "Add a Remove button to each plant that removes it from the list.",
        hint: "Move plants into state, then `setItems(items.filter((p) => p.id !== id))`.",
        solution: { lang: "jsx", run: "check", code:
`import { useState } from "react";

export default function PlantList({ initial }) {
  const [items, setItems] = useState(initial);
  return (
    <ul>
      {items.map((p) => (
        <li key={p.id}>
          {p.name}
          <button onClick={() => setItems(items.filter((x) => x.id !== p.id))}>Remove</button>
        </li>
      ))}
    </ul>
  );
}` } },
      check: [
        { q: "What makes a good key?", options: ["Math.random()", "The array index", "A stable unique id", "The item's name, even if repeated"], answer: 2, why: "Keys must be unique among siblings and stay the same between renders." },
        { q: "To show a filtered list, you should…", options: ["Store the filtered list in its own state", "Calculate it from existing state during render", "Use useEffect", "Mutate the array"], answer: 1, why: "Derive it, so it can never get out of sync." },
      ],
    },
  ],
  project: { title: "React to-do list", brief: "Add, complete, delete and filter to-dos (All, Active, Done), with a count of what's left.",
    steps: ["Vite + React setup", "A todos array in state: { id, text, done }", "A form to add (use crypto.randomUUID() for ids)", "A checkbox to toggle done, a button to delete", "Filter buttons and a derived 'items left' count"],
    test: ["Write a test: typing and pressing Enter adds an item (see the Writing Tests module)", "An empty to-do can't be added", "Keys are ids, not indexes"] },
};

export const next = {
  lessons: [
    {
      id: "next-routing", title: "What Next.js adds, and file-based routing", minutes: 25,
      goal: "Create pages by creating folders in the app directory.",
      body: [
        "Next.js is a **framework** on top of React. It adds routing, server rendering, image optimization and an easy deploy.",
        "Create a project with `npx create-next-app@latest`. Pages live in the **`app/` folder**.",
        "**The folder path is the URL.** `app/page.js` is `/`, and `app/about/page.js` is `/about`. A folder only becomes a route when it has a `page.js` file.",
        "Each `page.js` default-exports a React component.",
      ],
      example: { lang: "jsx", run: "check", file: "app/about/page.js", code:
`// app/page.js        -> the URL /
// app/about/page.js  -> the URL /about
// app/shop/page.js   -> the URL /shop

export default function AboutPage() {
  return (
    <main>
      <h1>About us</h1>
      <p>We have been growing plants since 2019.</p>
    </main>
  );
}` },
      demo: [
        { lines: [1, 2, 3], say: "No router setup: each folder with a page.js is a URL." },
        { lines: [5], say: "Every page is a default-exported component." },
        { lines: [6, 7, 8, 9, 10, 11], say: "Normal JSX. Next renders it on the server and sends HTML, which is fast and good for SEO." },
      ],
      practice: { task: "Add a /contact page with a heading and an email address.",
        hint: "Create the folder `app/contact/` with a `page.js` inside.",
        solution: { lang: "jsx", run: "check", code:
`// app/contact/page.js
export default function ContactPage() {
  return (
    <main>
      <h1>Contact</h1>
      <p>hello@example.com</p>
    </main>
  );
}` } },
      check: [
        { q: "Which file makes the URL /blog?", options: ["app/blog.js", "app/blog/page.js", "pages/blog/index.html", "app/page/blog.js"], answer: 1, why: "A folder plus page.js makes a route in the App Router." },
        { q: "A folder with no page.js is…", options: ["A route", "Not a route", "An error", "A 404 page"], answer: 1, why: "Only folders with page.js become reachable URLs." },
      ],
    },
    {
      id: "next-layouts", title: "Layouts and the Link component", minutes: 25,
      goal: "Share a navbar across pages with a layout and navigate with Link.",
      body: [
        "`app/layout.js` wraps **every** page. Put your `<html>`, `<body>`, navbar and footer there. Its `children` prop is the current page.",
        "Layouts stay mounted while you move between pages, so shared state (like an open menu) isn't reset.",
        "Use `<Link href=\"/about\">` from `next/link` instead of `<a>` for links inside your site. It switches pages without a full reload and prefetches them.",
        "Export a `metadata` object from a layout or page to set the `<title>` and description.",
      ],
      example: { lang: "jsx", run: "check", file: "app/layout.js", code:
`import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: "Plant Shop",
  description: "Houseplants delivered",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav>
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
        </nav>
        {children}
      </body>
    </html>
  );
}` },
      demo: [
        { lines: [1], say: "Link comes from next/link." },
        { lines: [2], say: "Global CSS is imported once, in the root layout." },
        { lines: [4, 5, 6, 7], say: "metadata sets the tab title and the search-engine description." },
        { lines: [9], say: "children is the page currently being shown." },
        { lines: [13, 14, 15, 16], say: "The nav renders on every page, and Link navigates without a reload." },
        { lines: [17], say: "The current page appears here." },
      ],
      practice: { task: "Add a footer to the layout and a Contact link to the nav.",
        hint: "Put `<footer>` after `{children}` inside `<body>`.",
        solution: { lang: "jsx", run: "check", code:
`import Link from "next/link";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav>
          <Link href="/">Home</Link>
          <Link href="/contact">Contact</Link>
        </nav>
        {children}
        <footer>© 2026 Plant Shop</footer>
      </body>
    </html>
  );
}` } },
      check: [
        { q: "What is children in RootLayout?", options: ["The navbar", "The current page", "All pages at once", "The HTML head"], answer: 1, why: "Next passes the active page as children." },
        { q: "Why use <Link> over <a> for internal links?", options: ["It's required", "Client-side navigation and prefetching", "Better styling", "SEO only"], answer: 1, why: "Link avoids full page reloads and prefetches routes." },
      ],
    },
    {
      id: "next-server-client", title: "Server and client components", minutes: 30,
      goal: "Know when a component needs \"use client\".",
      body: [
        "In the App Router, components are **server components** by default. They run on the server, can `await` data directly, and send no JavaScript to the browser for themselves.",
        "Add `\"use client\"` at the top of a file when the component needs **the browser**: `useState`, `useEffect`, `onClick` and other event handlers, or `window` and `localStorage`.",
        "**Keep client components small** and push them down the tree. A server page can render a small client `<LikeButton />`.",
        "A server component can fetch with `await` right in the component. No `useEffect` and no loading state are needed for the first render.",
      ],
      example: { lang: "jsx", run: "check", file: "app/users/page.js", code:
`// app/users/page.js (a server component: no "use client")
import LikeButton from "./LikeButton";

export default async function UsersPage() {
  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  const users = await res.json();

  return (
    <ul>
      {users.map((u) => (
        <li key={u.id}>
          {u.name} <LikeButton />
        </li>
      ))}
    </ul>
  );
}

// app/users/LikeButton.js
// "use client";
// import { useState } from "react";
// export default function LikeButton() {
//   const [on, setOn] = useState(false);
//   return <button onClick={() => setOn(!on)}>{on ? "♥" : "♡"}</button>;
// }` },
      demo: [
        { lines: [1], say: "No directive, so this is a server component." },
        { lines: [4], say: "Server components can be async functions." },
        { lines: [5, 6], say: "Fetch directly. This runs on the server, never in the browser." },
        { lines: [12], say: "A small interactive island inside server-rendered HTML." },
        { lines: [19, 20], say: "The client file starts with \"use client\" because it uses useState and onClick." },
      ],
      practice: { task: "Which of these need \"use client\"? (a) a page that lists blog posts from an API, (b) a dark-mode toggle, (c) a footer, (d) a search box that filters as you type.",
        hint: "Does it use state, effects or event handlers?",
        solution: { lang: "text", code: "(a) No: server, fetch with await.\n(b) Yes: onClick and state.\n(c) No: static.\n(d) Yes: useState and onChange." } },
      check: [
        { q: "Components in app/ are by default…", options: ["Client components", "Server components", "Static HTML only", "Both at once"], answer: 1, why: "The App Router defaults to server components." },
        { q: "Which needs \"use client\"?", options: ["Fetching data with await", "Using useState", "Rendering a list", "Exporting metadata"], answer: 1, why: "Hooks like useState only run in the browser." },
      ],
    },
  ],
  project: { title: "Multi-page plant shop", brief: "A Next.js site with Home, Shop and About pages, a shared layout, a server-rendered product list from a JSON file or API, and a client-side Add to cart button.",
    steps: ["create-next-app with Tailwind", "Root layout with nav and footer", "A Shop page that awaits product data", "A small \"use client\" AddToCart button", "Metadata on every page"],
    test: ["Every nav link works without a full reload", "View the page source: the product names are in the HTML", "Deploy to Vercel and open it on your phone"] },
};
