// Advanced lessons: HTML, CSS, JavaScript, APIs, TypeScript, Tailwind
export const html = [
  {
    id: "a-html-aria", title: "ARIA patterns, and when not to use ARIA", minutes: 30,
    goal: "Know the first rule of ARIA, and build a disclosure and a live region correctly.",
    body: [
      "**The first rule of ARIA: don't use it if a native element does the job.** A `<button>` is focusable, clickable with Enter and Space, and announced as a button. A `<div role=\"button\">` needs all of that added by hand.",
      "ARIA only changes what assistive technology **hears**. It adds no behavior: `role=\"button\"` doesn't make Enter work.",
      "**States** must stay in sync with what's on screen: `aria-expanded` on a toggle, `aria-pressed` on a toggle button, `aria-current=\"page\"` on the current nav link.",
      "**Live regions** (`aria-live=\"polite\"` or `role=\"status\"`) announce changes that happen without focus moving, like \"3 results\" or \"Saved\". The region must exist on the page **before** the text changes.",
      "Test with a real screen reader (VoiceOver on Mac: Cmd+F5; NVDA on Windows), not just automated checkers.",
    ],
    example: { lang: "html", code:
`<button type="button" aria-expanded="false" aria-controls="faq-1" id="faq-btn">
  How long does shipping take?
</button>
<div id="faq-1" hidden>Two to four business days.</div>

<p role="status" id="cart-status"></p>

<script>
  const btn = document.querySelector("#faq-btn");
  const panel = document.querySelector("#faq-1");
  btn.addEventListener("click", () => {
    const open = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", String(!open));
    panel.hidden = open;
  });

  function addedToCart(name) {
    document.querySelector("#cart-status").textContent = name + " added to cart";
  }
</script>` },
    demo: [
      { lines: [1, 2, 3], say: "A real button (keyboard support for free), plus aria-expanded and aria-controls describing what it opens." },
      { lines: [4], say: "`hidden` removes the panel for everyone, screen readers included." },
      { lines: [6], say: "An empty status region that's already on the page, waiting for messages." },
      { lines: [11, 12, 13, 14, 15], say: "Toggle the panel AND keep aria-expanded in sync. A stale state is worse than none." },
      { lines: [17, 18, 19], say: "Changing the text in the live region makes screen readers announce it without moving focus." },
    ],
    practice: { task: "Fix this: `<div class=\"btn\" onclick=\"save()\">Save</div>`.",
      hint: "Rule one of ARIA.",
      solution: { lang: "html", code: `<button type="button" class="btn" onclick="save()">Save</button>\n<!-- Not <div role="button" tabindex="0">: you'd also have to handle Enter and Space yourself. -->` } },
    check: [
      { q: "Does role=\"button\" make a div respond to the Enter key?", options: ["Yes", "No, ARIA adds no behavior"], answer: 1, why: "ARIA changes semantics only. Use <button>." },
      { q: "When must a live region exist?", options: ["Only when the message appears", "Before its text changes", "After focus moves", "Never, use alert()"], answer: 1, why: "Screen readers watch regions that are already on the page." },
    ],
  },
  {
    id: "a-html-components", title: "Web Components and <template>", minutes: 30,
    goal: "Build a reusable custom element that works in any framework, or none.",
    body: [
      "**Custom elements** are your own HTML tags, built into the browser: `class Rating extends HTMLElement`, registered with `customElements.define(\"star-rating\", Rating)`. Names must contain a hyphen.",
      "**Shadow DOM** (`this.attachShadow({ mode: \"open\" })`) gives the component its own private DOM and CSS. Page styles don't leak in, and its styles don't leak out.",
      "`<template>` holds markup that isn't rendered until you clone it, which is ideal for a component's internals.",
      "React, Vue and plain HTML can all use the same web component. Design systems at large companies often ship this way.",
      "Lifecycle: `connectedCallback` (added to the page), `disconnectedCallback` (removed), and `attributeChangedCallback` for the attributes listed in `static observedAttributes`.",
    ],
    example: { lang: "html", code:
`<template id="badge-tpl">
  <style>
    span { padding: 2px 10px; border-radius: 99px; font: 600 12px system-ui; }
    :host([tone="danger"]) span { background: #fde6e6; color: #b81f26; }
    :host([tone="ok"]) span { background: #e3f7ec; color: #16794a; }
  </style>
  <span><slot>Badge</slot></span>
</template>

<status-badge tone="ok">Paid</status-badge>
<status-badge tone="danger">Overdue</status-badge>

<script>
  class StatusBadge extends HTMLElement {
    connectedCallback() {
      if (this.shadowRoot) return;
      const tpl = document.querySelector("#badge-tpl");
      this.attachShadow({ mode: "open" }).append(tpl.content.cloneNode(true));
    }
  }
  customElements.define("status-badge", StatusBadge);
</script>` },
    demo: [
      { lines: [1, 7, 8], say: "The template isn't rendered. It's a blueprint to clone." },
      { lines: [2, 3, 4, 5, 6], say: "Styles inside the shadow DOM. `:host([tone=...])` styles the element based on its own attribute." },
      { lines: [7], say: "`<slot>` shows whatever text sits between the tags." },
      { lines: [10, 11], say: "Use it like any HTML tag." },
      { lines: [14, 15, 16, 17, 18, 19], say: "On connect, attach a shadow root and clone the template into it (only once)." },
      { lines: [21], say: "Register the tag name. It must contain a hyphen." },
    ],
    practice: { task: "Make the badge react when its `tone` attribute changes after it's on the page.",
      hint: "`static observedAttributes = [\"tone\"]` plus `attributeChangedCallback`. With :host styles, CSS already reacts, so try logging the change to see it fire.",
      solution: { lang: "js", run: "check", code:
`class StatusBadge extends HTMLElement {
  static observedAttributes = ["tone"];
  attributeChangedCallback(name, oldValue, newValue) {
    console.log(name, "changed from", oldValue, "to", newValue);
  }
}` } },
    check: [
      { q: "What does Shadow DOM give a component?", options: ["Faster rendering", "Private markup and CSS that don't leak in or out", "Server rendering", "Database access"], answer: 1, why: "Encapsulation is the point." },
      { q: "A valid custom element name is…", options: ["<badge>", "<status-badge>", "<StatusBadge>", "<status_badge>"], answer: 1, why: "It must be lowercase and contain a hyphen." },
    ],
  },
  {
    id: "a-html-perf", title: "Loading performance and structured data", minutes: 25,
    goal: "Load the most important things first, and describe your page to search engines.",
    body: [
      "**Core Web Vitals** are Google's user-experience scores: **LCP** (how fast the main content shows, aim for under 2.5s), **INP** (how fast the page responds to input, under 200ms), and **CLS** (how much the layout jumps, under 0.1).",
      "Help LCP: `fetchpriority=\"high\"` on the hero image, `<link rel=\"preload\">` for a critical font, and never lazy-load what's on screen at the start.",
      "`<script defer>` downloads in parallel and runs after the HTML is parsed. `async` runs as soon as it arrives. Plain `<script>` in the head blocks the page.",
      "**Structured data** (JSON-LD) describes your content in a form search engines read, which can unlock rich results like star ratings, event dates or course listings.",
    ],
    example: { lang: "html", code:
`<head>
  <link rel="preload" href="/fonts/archivo.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preconnect" href="https://images.example-cdn.com">
  <script src="/js/app.js" defer></script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": "Full-Stack Bootcamp",
    "description": "HTML to databases, in three tiers.",
    "provider": { "@type": "Organization", "name": "Full-Stack Bootcamp" }
  }
  </script>
</head>
<body>
  <img src="hero.avif" width="1600" height="700" alt="Students pair-programming" fetchpriority="high">
  <img src="team.avif" width="800" height="600" alt="The teaching team" loading="lazy" decoding="async">
</body>` },
    demo: [
      { lines: [2], say: "Fetch the main font early, so text doesn't swap fonts late." },
      { lines: [3], say: "Open the connection to the image CDN before it's needed." },
      { lines: [4], say: "defer: download now, run after parsing. The page isn't blocked." },
      { lines: [5, 6, 7, 8, 9, 10, 11, 12, 13], say: "JSON-LD tells search engines this page is a Course, and who provides it." },
      { lines: [16], say: "The LCP image: high priority and never lazy." },
      { lines: [17], say: "Below the fold: lazy, and decoded off the main thread." },
    ],
    practice: { task: "Run Lighthouse (Chrome DevTools → Lighthouse) on your portfolio. Write down LCP, CLS and the top 3 suggestions, then fix one.",
      hint: "Use an incognito window so extensions don't skew the results.",
      solution: { lang: "text", code: "Common quick wins:\n- Add width and height to images (CLS)\n- Remove loading=\"lazy\" from the hero and add fetchpriority=\"high\" (LCP)\n- Serve AVIF/WebP and correctly sized images (LCP)\n- Defer non-critical scripts (LCP/INP)" } },
    check: [
      { q: "Which metric measures layout jumping?", options: ["LCP", "INP", "CLS", "TTFB"], answer: 2, why: "Cumulative Layout Shift." },
      { q: "<script defer> runs…", options: ["Immediately, blocking parsing", "After the HTML is parsed", "Never", "Only on click"], answer: 1, why: "defer waits for parsing to finish and keeps order." },
    ],
  },
];

export const css = [
  {
    id: "a-css-layers", title: "Cascade layers and a specificity strategy", minutes: 25,
    goal: "Control which CSS wins with @layer and low-specificity selectors.",
    body: [
      "Specificity fights (adding classes or `!important` to win) are a sign of missing structure.",
      "`@layer reset, base, components, utilities;` declares an order. **A later layer beats an earlier one, no matter the specificity** inside them.",
      "Unlayered CSS beats all layers, so put third-party CSS in an early layer to keep it from overriding yours.",
      "`:where()` has **zero** specificity, so base styles wrapped in it are easy to override. `:is()` takes the specificity of its strongest selector.",
    ],
    example: { lang: "css", code:
`@layer reset, vendor, base, components, utilities;

@import url("datepicker.css") layer(vendor);

@layer reset {
  *, *::before, *::after { box-sizing: border-box; margin: 0; }
}
@layer base {
  :where(a) { color: var(--link); }
  :where(h1, h2, h3) { line-height: 1.15; }
}
@layer components {
  #app .card .title { color: navy; }
}
@layer utilities {
  .text-red { color: crimson; }
}` },
    demo: [
      { lines: [1], say: "Declare the order once. Later layers win." },
      { lines: [3], say: "Third-party CSS goes in its own early layer, so it can't override your components." },
      { lines: [8, 9, 10, 11], say: ":where() has zero specificity, so these base styles are trivially overridable." },
      { lines: [12, 13, 14], say: "A very specific selector..." },
      { lines: [15, 16, 17], say: "...still loses to a single utility class, because utilities is a later layer." },
    ],
    practice: { task: "Your component library sets `.btn { padding: 12px }` and you can't edit it. Make your `.btn { padding: 8px }` win without !important.",
      hint: "Import the library into an earlier layer.",
      solution: { lang: "css", code: "@layer library, app;\n@import url(\"library.css\") layer(library);\n@layer app {\n  .btn { padding: 8px; }\n}" } },
    check: [
      { q: "Two layers both style .btn. Which wins?", options: ["The more specific selector", "The later layer", "The earlier layer", "Random"], answer: 1, why: "Layer order beats specificity." },
      { q: "Specificity of :where(.nav a)?", options: ["0,1,1", "0,0,0", "1,0,0", "Same as .nav a"], answer: 1, why: ":where() is always zero." },
    ],
  },
  {
    id: "a-css-container", title: "Container queries", minutes: 25,
    goal: "Make components respond to the space they're given, not the screen size.",
    body: [
      "Media queries ask \"how wide is the **screen**?\". But a card in a sidebar and the same card in the main area need different layouts on the same screen.",
      "**Container queries** ask \"how wide is my **container**?\". Mark a parent with `container-type: inline-size`, then use `@container (min-width: 400px)`.",
      "Name containers (`container-name: card`) when they're nested, so the query targets the right one.",
      "**Container units** like `cqi` (1% of the container's inline size) let type scale with the component.",
    ],
    example: { lang: "css", code:
`.card-slot {
  container-type: inline-size;
  container-name: card;
}

.card {
  display: grid;
  gap: 12px;
}
.card img { aspect-ratio: 16 / 9; object-fit: cover; width: 100%; }

@container card (min-width: 420px) {
  .card {
    grid-template-columns: 160px 1fr;
    align-items: center;
  }
  .card img { aspect-ratio: 1; }
}

.card h3 { font-size: clamp(1rem, 4cqi, 1.5rem); }` },
    demo: [
      { lines: [1, 2, 3, 4], say: "The wrapper becomes a container that children can query." },
      { lines: [6, 7, 8, 9, 10], say: "Default: stacked, with a wide image on top." },
      { lines: [12, 13, 14, 15, 16, 17, 18], say: "When the CONTAINER is 420px or wider, switch to image-left, text-right, whatever the screen size." },
      { lines: [20], say: "The heading scales with the card's width, clamped between 1rem and 1.5rem." },
    ],
    practice: { task: "Make a stat tile that shows only the number when narrow, and the number plus a sparkline label when 300px or wider.",
      hint: "Hide `.label` by default, and show it in @container (min-width: 300px).",
      solution: { lang: "css", code: ".tile { container-type: inline-size; }\n.tile .label { display: none; }\n@container (min-width: 300px) {\n  .tile .label { display: block; }\n}" } },
    check: [
      { q: "Container queries respond to…", options: ["Screen width", "The size of an ancestor marked as a container", "Font size", "Device type"], answer: 1, why: "That's the difference from media queries." },
      { q: "What does container-type: inline-size do?", options: ["Sets the width", "Makes the element queryable by its width", "Hides overflow", "Makes it a grid"], answer: 1, why: "Children can now query its inline size." },
    ],
  },
  {
    id: "a-css-perf", title: "Animation performance and scroll-driven effects", minutes: 25,
    goal: "Animate at 60fps, and use CSS for effects that used to need JavaScript.",
    body: [
      "The browser draws a frame in steps: **style → layout → paint → composite**. Changing `width` re-runs all of them. Changing `transform` or `opacity` can skip straight to compositing, which happens on the GPU.",
      "`will-change: transform` hints that something will animate. Use it sparingly, only on elements that really animate, because each one costs memory.",
      "Find slow animations in DevTools → Performance: long frames and purple \"Layout\" blocks are the warning signs.",
      "**Scroll-driven animations** (`animation-timeline: scroll()` or `view()`) tie an animation to scroll position in pure CSS, with no scroll listeners. Wrap them in `@supports` so older browsers just skip the effect.",
    ],
    example: { lang: "css", code:
`.progress {
  position: fixed; inset: 0 0 auto; height: 4px;
  background: var(--sun);
  transform-origin: left;
  transform: scaleX(0);
}

@supports (animation-timeline: scroll()) {
  .progress {
    animation: grow linear both;
    animation-timeline: scroll(root);
  }
  .reveal {
    animation: fade-up linear both;
    animation-timeline: view();
    animation-range: entry 0% cover 30%;
  }
}

@keyframes grow { to { transform: scaleX(1); } }
@keyframes fade-up { from { opacity: 0; transform: translateY(24px); } }

@media (prefers-reduced-motion: reduce) {
  .progress, .reveal { animation: none; }
}` },
    demo: [
      { lines: [1, 2, 3, 4, 5, 6], say: "A reading-progress bar. It animates transform: scaleX, never width." },
      { lines: [8], say: "Only browsers that support scroll timelines get the effect." },
      { lines: [9, 10, 11, 12], say: "The bar fills as the page scrolls, with no JavaScript." },
      { lines: [13, 14, 15, 16, 17], say: "Each .reveal fades up as it enters the viewport." },
      { lines: [20, 21], say: "Only transform and opacity: cheap to animate." },
      { lines: [23, 24, 25], say: "And off entirely for people who ask for less motion." },
    ],
    practice: { task: "A dropdown animates `height` from 0 to auto and stutters. How do you fix it?",
      hint: "Animate a cheap property instead, or use grid-template-rows.",
      solution: { lang: "css", code: ".menu { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 200ms; }\n.menu.open { grid-template-rows: 1fr; }\n.menu > div { overflow: hidden; }\n/* Or animate transform: scaleY + opacity for a pop-in effect. */" } },
    check: [
      { q: "Which property change only needs compositing?", options: ["width", "margin", "transform", "top"], answer: 2, why: "transform and opacity skip layout and paint." },
      { q: "Why wrap scroll-driven animations in @supports?", options: ["Required syntax", "Browsers without support skip the effect cleanly", "Performance", "SEO"], answer: 1, why: "Progressive enhancement." },
    ],
  },
];

export const js = [
  {
    id: "a-js-eventloop", title: "The event loop, microtasks and timers", minutes: 30,
    goal: "Predict the order async code runs in, and avoid blocking the page.",
    body: [
      "JavaScript runs on **one thread**. While your code runs, the page can't respond. Long tasks cause jank.",
      "The **event loop**: run the current script to the end, then run **all microtasks** (Promise callbacks, `await` continuations, `queueMicrotask`), then take **one macrotask** (a `setTimeout` callback, an event), and repeat.",
      "So a `Promise.then` always runs before a `setTimeout(fn, 0)` that was scheduled earlier.",
      "Break up heavy work (yield with `await new Promise((r) => setTimeout(r))` between chunks), or move it to a **Web Worker**.",
    ],
    example: { lang: "js", run: "node", code:
`console.log("1 script start");

setTimeout(() => console.log("6 timeout"), 0);

Promise.resolve().then(() => console.log("4 promise 1"))
  .then(() => console.log("5 promise 2"));

queueMicrotask(() => console.log("4b microtask"));

(async () => {
  console.log("2 async fn starts (sync part)");
  await null;
  console.log("4c after await");
})();

console.log("3 script end");`,
      output: "1 script start\n2 async fn starts (sync part)\n3 script end\n4 promise 1\n4b microtask\n4c after await\n5 promise 2\n6 timeout" },
    demo: [
      { lines: [1], say: "Synchronous code runs first, top to bottom.", out: "1 script start" },
      { lines: [3], say: "A timer is a macrotask. It waits until the stack AND the microtask queue are empty." },
      { lines: [5, 6, 8], say: "These callbacks are microtasks, queued in order." },
      { lines: [10, 11], say: "An async function runs synchronously until its first await.", out: "2 async fn starts (sync part)" },
      { lines: [16], say: "The script ends.", out: "3 script end" },
      { lines: [5, 8, 13], say: "Now all microtasks run, in the order they were queued.", out: "4 promise 1\n4b microtask\n4c after await" },
      { lines: [6], say: "The chained .then was queued by the first one, so it runs next.", out: "5 promise 2" },
      { lines: [3], say: "Finally, the timer.", out: "6 timeout" },
    ],
    practice: { task: "Predict the output: `setTimeout(() => log(\"A\")); Promise.resolve().then(() => log(\"B\")); log(\"C\");`",
      hint: "Synchronous code, then microtasks, then timers.",
      solution: { lang: "js", run: "node", code:
`const log = console.log;
setTimeout(() => log("A"));
Promise.resolve().then(() => log("B"));
log("C");`, output: "C\nB\nA" } },
    check: [
      { q: "Which runs first after the script finishes?", options: ["setTimeout(fn, 0)", "Promise.then callbacks", "Click handlers", "requestAnimationFrame"], answer: 1, why: "All microtasks run before the next macrotask." },
      { q: "A 2-second loop in a click handler will…", options: ["Run in the background", "Freeze the page for 2 seconds", "Be skipped", "Run in a worker"], answer: 1, why: "One thread: nothing else runs until it finishes." },
    ],
  },
  {
    id: "a-js-classes", title: "Prototypes, classes and private fields", minutes: 25,
    goal: "Understand what classes really are, and write classes with real encapsulation.",
    body: [
      "Every object has a **prototype**: another object it falls back to when a property is missing. Methods live on the prototype, shared by every instance.",
      "`class` is cleaner syntax over prototypes. `extends` links one prototype to another.",
      "`#private` fields can't be read or changed from outside the class. That's real privacy, enforced by the language (unlike the old `_underscore` convention).",
      "`get` and `set` make computed properties, and `static` members belong to the class itself, not to instances.",
    ],
    example: { lang: "js", run: "node", code:
`class Timer {
  #seconds = 0;
  static created = 0;

  constructor(label) {
    this.label = label;
    Timer.created++;
  }
  tick(n = 1) { this.#seconds += n; return this; }
  get display() {
    const m = String(Math.floor(this.#seconds / 60)).padStart(2, "0");
    const s = String(this.#seconds % 60).padStart(2, "0");
    return this.label + " " + m + ":" + s;
  }
}

class Countdown extends Timer {
  constructor(label, from) { super(label); this.tick(from); }
}

const t = new Countdown("Bake", 125).tick(5);
console.log(t.display, Timer.created);
console.log(Object.getPrototypeOf(Countdown.prototype) === Timer.prototype);
console.log(t.seconds, "tick" in t, Object.hasOwn(t, "tick"));`,
      output: "Bake 02:10 1\ntrue\nundefined true false" },
    demo: [
      { lines: [2], say: "A private field: only code inside the class can touch it." },
      { lines: [3, 7], say: "A static counter lives on the class, not on each timer." },
      { lines: [9], say: "Returning this allows chaining: .tick().tick()." },
      { lines: [10, 11, 12, 13, 14], say: "A getter reads like a property but computes its value." },
      { lines: [17, 18, 19], say: "extends links the prototypes, and super() runs the parent constructor." },
      { lines: [21, 22], say: "125 + 5 seconds is 2:10, and one timer was created.", out: "Bake 02:10 1" },
      { lines: [23], say: "Under the hood, classes are prototypes.", out: "true" },
      { lines: [24], say: "The private field is invisible, and tick lives on the prototype, not on the object.", out: "undefined true false" },
    ],
    practice: { task: "Write a `BankAccount` class with a private #balance, a deposit method that rejects non-positive amounts, and a read-only `balance` getter.",
      hint: "Throw an Error in deposit for amounts <= 0.",
      solution: { lang: "js", run: "node", code:
`class BankAccount {
  #balance = 0;
  deposit(amount) {
    if (amount <= 0) throw new Error("Deposit must be positive");
    this.#balance += amount;
  }
  get balance() { return this.#balance; }
}
const a = new BankAccount();
a.deposit(50);
try {
  a.balance = 1000000;
} catch (err) {
  console.log("blocked:", err.constructor.name);
}
console.log(a.balance);`, output: "blocked: TypeError\n50" } },
    check: [
      { q: "Where do class methods live?", options: ["On each instance", "On the class's prototype", "In a global table", "In the constructor"], answer: 1, why: "Instances share methods through the prototype." },
      { q: "obj.#secret from outside the class…", options: ["Returns undefined", "Is a syntax error", "Works", "Returns null"], answer: 1, why: "Private fields can't even be written about outside the class." },
    ],
  },
  {
    id: "a-js-patterns", title: "Debounce, throttle and memoize", minutes: 30,
    goal: "Write the three utility functions interviewers ask about most, and know when to use each.",
    body: [
      "**Debounce**: wait until calls **stop** for N ms, then run once. Use it for search-as-you-type and window resize.",
      "**Throttle**: run at most once every N ms, however often it's called. Use it for scroll and mousemove handlers.",
      "**Memoize**: cache results by input, so repeated calls with the same arguments are instant. Use it for expensive pure functions.",
      "All three are **closures**: an inner function that remembers variables (a timer, the last run time, a cache) from the outer function after it has returned.",
    ],
    example: { lang: "js", run: "node", code:
`function debounce(fn, ms) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

function throttle(fn, ms) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= ms) { last = now; fn(...args); }
  };
}

function memoize(fn) {
  const cache = new Map();
  return (n) => (cache.has(n) ? cache.get(n) : (cache.set(n, fn(n)), cache.get(n)));
}

const search = debounce((q) => console.log("search:", q), 50);
["r", "re", "rea", "react"].forEach((q) => search(q));

const onScroll = throttle((i) => console.log("scroll", i), 1000);
for (let i = 0; i < 5; i++) onScroll(i);

let calls = 0;
const slowSquare = memoize((n) => { calls++; return n * n; });
slowSquare(9); slowSquare(9);
console.log("square calls:", calls);`,
      output: "scroll 0\nsquare calls: 1\nsearch: react" },
    demo: [
      { lines: [1, 2, 3, 4, 5, 6], say: "Debounce: each call cancels the previous timer, so only the last one survives the pause." },
      { lines: [9, 10, 11, 12, 13, 14], say: "Throttle: remember when it last ran, and ignore calls that come too soon." },
      { lines: [17, 18, 19, 20], say: "Memoize: check the cache, and compute only on a miss." },
      { lines: [25, 26], say: "Five scroll events in a row, but only the first one runs.", out: "scroll 0" },
      { lines: [28, 29, 30, 31], say: "The second call came from the cache.", out: "square calls: 1" },
      { lines: [22, 23], say: "Four keystrokes, one search, 50ms after the last.", out: "search: react" },
    ],
    practice: { task: "Add a `cancel()` method to debounce, so a pending call can be dropped (e.g. when a component unmounts).",
      hint: "Attach a function to the returned function: `debounced.cancel = () => clearTimeout(timer)`.",
      solution: { lang: "js", run: "node", code:
`function debounce(fn, ms) {
  let timer;
  const debounced = (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), ms); };
  debounced.cancel = () => clearTimeout(timer);
  return debounced;
}
const d = debounce(() => console.log("should not run"), 10);
d(); d.cancel();
setTimeout(() => console.log("cancelled"), 30);`, output: "cancelled" } },
    check: [
      { q: "Search-as-you-type should use…", options: ["throttle", "debounce", "memoize", "setInterval"], answer: 1, why: "Wait until typing pauses." },
      { q: "What makes these utilities work?", options: ["Classes", "Closures", "Prototypes", "Generators"], answer: 1, why: "The returned function remembers the timer or cache." },
    ],
  },
];

export const apis = [
  {
    id: "a-api-resilient", title: "Cancelling requests and retrying with backoff", minutes: 30,
    goal: "Make network code that survives slow and flaky servers.",
    body: [
      "`AbortController` cancels a request: pass `controller.signal` to fetch, and call `controller.abort()`. Use it when a user leaves the page or types a new search.",
      "`AbortSignal.timeout(5000)` gives you a signal that aborts on its own after 5 seconds.",
      "**Retry** only what can succeed on a second try: network errors, 429 (rate limited) and 5xx. **Never** retry a 400 or 404; it will fail the same way.",
      "Wait longer between each try (**exponential backoff**: 200ms, 400ms, 800ms…) plus a little randomness (**jitter**), so many clients don't retry at the same instant.",
    ],
    example: { lang: "js", run: "node", code:
`const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchWithRetry(url, { retries = 3, baseMs = 100, fetcher = fetch } = {}) {
  for (let attempt = 0; ; attempt++) {
    try {
      const res = await fetcher(url, { signal: AbortSignal.timeout(5000) });
      if (res.ok) return res;
      const retryable = res.status === 429 || res.status >= 500;
      if (!retryable || attempt === retries) throw new Error("HTTP " + res.status);
    } catch (err) {
      if (attempt === retries || err.message.startsWith("HTTP 4")) throw err;
    }
    const wait = baseMs * 2 ** attempt + Math.random() * 50;
    console.log("attempt", attempt + 1, "failed, retrying");
    await sleep(wait);
  }
}

let n = 0;
const flaky = async () => (++n < 3 ? { ok: false, status: 503 } : { ok: true, status: 200 });
fetchWithRetry("/api/books", { fetcher: flaky })
  .then((r) => console.log("succeeded with", r.status, "after", n, "tries"));`,
      output: "attempt 1 failed, retrying\nattempt 2 failed, retrying\nsucceeded with 200 after 3 tries" },
    demo: [
      { lines: [6], say: "Every attempt gives up after 5 seconds." },
      { lines: [7], say: "Success: return immediately." },
      { lines: [8, 9], say: "Only 429 and 5xx are worth retrying. A 404 fails right away." },
      { lines: [11], say: "Don't retry client errors that came through as exceptions either." },
      { lines: [13], say: "Exponential backoff with jitter: about 100ms, then 200ms, then 400ms." },
      { lines: [19, 20, 21, 22], say: "A fake server that fails twice with 503, then works.", out: "attempt 1 failed, retrying\nattempt 2 failed, retrying\nsucceeded with 200 after 3 tries" },
    ],
    practice: { task: "In a React search component, cancel the previous request whenever the query changes.",
      hint: "New AbortController in the effect, abort in the cleanup, ignore AbortError.",
      solution: { lang: "jsx", run: "check", code:
`useEffect(() => {
  if (!query) return;
  const c = new AbortController();
  fetch("/api/search?q=" + encodeURIComponent(query), { signal: c.signal })
    .then((r) => r.json())
    .then(setResults)
    .catch((e) => { if (e.name !== "AbortError") setError(e.message); });
  return () => c.abort();
}, [query]);` } },
    check: [
      { q: "Which response should you retry?", options: ["400", "404", "503", "401"], answer: 2, why: "5xx and 429 may succeed later. 4xx won't." },
      { q: "Why add jitter to backoff?", options: ["Required by HTTP", "So many clients don't retry at the same moment", "It's faster", "Security"], answer: 1, why: "It spreads retries out instead of hammering the server together." },
    ],
  },
  {
    id: "a-api-cache", title: "Caching and stale-while-revalidate", minutes: 25,
    goal: "Serve data instantly from a cache while refreshing it in the background.",
    body: [
      "**HTTP caching** is controlled by the server's `Cache-Control` header: `max-age=60` (fresh for 60s), `no-store` (never cache), `stale-while-revalidate=300` (serve stale for 5 more minutes while refreshing).",
      "**Stale-while-revalidate (SWR)**: show cached data immediately, fetch fresh data in the background, then update. It's the idea behind SWR and TanStack Query.",
      "**Deduplicate** in-flight requests: if three components ask for the same thing at once, make one request and share the promise.",
      "Cache **keys** must include everything that changes the answer (URL, query, user).",
    ],
    example: { lang: "js", run: "node", code:
`function createCache({ ttlMs }) {
  const store = new Map();
  const inflight = new Map();

  async function refresh(key, fetcher) {
    if (!inflight.has(key)) {
      inflight.set(key, fetcher().then((data) => {
        store.set(key, { data, at: Date.now() });
        inflight.delete(key);
        return data;
      }));
    }
    return inflight.get(key);
  }

  return async function get(key, fetcher) {
    const hit = store.get(key);
    if (!hit) return refresh(key, fetcher);
    if (Date.now() - hit.at > ttlMs) refresh(key, fetcher);
    return hit.data;
  };
}

let version = 0;
const fetchBooks = async () => "books v" + ++version;
const get = createCache({ ttlMs: 20 });

(async () => {
  const [a, b] = await Promise.all([get("books", fetchBooks), get("books", fetchBooks)]);
  console.log(a, b, "requests:", version);
  await new Promise((r) => setTimeout(r, 30));
  console.log(await get("books", fetchBooks));
  await new Promise((r) => setTimeout(r, 5));
  console.log(await get("books", fetchBooks));
})();`,
      output: "books v1 books v1 requests: 1\nbooks v1\nbooks v2" },
    demo: [
      { lines: [2, 3], say: "Two maps: finished results, and requests still in flight." },
      { lines: [5, 6, 7, 8, 9, 10, 11, 12, 13], say: "Only one request per key at a time. Everyone else shares its promise." },
      { lines: [17, 18], say: "Nothing cached yet: wait for the network." },
      { lines: [19, 20], say: "Cached but old: return it NOW, and refresh in the background." },
      { lines: [28, 29], say: "Two simultaneous callers, one request.", out: "books v1 books v1 requests: 1" },
      { lines: [30, 31], say: "After the TTL: you still get v1 instantly, while v2 loads behind the scenes.", out: "books v1" },
      { lines: [32, 33], say: "Next call: the fresh data.", out: "books v2" },
    ],
    practice: { task: "What Cache-Control header suits: (a) a hashed JS file like app.3f9a1.js, (b) a user's account page, (c) a product list that updates hourly?",
      hint: "Hashed files never change. Account pages are private.",
      solution: { lang: "text", code: "(a) public, max-age=31536000, immutable\n(b) private, no-store\n(c) public, max-age=300, stale-while-revalidate=3600" } },
    check: [
      { q: "What does stale-while-revalidate do?", options: ["Blocks until fresh", "Serves cached data now and refreshes in the background", "Never caches", "Deletes stale data"], answer: 1, why: "Instant response, eventual freshness." },
      { q: "Why deduplicate in-flight requests?", options: ["Security", "Avoid sending the same request many times at once", "Required by fetch", "Smaller bundle"], answer: 1, why: "Several components often need the same data at the same time." },
    ],
  },
  {
    id: "a-api-cors", title: "CORS explained, and designing for rate limits", minutes: 25,
    goal: "Understand why the browser blocks some requests, and handle 429 responses well.",
    body: [
      "The **same-origin policy**: a page can only read responses from its own origin (scheme + host + port). `https://app.com` and `https://api.app.com` are **different** origins.",
      "**CORS** lets a server opt in: `Access-Control-Allow-Origin: https://app.com`. CORS is enforced by the **browser**; curl and servers ignore it. That's why \"it works in Postman\" proves nothing.",
      "Requests with JSON bodies or custom headers trigger a **preflight**: an `OPTIONS` request asking permission first.",
      "**Rate limits**: APIs answer `429 Too Many Requests`, often with `Retry-After`. Respect it, debounce user-triggered calls, and cache.",
    ],
    example: { lang: "js", run: "check", code:
`// Browser on https://app.example.com:
fetch("https://api.example.com/books", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ title: "Dune" }),
});

// 1. Browser sends a preflight automatically:
//    OPTIONS /books
//    Origin: https://app.example.com
//    Access-Control-Request-Method: POST
//    Access-Control-Request-Headers: content-type

// 2. The server must answer:
//    Access-Control-Allow-Origin: https://app.example.com
//    Access-Control-Allow-Methods: GET, POST
//    Access-Control-Allow-Headers: content-type

// 3. Only then does the real POST go out.

// Handling 429 politely:
async function politeFetch(url) {
  const res = await fetch(url);
  if (res.status === 429) {
    const seconds = Number(res.headers.get("Retry-After")) || 5;
    throw new Error("Too many requests. Try again in " + seconds + "s.");
  }
  return res;
}` },
    demo: [
      { lines: [2, 3, 4, 5, 6], say: "A cross-origin POST with JSON, which needs a preflight." },
      { lines: [8, 9, 10, 11, 12], say: "The browser asks first: may this origin send a POST with this header?" },
      { lines: [14, 15, 16, 17], say: "The server's answer. Without it, the browser blocks the response (the request may still have reached the server!)." },
      { lines: [22, 23, 24, 25, 26, 27, 28, 29], say: "On 429, read Retry-After and tell the user, instead of retrying in a tight loop." },
    ],
    practice: { task: "Your React app on localhost:5173 gets a CORS error calling your Express API on localhost:3000. Give two fixes.",
      hint: "One on the server, one in the dev setup.",
      solution: { lang: "text", code: "1. Server: app.use(cors({ origin: \"http://localhost:5173\" }))\n2. Dev proxy: in vite.config, server.proxy: { \"/api\": \"http://localhost:3000\" }, then call /api/... from the same origin.\n(In production, serve both from one origin, or set CORS to your real domain.)" } },
    check: [
      { q: "Who enforces CORS?", options: ["The server", "The browser", "The database", "DNS"], answer: 1, why: "That's why curl and Postman never show CORS errors." },
      { q: "http://localhost:3000 vs http://localhost:5173 are…", options: ["The same origin", "Different origins (different ports)", "Same if on the same machine", "Not origins"], answer: 1, why: "The port is part of the origin." },
    ],
  },
];

export const ts = [
  {
    id: "a-ts-utility", title: "Utility types", minutes: 25,
    goal: "Derive new types from existing ones instead of copying them.",
    body: [
      "Copy-pasted types drift apart. Derive them instead, so one change updates everything.",
      "`Partial<T>` makes every property optional (good for update payloads). `Required<T>` does the opposite.",
      "`Pick<T, \"a\" | \"b\">` keeps some properties, and `Omit<T, \"password\">` removes some.",
      "`Record<K, V>` types a dictionary. `ReturnType<typeof fn>` and `Awaited<T>` pull types out of functions and promises.",
    ],
    example: { lang: "ts", run: "ts", code:
`interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "admin" | "member";
}

type PublicUser = Omit<User, "password">;
type UserUpdate = Partial<Pick<User, "name" | "email">>;
type RoleCounts = Record<User["role"], number>;

function toPublic({ password, ...rest }: User): PublicUser {
  return rest;
}
async function loadUser(): Promise<User> {
  return { id: "u1", name: "Ana", email: "a@x.com", password: "secret", role: "admin" };
}
type Loaded = Awaited<ReturnType<typeof loadUser>>;

const patch: UserUpdate = { name: "Ana B." };
const counts: RoleCounts = { admin: 1, member: 4 };
loadUser().then((u: Loaded) => console.log(Object.keys(toPublic(u)).join(","), patch, counts.member));`,
      output: "id,name,email,role { name: 'Ana B.' } 4" },
    demo: [
      { lines: [9], say: "Everything except password, so it's safe to send to the browser." },
      { lines: [10], say: "Only name and email, and both optional: a PATCH body." },
      { lines: [11], say: "User[\"role\"] reads a property's type. Record makes a key for each role." },
      { lines: [13, 14, 15], say: "The return type guarantees password can't sneak out." },
      { lines: [19], say: "Pull the resolved type out of a function: no copying." },
      { lines: [23], say: "Every value is checked against a derived type.", out: "id,name,email,role { name: 'Ana B.' } 4" },
    ],
    practice: { task: "Create a `NewUser` type for a sign-up form: everything in User except id and role.",
      hint: "Omit with a union of keys.",
      solution: { lang: "ts", run: "ts", code:
`interface User { id: string; name: string; email: string; password: string; role: "admin" | "member" }
type NewUser = Omit<User, "id" | "role">;
const n: NewUser = { name: "Bo", email: "bo@x.com", password: "pw12345!" };
console.log(Object.keys(n).length);`, output: "3" } },
    check: [
      { q: "Partial<T> makes…", options: ["Every property required", "Every property optional", "A copy of T", "T readonly"], answer: 1, why: "Useful for update payloads." },
      { q: "Omit<User, \"password\"> is…", options: ["User with password optional", "User without the password property", "Only password", "An error"], answer: 1, why: "Omit removes keys." },
    ],
  },
  {
    id: "a-ts-advanced", title: "Mapped types, conditional types and satisfies", minutes: 30,
    goal: "Write your own type helpers, and check object literals without losing their exact types.",
    body: [
      "A **mapped type** loops over keys: `{ [K in keyof T]: ... }`. All the built-in utility types are written this way.",
      "A **conditional type** chooses a type: `T extends string ? \"text\" : \"other\"`. `infer` captures part of a type inside the condition.",
      "**Template literal types** build string types from other types, e.g. turning the key \"theme\" into \"getTheme\" (see line 1 below).",
      "`satisfies` checks that a value matches a type **without** widening it, so you keep the exact keys and literal values for autocomplete.",
    ],
    example: { lang: "ts", run: "ts", code:
`type Getters<T> = { [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K] };
type ElementOf<T> = T extends (infer U)[] ? U : never;

interface Settings { theme: "light" | "dark"; fontSize: number }
type SettingsGetters = Getters<Settings>;

const getters: SettingsGetters = {
  getTheme: () => "dark",
  getFontSize: () => 16,
};

const routes = {
  home: "/",
  lesson: "/learn/:module/:lesson",
} satisfies Record<string, \`/\${string}\`>;

type Tag = ElementOf<["html", "css"]>;
const tag: Tag = "css";

console.log(getters.getTheme(), getters.getFontSize(), routes.lesson, tag);`,
      output: "dark 16 /learn/:module/:lesson css" },
    demo: [
      { lines: [1], say: "A mapped type with key renaming: each key K becomes getK, returning T[K]." },
      { lines: [2], say: "infer captures the element type of an array." },
      { lines: [4, 5], say: "SettingsGetters is { getTheme(): \"light\" | \"dark\"; getFontSize(): number }." },
      { lines: [12, 13, 14, 15], say: "satisfies: every value must start with /, but routes.lesson keeps its exact literal type." },
      { lines: [17, 18], say: "Tag is \"html\" | \"css\"." },
      { lines: [20], say: "All of it type-checks, and it runs like plain JavaScript.", out: "dark 16 /learn/:module/:lesson css" },
    ],
    practice: { task: "Write `Nullable<T>`, which makes every property of T also accept null.",
      hint: "A mapped type: [K in keyof T]: T[K] | null",
      solution: { lang: "ts", run: "ts", code:
`type Nullable<T> = { [K in keyof T]: T[K] | null };
interface Profile { bio: string; age: number }
const p: Nullable<Profile> = { bio: null, age: 30 };
console.log(p.bio, p.age);`, output: "null 30" } },
    check: [
      { q: "What does `satisfies` do differently from a type annotation?", options: ["Nothing", "Checks the type but keeps the value's exact inferred type", "Runs at runtime", "Makes it readonly"], answer: 1, why: "An annotation widens to the annotated type; satisfies doesn't." },
      { q: "{ [K in keyof T]: string } is a…", options: ["Conditional type", "Mapped type", "Union", "Generic constraint"], answer: 1, why: "It maps over T's keys." },
    ],
  },
  {
    id: "a-ts-zod", title: "Strict mode and runtime validation with Zod", minutes: 30,
    goal: "Turn on the strict compiler settings, and validate untrusted data at runtime.",
    body: [
      "Turn on `\"strict\": true` in tsconfig.json. It enables `strictNullChecks` (no forgetting null), `noImplicitAny`, and more. Also worth adding: `noUncheckedIndexedAccess` (array[i] may be undefined).",
      "Types vanish at runtime. Data from APIs, forms, URLs and localStorage can be **anything**.",
      "**Zod** describes a shape once, and gives you both a runtime validator and a TypeScript type (`z.infer`).",
      "`safeParse` returns `{ success, data }` or `{ success: false, error }`, so you never trust raw input.",
    ],
    example: { lang: "ts", run: "ts", code:
`import * as z from "zod";

const SignupSchema = z.object({
  name: z.string().trim().min(2, { error: "Name must be at least 2 characters" }),
  email: z.email({ error: "Enter a valid email" }),
  age: z.coerce.number().int().min(13).optional(),
});

type Signup = z.infer<typeof SignupSchema>;

function parseSignup(input: unknown): Signup | string[] {
  const result = SignupSchema.safeParse(input);
  if (!result.success) return result.error.issues.map((i) => i.path.join(".") + ": " + i.message);
  return result.data;
}

console.log(parseSignup({ name: "  Ana ", email: "ana@example.com", age: "30" }));
console.log(parseSignup({ name: "A", email: "nope" }));`,
      output: "{ name: 'Ana', email: 'ana@example.com', age: 30 }\n[\n  'name: Name must be at least 2 characters',\n  'email: Enter a valid email'\n]" },
    demo: [
      { lines: [3, 4, 5, 6, 7], say: "Describe the shape once, with friendly messages." },
      { lines: [6], say: "coerce turns form strings like \"30\" into numbers." },
      { lines: [9], say: "The TypeScript type comes FROM the schema, so they can never disagree." },
      { lines: [11, 12, 13, 14, 15], say: "Input is unknown, which is honest about where it came from. safeParse never throws." },
      { lines: [17], say: "Valid input is trimmed and converted.", out: "{ name: 'Ana', email: 'ana@example.com', age: 30 }" },
      { lines: [18], say: "Invalid input gives readable errors per field.", out: "[ 'name: Name must be at least 2 characters', 'email: Enter a valid email' ]" },
    ],
    practice: { task: "Write a Zod schema for an API response: `{ id: number, title: string, tags: string[] }`, and validate a fetched array of them.",
      hint: "`z.array(BookSchema).parse(await res.json())`",
      solution: { lang: "ts", run: "ts", code:
`import * as z from "zod";
const Book = z.object({ id: z.number(), title: z.string(), tags: z.array(z.string()) });
const books = z.array(Book).parse([{ id: 1, title: "Dune", tags: ["sci-fi"] }]);
console.log(books[0].tags[0]);`, output: "sci-fi" } },
    check: [
      { q: "Why validate at runtime if you have TypeScript?", options: ["You don't need to", "Types disappear at runtime; outside data can be anything", "It's faster", "TypeScript requires it"], answer: 1, why: "The compiler can't see what an API actually sends." },
      { q: "z.infer<typeof Schema> gives you…", options: ["A runtime value", "The TypeScript type matching the schema", "A JSON schema", "Test data"], answer: 1, why: "One source of truth for type and validation." },
    ],
  },
];

export const tailwind = [
  {
    id: "a-tw-system", title: "A design system on Tailwind", minutes: 30,
    goal: "Turn brand decisions into tokens and component recipes that a whole team can follow.",
    body: [
      "A design system is **decisions written down**: the colors, type scale, spacing, radii and components everyone uses.",
      "Put **semantic** tokens in `@theme` (`--color-surface`, `--color-danger`), not just raw palette names, so code says what a color is for.",
      "Component **recipes** keep variants in one place: base classes plus variant and size maps. Libraries like `cva` formalize this.",
      "When classes are merged from outside (a `className` prop), use `tailwind-merge` so `p-2` passed in correctly replaces a default `p-4` instead of both applying.",
    ],
    example: { lang: "jsx", run: "check", code:
`// theme.css
// @theme {
//   --color-surface: #ffffff;
//   --color-ink: #0c2131;
//   --color-brand: #0a6c9f;
//   --color-danger: #e2363c;
//   --radius-control: 0.6rem;
// }

const recipe = {
  base: "inline-flex items-center justify-center gap-2 font-semibold rounded-control focus-visible:outline-2 disabled:opacity-50",
  variant: {
    solid: "bg-brand text-white hover:brightness-110",
    outline: "border border-brand text-brand hover:bg-brand/10",
    danger: "bg-danger text-white hover:brightness-110",
  },
  size: { sm: "h-8 px-3 text-sm", md: "h-10 px-4", lg: "h-12 px-6 text-lg" },
};

export function Button({ variant = "solid", size = "md", className = "", ...props }) {
  const classes = [recipe.base, recipe.variant[variant], recipe.size[size], className].join(" ");
  return <button className={classes} {...props} />;
}` },
    demo: [
      { lines: [2, 3, 4, 5, 6, 7, 8], say: "Semantic tokens: what a color is FOR, not just what it looks like." },
      { lines: [10, 11], say: "Base classes every button shares, including focus and disabled states." },
      { lines: [12, 13, 14, 15, 16], say: "Variants are complete class strings, so Tailwind can find them." },
      { lines: [17], say: "Sizes are separate from variants, so any combination works." },
      { lines: [20, 21, 22, 23], say: "One component, nine combinations, zero duplicated class lists." },
    ],
    practice: { task: "Add an `icon` size (a square 40×40 button) and a `ghost` variant (transparent, ink text, light hover).",
      hint: "size.icon: \"h-10 w-10 p-0\".",
      solution: { lang: "jsx", run: "check", code:
`const extra = {
  variant: { ghost: "bg-transparent text-ink hover:bg-ink/5" },
  size: { icon: "h-10 w-10 p-0" },
};` } },
    check: [
      { q: "Why name a token --color-danger instead of --color-red-500?", options: ["Shorter", "It says what the color is for, so it can change without renaming", "Required by Tailwind", "SEO"], answer: 1, why: "Semantic tokens survive a rebrand." },
      { q: "What does tailwind-merge solve?", options: ["Bundle size", "Conflicting classes like p-4 and p-2 both applying", "Dark mode", "Purging"], answer: 1, why: "It keeps the last conflicting utility." },
    ],
  },
  {
    id: "a-tw-motion", title: "Animations in Tailwind", minutes: 25,
    goal: "Use built-in animation utilities and define your own keyframes in the theme.",
    body: [
      "Built-in: `animate-spin`, `animate-ping`, `animate-pulse`, `animate-bounce`, plus `transition`, `duration-300`, `ease-out`.",
      "Define your own in `@theme`: an `--animate-*` variable plus an `@keyframes` block creates a class like `animate-fade-up`.",
      "`motion-safe:` and `motion-reduce:` variants respect the user's reduced-motion setting.",
      "Animate in and out with state classes: `opacity-0 translate-y-2` → `opacity-100 translate-y-0`, plus `transition duration-200`.",
    ],
    example: { lang: "css", code:
`@import "tailwindcss";

@theme {
  --animate-fade-up: fade-up 400ms ease-out both;
  --animate-shimmer: shimmer 1.4s linear infinite;

  @keyframes fade-up {
    from { opacity: 0; transform: translateY(12px); }
  }
  @keyframes shimmer {
    from { background-position: -200% 0; }
    to { background-position: 200% 0; }
  }
}

/* Usage in HTML:
   <li class="motion-safe:animate-fade-up">…</li>
   <div class="h-4 rounded bg-linear-to-r from-slate-200 via-white to-slate-200 bg-size-[200%_100%] motion-safe:animate-shimmer"></div>
   <button class="transition duration-200 hover:-translate-y-0.5 motion-reduce:transition-none">Save</button>
*/` },
    demo: [
      { lines: [4], say: "This variable creates the animate-fade-up class." },
      { lines: [5], say: "A shimmer for skeleton loaders." },
      { lines: [7, 8, 9], say: "Keyframes live inside @theme, next to the variable that uses them." },
      { lines: [17], say: "motion-safe: only animates for people who haven't asked for less motion." },
      { lines: [18], say: "A skeleton line: gradient plus the shimmer animation." },
      { lines: [19], say: "A small lift on hover, switched off for reduced motion." },
    ],
    practice: { task: "Add a `--animate-pop` that scales from 0.9 to 1 with a fade, over 150ms, for toast notifications.",
      hint: "One keyframe `from { opacity: 0; transform: scale(0.9); }` is enough.",
      solution: { lang: "css", code: "@theme {\n  --animate-pop: pop 150ms ease-out both;\n  @keyframes pop {\n    from { opacity: 0; transform: scale(0.9); }\n  }\n}" } },
    check: [
      { q: "motion-safe:animate-spin spins…", options: ["Always", "Only when the user hasn't requested reduced motion", "Only on hover", "Never"], answer: 1, why: "motion-safe respects the OS setting." },
      { q: "In Tailwind v4, a custom animation class comes from…", options: ["A JS config only", "An --animate-* variable in @theme", "An @apply rule", "A plugin only"], answer: 1, why: "Theme variables generate utilities." },
    ],
  },
  {
    id: "a-tw-maintain", title: "Custom utilities and keeping class lists maintainable", minutes: 25,
    goal: "Add your own utilities, and keep long class lists readable as a project grows.",
    body: [
      "`@utility` creates a real utility that works with every variant (`hover:`, `md:`): `@utility content-auto { content-visibility: auto; }`.",
      "**Prettier's Tailwind plugin** sorts classes into a consistent order automatically, so diffs and reviews stay clean.",
      "`clsx` (or a small helper) builds conditional class lists without string-gluing bugs.",
      "When a class list gets very long, it's usually a sign to extract a component, not to write CSS.",
    ],
    example: { lang: "css", code:
`@import "tailwindcss";

@utility content-auto {
  content-visibility: auto;
}

@utility scrollbar-hidden {
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
}

@utility text-balance-safe {
  text-wrap: balance;
  overflow-wrap: anywhere;
}

/* Usage:
   <section class="content-auto">…long list…</section>
   <div class="flex gap-3 overflow-x-auto md:scrollbar-hidden">…chips…</div>
   <h1 class="text-4xl font-bold text-balance-safe">…</h1>

   .prettierrc → { "plugins": ["prettier-plugin-tailwindcss"] }
*/` },
    demo: [
      { lines: [3, 4, 5], say: "content-visibility: auto skips rendering off-screen sections, a big speed-up for long pages." },
      { lines: [7, 8, 9, 10], say: "A utility can have nested selectors, here for WebKit's scrollbar." },
      { lines: [18, 19, 20], say: "They work with variants like md: just like built-in utilities." },
      { lines: [22], say: "One line of config, and class order is never argued about again." },
    ],
    practice: { task: "Rewrite with clsx: `className={\"btn \" + (active ? \"btn-active \" : \"\") + (disabled ? \"opacity-50\" : \"\")}`",
      hint: "clsx takes strings and objects of class → condition.",
      solution: { lang: "jsx", run: "check", code: `import clsx from "clsx";\nconst cls = clsx("btn", { "btn-active": active, "opacity-50": disabled });` } },
    check: [
      { q: "Why @utility instead of a normal CSS class?", options: ["Faster", "It works with variants like hover: and md:", "Required for colors", "Smaller output"], answer: 1, why: "It's registered as a real Tailwind utility." },
      { q: "A component's class list is 40 classes long. Best move?", options: ["@apply everything", "Extract a component (or a smaller sub-component)", "Inline styles", "Ignore it"], answer: 1, why: "The component is the unit of reuse." },
    ],
  },
];
