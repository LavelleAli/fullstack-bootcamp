// Intermediate lessons: HTML, CSS, JavaScript, APIs, TypeScript, Tailwind
export const html = [
  {
    id: "i-html-forms", title: "Accessible forms: groups, hints and errors", minutes: 25,
    goal: "Group related inputs and connect hints and error messages to the right field.",
    body: [
      "Radio buttons and checkboxes that answer one question belong in a `<fieldset>` with a `<legend>`. Screen readers read the legend before each option, so \"Small\" becomes \"Size: Small\".",
      "Connect hint text to its input with `aria-describedby=\"hint-id\"`. It's read after the label.",
      "When a field is wrong, set `aria-invalid=\"true\"` and point `aria-describedby` at the error message too. Put the error **next to the field**, in words, not only in red.",
      "Use `autocomplete` values (`email`, `new-password`, `postal-code`) so browsers and password managers can fill the form.",
    ],
    example: { lang: "html", code:
`<form novalidate>
  <fieldset>
    <legend>Pizza size</legend>
    <label><input type="radio" name="size" value="s"> Small</label>
    <label><input type="radio" name="size" value="l"> Large</label>
  </fieldset>

  <label for="zip">Postcode</label>
  <input id="zip" name="zip" autocomplete="postal-code"
         aria-describedby="zip-hint zip-error" aria-invalid="true">
  <p id="zip-hint">We deliver within 5 miles.</p>
  <p id="zip-error" class="error">Enter a 5-digit postcode, like 30301.</p>

  <button type="submit">Order</button>
</form>` },
    demo: [
      { lines: [1], say: "`novalidate` turns off the browser's pop-ups so you can show your own messages." },
      { lines: [2, 3, 4, 5, 6], say: "The fieldset groups the radios, and the legend names the group." },
      { lines: [9, 10], say: "`autocomplete` lets the browser fill it. `aria-describedby` lists two ids: the hint and the error." },
      { lines: [10], say: "`aria-invalid=\"true\"` tells screen readers the value is wrong." },
      { lines: [11, 12], say: "The hint and error are read after the label. The error says how to fix the problem." },
    ],
    practice: { task: "Add a \"Toppings\" group of three checkboxes, and a phone field with a hint \"We text when your order is ready\".",
      hint: "A fieldset and legend for the checkboxes. `type=\"tel\"`, `autocomplete=\"tel\"` and aria-describedby for the phone.",
      solution: { lang: "html", code:
`<fieldset>
  <legend>Toppings</legend>
  <label><input type="checkbox" name="top" value="cheese"> Cheese</label>
  <label><input type="checkbox" name="top" value="olive"> Olive</label>
  <label><input type="checkbox" name="top" value="basil"> Basil</label>
</fieldset>
<label for="phone">Phone</label>
<input id="phone" name="phone" type="tel" autocomplete="tel" aria-describedby="phone-hint">
<p id="phone-hint">We text when your order is ready.</p>` } },
    check: [
      { q: "What reads a group's name before each radio option?", options: ["A <div> with a heading", "<fieldset> + <legend>", "placeholder", "title"], answer: 1, why: "The legend is announced as the group label." },
      { q: "How do you tie an error message to an input?", options: ["Put it in red", "aria-describedby pointing at the message's id", "alt text", "A tooltip"], answer: 1, why: "aria-describedby links extra text to the field." },
    ],
  },
  {
    id: "i-html-media", title: "Responsive images, video and captions", minutes: 25,
    goal: "Serve the right image size for each screen, and caption your videos.",
    body: [
      "`srcset` lists the same image at several widths, and `sizes` tells the browser how wide the image will be shown. The browser then downloads the smallest file that looks sharp.",
      "`<picture>` with `<source type=\"image/avif\">` offers modern formats, with the `<img>` as the fallback.",
      "Always set `width` and `height` on images. The browser reserves the space, so the page doesn't jump when the image loads (that jump is called layout shift).",
      "`loading=\"lazy\"` waits to load images until they're near the screen. **Don't** lazy-load the main image at the top of the page.",
      "Videos need captions: a `<track kind=\"captions\">` pointing at a `.vtt` file.",
    ],
    example: { lang: "html", code:
`<picture>
  <source type="image/avif" srcset="loaf-400.avif 400w, loaf-800.avif 800w">
  <img src="loaf-800.jpg"
       srcset="loaf-400.jpg 400w, loaf-800.jpg 800w"
       sizes="(min-width: 768px) 50vw, 100vw"
       width="800" height="600" alt="Sourdough loaf cut in half"
       loading="lazy">
</picture>

<video controls width="640" poster="kneading.jpg">
  <source src="kneading.mp4" type="video/mp4">
  <track kind="captions" src="kneading.en.vtt" srclang="en" label="English" default>
</video>` },
    demo: [
      { lines: [2], say: "Browsers that support AVIF (a smaller format) use this source." },
      { lines: [3, 4], say: "Everyone else gets JPEG, at 400px or 800px wide." },
      { lines: [5], say: "Half the screen on tablets and up, the full width on phones. The browser does the maths." },
      { lines: [6], say: "width and height reserve space, and alt describes the image." },
      { lines: [7], say: "Below the fold, so load it lazily." },
      { lines: [10, 11, 12, 13], say: "A video with controls, a poster frame, and English captions on by default." },
    ],
    practice: { task: "Mark up a hero image that's always full width, comes in 640, 1280 and 1920 sizes, and must load immediately.",
      hint: "`sizes=\"100vw\"`, no loading=\"lazy\", and add `fetchpriority=\"high\"`.",
      solution: { lang: "html", code:
`<img src="hero-1280.jpg"
     srcset="hero-640.jpg 640w, hero-1280.jpg 1280w, hero-1920.jpg 1920w"
     sizes="100vw" width="1920" height="800"
     alt="Bakers shaping dough at dawn" fetchpriority="high">` } },
      check: [
        { q: "Why set width and height on <img>?", options: ["To resize it", "So the browser reserves space and the layout doesn't jump", "SEO only", "It's required for srcset"], answer: 1, why: "It prevents layout shift while the image loads." },
        { q: "Which image should NOT be lazy-loaded?", options: ["Footer logos", "The main image at the top of the page", "Gallery thumbnails", "Images in tabs"], answer: 1, why: "Lazy-loading the hero delays your most important content." },
      ],
  },
  {
    id: "i-html-meta", title: "Metadata for search and sharing, plus <details>", minutes: 20,
    goal: "Write head tags for search results and link previews, and use native disclosure widgets.",
    body: [
      "Every page needs its own `<title>` (about 50–60 characters) and `<meta name=\"description\">` (about 150 characters). Search results show them.",
      "**Open Graph** tags (`og:title`, `og:description`, `og:image`) control the preview card when someone shares your link. Share images are usually 1200×630.",
      "`<link rel=\"canonical\">` tells search engines the main URL when the same page is reachable at several addresses.",
      "`<details>` and `<summary>` make a show/hide section with keyboard support and no JavaScript. They're good for FAQs.",
    ],
    example: { lang: "html", code:
`<head>
  <title>Sourdough Classes in Atlanta | Jordan's Bakery</title>
  <meta name="description" content="Hands-on 3-hour sourdough classes every Saturday. Take home your own starter.">
  <link rel="canonical" href="https://jordansbakery.com/classes">
  <meta property="og:title" content="Sourdough Classes | Jordan's Bakery">
  <meta property="og:image" content="https://jordansbakery.com/og/classes.jpg">
</head>

<details>
  <summary>Do I need to bring anything?</summary>
  <p>Just an apron. We supply flour, bowls and a starter jar.</p>
</details>` },
    demo: [
      { lines: [2], say: "Specific, with the most important words first." },
      { lines: [3], say: "Written for people reading search results: what you get and why." },
      { lines: [4], say: "The one true URL for this page." },
      { lines: [5, 6], say: "What a shared link shows. Image URLs must be absolute (start with https)." },
      { lines: [9, 10, 11, 12], say: "A collapsible answer. Clicking or pressing Enter on the summary toggles it." },
    ],
    practice: { task: "Write the title and description for your portfolio's Projects page, and an FAQ item asking \"Are you open to remote work?\".",
      hint: "Title: what it is, then your name. Description: one useful sentence.",
      solution: { lang: "html", code:
`<title>Projects | Alex Rivera, Frontend Developer</title>
<meta name="description" content="React and Next.js projects with live demos and source code: e-commerce, dashboards and games.">

<details>
  <summary>Are you open to remote work?</summary>
  <p>Yes, remote or hybrid in the Atlanta area.</p>
</details>` } },
    check: [
      { q: "What controls a link's preview card on social apps?", options: ["meta keywords", "Open Graph tags", "The h1", "robots.txt"], answer: 1, why: "og: tags define the title, description and image." },
      { q: "<details> needs JavaScript to open and close.", options: ["True", "False"], answer: 1, why: "It's built into the browser, keyboard support included." },
    ],
  },
];

export const css = [
  {
    id: "i-css-grid", title: "CSS Grid layouts", minutes: 30,
    goal: "Build two-dimensional layouts with grid, including auto-fitting card grids.",
    body: [
      "Flexbox lines things up in **one** direction. **Grid** controls rows **and** columns at once.",
      "`grid-template-columns: 200px 1fr` makes a fixed sidebar and a flexible main area. `fr` means \"a share of the leftover space\".",
      "`repeat(auto-fill, minmax(220px, 1fr))` is the famous responsive card grid: as many 220px+ columns as fit, with no media queries.",
      "`grid-template-areas` names regions so the layout reads like a picture, and it's easy to rearrange for phones.",
    ],
    example: { lang: "css", code:
`.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}

.page {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-areas: "header" "main" "footer";
}
@media (min-width: 900px) {
  .page {
    grid-template-columns: 240px 1fr;
    grid-template-areas: "header header" "side main" "footer footer";
  }
}
.page > header { grid-area: header; }
.page > main { grid-area: main; }` },
    demo: [
      { lines: [1, 2, 3, 4, 5], say: "Cards at least 220px wide. The browser fits as many columns as it can, with no breakpoints." },
      { lines: [7, 8, 9, 10, 11], say: "Phones: one column, with areas stacked header, main, footer." },
      { lines: [12, 13, 14, 15], say: "Wider screens: a 240px sidebar plus a flexible main column." },
      { lines: [15], say: "The areas string draws the layout. The header spans both columns." },
      { lines: [18, 19], say: "Each child says which area it fills." },
    ],
    practice: { task: "Make a photo gallery where the first photo is twice as wide and twice as tall as the others.",
      hint: "On the first item: `grid-column: span 2; grid-row: span 2;`",
      solution: { lang: "css", code:
`.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  grid-auto-rows: 150px;
  gap: 8px;
}
.gallery > :first-child {
  grid-column: span 2;
  grid-row: span 2;
}` } },
    check: [
      { q: "What does 1fr mean?", options: ["1 pixel", "One share of the leftover space", "1% of the width", "One row"], answer: 1, why: "fr divides the free space between tracks." },
      { q: "repeat(auto-fill, minmax(200px, 1fr)) needs media queries to be responsive.", options: ["True", "False"], answer: 1, why: "The column count adapts on its own." },
    ],
  },
  {
    id: "i-css-vars", title: "Custom properties and dark mode", minutes: 25,
    goal: "Store design values in CSS variables and switch them for dark mode.",
    body: [
      "**Custom properties** (CSS variables) store a value once: `--brand: #87ceeb;`, then `color: var(--brand);`.",
      "Define them on `:root` so the whole page can use them. Change the variable and everything using it updates.",
      "**Dark mode:** redefine the same variables inside `@media (prefers-color-scheme: dark)`. Components never mention themes; they just use the variables.",
      "`var(--gap, 16px)` gives a fallback value if the variable isn't set.",
    ],
    example: { lang: "css", code:
`:root {
  --bg: #ffffff;
  --text: #0c2131;
  --accent: #0a6c9f;
  --radius: 10px;
}
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #0a1621;
    --text: #ecf6fc;
    --accent: #87ceeb;
  }
}
body { background: var(--bg); color: var(--text); }
.btn {
  background: var(--accent);
  border-radius: var(--radius);
  padding: var(--btn-pad, 8px 16px);
}` },
    demo: [
      { lines: [1, 2, 3, 4, 5, 6], say: "Light theme values, defined once." },
      { lines: [7, 8, 9, 10, 11, 12, 13], say: "When the device is in dark mode, the same names get dark values." },
      { lines: [14], say: "The body reads the variables, so it follows the theme automatically." },
      { lines: [15, 16, 17, 18, 19], say: "The button uses tokens too. `--btn-pad` isn't defined, so the fallback is used." },
    ],
    practice: { task: "Add a manual dark mode: when `<html data-theme=\"dark\">` is set, use the dark values even if the device is light.",
      hint: "A selector `:root[data-theme=\"dark\"] { ... }` with the same dark values.",
      solution: { lang: "css", code:
`:root[data-theme="dark"] {
  --bg: #0a1621;
  --text: #ecf6fc;
  --accent: #87ceeb;
}` } },
    check: [
      { q: "How do you read a custom property?", options: ["$brand", "var(--brand)", "@brand", "--brand()"], answer: 1, why: "var() reads it, with an optional fallback." },
      { q: "Best way to support dark mode?", options: ["Duplicate every rule", "Redefine the color variables for dark mode", "Invert the page", "Use !important"], answer: 1, why: "Swap the tokens, not the components." },
    ],
  },
  {
    id: "i-css-motion", title: "Transitions, keyframes and sticky positioning", minutes: 25,
    goal: "Animate state changes smoothly and keep a header stuck while scrolling.",
    body: [
      "`transition: transform 200ms ease` animates a property whenever it changes, such as on hover.",
      "`@keyframes` defines a multi-step animation, and `animation:` runs it.",
      "Animate **transform** and **opacity** only. They're cheap for the browser. Animating `width`, `top` or `margin` makes the page recalculate layout every frame, which is slow.",
      "`position: sticky; top: 0;` keeps an element in place once you scroll past it, like a table header or a navbar.",
      "Respect `prefers-reduced-motion`: some people get dizzy from motion.",
    ],
    example: { lang: "css", code:
`.card {
  transition: transform 200ms ease, box-shadow 200ms ease;
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgb(0 0 0 / 0.15);
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
.loading { animation: pulse 1.2s ease-in-out infinite; }

.navbar { position: sticky; top: 0; z-index: 10; }

@media (prefers-reduced-motion: reduce) {
  .card, .loading { transition: none; animation: none; }
}` },
    demo: [
      { lines: [1, 2, 3], say: "Animate two properties for 200ms whenever they change." },
      { lines: [4, 5, 6, 7], say: "On hover the card lifts. Only transform and shadow change." },
      { lines: [9, 10, 11, 12], say: "A keyframe animation that fades out and back in." },
      { lines: [13], say: "Run it forever, for a loading indicator." },
      { lines: [15], say: "The navbar sticks to the top once you scroll." },
      { lines: [17, 18, 19], say: "People who ask for less motion get none." },
    ],
    practice: { task: "Make a button that grows slightly (scale 1.05) on hover and focus, over 150ms.",
      hint: "Use `:hover, :focus-visible` together, and transition transform.",
      solution: { lang: "css", code:
`.btn { transition: transform 150ms ease; }
.btn:hover, .btn:focus-visible { transform: scale(1.05); }
@media (prefers-reduced-motion: reduce) { .btn { transition: none; } }` } },
    check: [
      { q: "Which is cheapest to animate?", options: ["width", "top", "transform", "margin"], answer: 2, why: "transform and opacity skip layout and paint work." },
      { q: "position: sticky needs…", options: ["A z-index", "A top (or bottom) value", "JavaScript", "position: fixed on the parent"], answer: 1, why: "It sticks at the offset you give it." },
    ],
  },
];

export const js = [
  {
    id: "i-js-objects", title: "Destructuring, spread and optional chaining", minutes: 25,
    goal: "Pull values out of objects and arrays, copy them safely, and read nested data without crashing.",
    body: [
      "**Destructuring** unpacks values: `const { name, age } = user;` and `const [first, second] = list;`. You can rename (`{ name: fullName }`) and set defaults (`{ role = \"guest\" }`).",
      "**Spread** `...` copies: `{ ...user, age: 31 }` makes a new object with one property changed. That's how React state is updated.",
      "**Rest** gathers what's left: `const { password, ...safe } = user;`.",
      "**Optional chaining** `user?.address?.city` returns `undefined` instead of crashing when something in the chain is missing. `??` gives a default only for `null`/`undefined`.",
    ],
    example: { lang: "js", run: "node", code:
`const user = { name: "Ana", age: 30, password: "x1", address: null };

const { name, role = "guest" } = user;
console.log(name, role);

const older = { ...user, age: 31 };
console.log(user.age, older.age);

const { password, ...safe } = user;
console.log(Object.keys(safe));

console.log(user.address?.city ?? "No city");

const [first, , third] = ["a", "b", "c"];
console.log(first, third);`,
      output: "Ana guest\n30 31\n[ 'name', 'age', 'address' ]\nNo city\na c" },
    demo: [
      { lines: [3, 4], say: "Unpack name, and give role a default because it's missing.", out: "Ana guest" },
      { lines: [6, 7], say: "Spread copies the object and changes age. The original is untouched.", out: "30 31" },
      { lines: [9, 10], say: "Rest gathers everything except password, which is handy before sending data to the browser.", out: "[ 'name', 'age', 'address' ]" },
      { lines: [12], say: "address is null, so ?. stops safely and ?? supplies the fallback.", out: "No city" },
      { lines: [14, 15], say: "Array destructuring. Skip a slot with an empty comma.", out: "a c" },
    ],
    practice: { task: "Write `updateQty(cart, id, qty)` that returns a NEW cart object with one item's quantity changed, without changing the original.",
      hint: "`{ ...cart, [id]: qty }`",
      solution: { lang: "js", run: "node", code:
`function updateQty(cart, id, qty) {
  return { ...cart, [id]: qty };
}
const cart = { p1: 1, p2: 3 };
const next = updateQty(cart, "p2", 5);
console.log(cart.p2, next.p2);`, output: "3 5" } },
    check: [
      { q: "What does user?.profile?.bio return if profile is undefined?", options: ["Throws an error", "undefined", "null", "\"\""], answer: 1, why: "Optional chaining stops and returns undefined." },
      { q: "0 ?? 5 is…", options: ["5", "0", "null", "error"], answer: 1, why: "?? only replaces null or undefined. 0 is kept." },
    ],
  },
  {
    id: "i-js-arrays", title: "reduce, find, some, every and sort", minutes: 30,
    goal: "Summarize and search arrays, and sort them without mutating the original.",
    body: [
      "`reduce` turns an array into **one** value: a total, an object, a grouping. It takes `(accumulator, item) => newAccumulator` and a starting value.",
      "`find` returns the first matching item (or `undefined`). `some` asks \"does any match?\" and `every` asks \"do all match?\". Both return a boolean.",
      "`sort` **changes the original array** and compares as strings by default, so `[10, 9, 1].sort()` gives `[1, 10, 9]`. Pass a compare function: `(a, b) => a - b`.",
      "Use `toSorted()` (or `[...arr].sort()`) to get a sorted copy and leave the original alone.",
    ],
    example: { lang: "js", run: "node", code:
`const orders = [
  { id: 1, total: 40, paid: true },
  { id: 2, total: 15, paid: false },
  { id: 3, total: 90, paid: true },
];

const revenue = orders.reduce((sum, o) => sum + o.total, 0);
console.log(revenue);

console.log(orders.find((o) => !o.paid).id);
console.log(orders.some((o) => o.total > 80), orders.every((o) => o.paid));

const byTotal = orders.toSorted((a, b) => b.total - a.total).map((o) => o.id);
console.log(byTotal, orders[0].id);

console.log([10, 9, 1].sort(), [10, 9, 1].sort((a, b) => a - b));`,
      output: "145\n2\ntrue false\n[ 3, 1, 2 ] 1\n[ 1, 10, 9 ] [ 1, 9, 10 ]" },
    demo: [
      { lines: [7, 8], say: "Start the sum at 0 and add each total.", out: "145" },
      { lines: [10], say: "find returns the first unpaid order.", out: "2" },
      { lines: [11], say: "Is any total over 80? Are all paid?", out: "true false" },
      { lines: [13, 14], say: "toSorted returns a copy, biggest first. The original order is unchanged.", out: "[ 3, 1, 2 ] 1" },
      { lines: [16], say: "The classic trap: sort without a compare function sorts as text.", out: "[ 1, 10, 9 ] [ 1, 9, 10 ]" },
    ],
    practice: { task: "Use reduce to group `[\"apple\", \"avocado\", \"banana\"]` by first letter: `{ a: [\"apple\", \"avocado\"], b: [\"banana\"] }`.",
      hint: "Start with `{}`. For each word, push it into `acc[word[0]]`, creating the array if needed.",
      solution: { lang: "js", run: "node", code:
`const words = ["apple", "avocado", "banana"];
const groups = words.reduce((acc, w) => {
  (acc[w[0]] ??= []).push(w);
  return acc;
}, {});
console.log(groups);`, output: "{ a: [ 'apple', 'avocado' ], b: [ 'banana' ] }" } },
    check: [
      { q: "[3, 20, 100].sort() gives…", options: ["[3, 20, 100]", "[100, 20, 3]", "[100, 3, 20]", "An error"], answer: 1, why: "As strings, \"100\" < \"20\" < \"3\". Always pass a compare function for numbers." },
      { q: "Which returns a boolean?", options: ["find", "some", "reduce", "map"], answer: 1, why: "some and every return true or false." },
    ],
  },
  {
    id: "i-js-async", title: "Promises in depth: parallel requests and errors", minutes: 30,
    goal: "Run async work in parallel, handle failures, and always clean up.",
    body: [
      "Awaiting requests one after another makes the waits add up. `Promise.all([a(), b()])` runs them **at the same time** and waits for all of them.",
      "`Promise.all` rejects as soon as **one** fails. `Promise.allSettled` waits for all and tells you which succeeded.",
      "`try / catch / finally`: `finally` always runs, so it's where you turn off loading spinners.",
      "Throw your own `Error` with a clear message when something's wrong. Callers catch it in one place.",
    ],
    example: { lang: "js", run: "node", code:
`const wait = (ms, value, fail) =>
  new Promise((resolve, reject) =>
    setTimeout(() => (fail ? reject(new Error(value)) : resolve(value)), ms));

async function main() {
  const start = Date.now();
  const [user, posts] = await Promise.all([wait(100, "user"), wait(100, "posts")]);
  console.log(user, posts, Date.now() - start < 180 ? "in parallel" : "one by one");

  const results = await Promise.allSettled([wait(10, "ok"), wait(10, "boom", true)]);
  console.log(results.map((r) => r.status));

  let loading = true;
  try {
    await wait(10, "network down", true);
  } catch (err) {
    console.log("Caught:", err.message);
  } finally {
    loading = false;
  }
  console.log("loading:", loading);
}
main();`,
      output: "user posts in parallel\n[ 'fulfilled', 'rejected' ]\nCaught: network down\nloading: false" },
    demo: [
      { lines: [1, 2, 3], say: "A fake request: it resolves or rejects after a delay." },
      { lines: [7, 8], say: "Both 100ms waits run together, so the total is about 100ms, not 200ms.", out: "user posts in parallel" },
      { lines: [10, 11], say: "allSettled reports every result, even the failure.", out: "[ 'fulfilled', 'rejected' ]" },
      { lines: [14, 15, 16, 17], say: "The awaited promise rejects, so control jumps to catch.", out: "Caught: network down" },
      { lines: [18, 19, 20], say: "finally runs either way, so loading always ends.", out: "loading: false" },
    ],
    practice: { task: "Write `withTimeout(promise, ms)` that rejects with \"Timed out\" if the promise takes longer than ms.",
      hint: "`Promise.race` with a promise that rejects after ms.",
      solution: { lang: "js", run: "node", code:
`function withTimeout(promise, ms) {
  const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error("Timed out")), ms));
  return Promise.race([promise, timeout]);
}
withTimeout(new Promise((r) => setTimeout(() => r("done"), 500)), 50)
  .then(console.log)
  .catch((e) => console.log(e.message));`, output: "Timed out" } },
    check: [
      { q: "Promise.all with one rejected promise…", options: ["Resolves with the others", "Rejects", "Waits forever", "Retries"], answer: 1, why: "all rejects on the first failure. Use allSettled to get every result." },
      { q: "Where should you stop a loading spinner?", options: ["In try only", "In catch only", "In finally", "After the function"], answer: 2, why: "finally runs on success and on failure." },
    ],
  },
];

export const apis = [
  {
    id: "i-api-requests", title: "Query strings, headers and POST bodies", minutes: 25,
    goal: "Build URLs safely and send JSON with the right headers.",
    body: [
      "`URLSearchParams` builds query strings and escapes spaces and symbols for you. Never glue user input into a URL by hand.",
      "**Headers** carry information about the request: `Content-Type: application/json` says the body is JSON, and `Authorization: Bearer <token>` proves who you are.",
      "To POST JSON with fetch, set the method and that header, and `JSON.stringify` the body.",
      "Check `response.ok` before reading the body, and read error details from it when there are some.",
    ],
    example: { lang: "js", run: "node", code:
`const params = new URLSearchParams({ q: "sour dough & rye", page: 2 });
console.log("/api/search?" + params);

function postJson(url, data, token) {
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(data),
  });
}

const url = new URL("https://api.example.com/products");
url.searchParams.set("category", "bread");
url.searchParams.set("sort", "price");
console.log(url.toString());
console.log(typeof postJson);`,
      output: "/api/search?q=sour+dough+%26+rye&page=2\nhttps://api.example.com/products?category=bread&sort=price\nfunction" },
    demo: [
      { lines: [1, 2], say: "Spaces and & are escaped, so the server reads the search correctly.", out: "/api/search?q=sour+dough+%26+rye&page=2" },
      { lines: [4, 5, 6], say: "A reusable helper for POST requests." },
      { lines: [7, 8, 9, 10], say: "Say the body is JSON, and send a token to prove who you are." },
      { lines: [11], say: "The body must be a string, so stringify the object." },
      { lines: [15, 16, 17, 18], say: "The URL object is another safe way to build query strings.", out: "https://api.example.com/products?category=bread&sort=price" },
    ],
    practice: { task: "Build the URL for page 3 of a search for \"café latte\" on https://api.example.com/search using the URL object.",
      hint: "`url.searchParams.set(\"q\", \"café latte\")` and `set(\"page\", 3)`.",
      solution: { lang: "js", run: "node", code:
`const url = new URL("https://api.example.com/search");
url.searchParams.set("q", "café latte");
url.searchParams.set("page", 3);
console.log(url.href);`, output: "https://api.example.com/search?q=caf%C3%A9+latte&page=3" } },
    check: [
      { q: "Which header says the body is JSON?", options: ["Accept: json", "Content-Type: application/json", "Body-Type: JSON", "Authorization"], answer: 1, why: "Content-Type describes the body you're sending." },
      { q: "Why use URLSearchParams?", options: ["It's faster", "It escapes special characters correctly", "It's required by fetch", "It caches results"], answer: 1, why: "Hand-built URLs break on spaces, & and other symbols." },
    ],
  },
  {
    id: "i-api-states", title: "Loading, error and empty states", minutes: 25,
    goal: "Model every state a request can be in, so the UI never shows a blank screen.",
    body: [
      "A request isn't just \"have data\". It's **idle**, **loading**, **success**, **empty** (success but nothing to show) or **error**.",
      "Track one `status` string instead of several booleans. `isLoading` and `isError` both true at once is a bug waiting to happen.",
      "Each state gets its own UI: a skeleton for loading, a friendly message with a retry for error, and a helpful nudge for empty.",
      "This pattern carries straight into React state.",
    ],
    example: { lang: "js", run: "node", code:
`async function load(fetcher) {
  let state = { status: "loading", data: null, error: null };
  try {
    const data = await fetcher();
    state = data.length
      ? { status: "success", data, error: null }
      : { status: "empty", data: [], error: null };
  } catch (err) {
    state = { status: "error", data: null, error: err.message };
  }
  return state;
}

function view(state) {
  switch (state.status) {
    case "loading": return "Loading…";
    case "error": return "Couldn't load books. " + state.error + " [Retry]";
    case "empty": return "No books yet. Add your first one!";
    case "success": return state.data.length + " books";
  }
}

(async () => {
  console.log(view(await load(async () => ["Dune", "Kindred"])));
  console.log(view(await load(async () => [])));
  console.log(view(await load(async () => { throw new Error("Server is down."); })));
})();`,
      output: "2 books\nNo books yet. Add your first one!\nCouldn't load books. Server is down. [Retry]" },
    demo: [
      { lines: [2], say: "One status string, starting at loading." },
      { lines: [4, 5, 6, 7], say: "Success with no items is its own state: empty." },
      { lines: [8, 9], say: "A failure becomes the error state, with the message kept." },
      { lines: [14, 15, 16, 17, 18, 19], say: "One switch picks the UI for each state." },
      { lines: [23], say: "Two books came back, so it shows the count.", out: "2 books" },
      { lines: [24], say: "An empty list gets a helpful message, not a blank area.", out: "No books yet. Add your first one!" },
      { lines: [25], say: "Errors show what happened and offer a retry.", out: "Couldn't load books. Server is down. [Retry]" },
    ],
    practice: { task: "Add an \"idle\" state for a search box before the user has typed anything, with the message \"Type to search\".",
      hint: "Add a case to view(), and start in idle until the first search.",
      solution: { lang: "js", run: "node", code:
`function view(state) {
  if (state.status === "idle") return "Type to search";
  return state.status;
}
console.log(view({ status: "idle" }));`, output: "Type to search" } },
    check: [
      { q: "Why one status string instead of isLoading + isError?", options: ["Shorter", "Impossible combinations can't happen", "Faster", "Required by React"], answer: 1, why: "A single status can only be one thing at a time." },
      { q: "A successful request returns []. Which state?", options: ["error", "loading", "empty", "success"], answer: 2, why: "Empty deserves its own message." },
    ],
  },
  {
    id: "i-api-axios", title: "API keys, axios instances and interceptors", minutes: 25,
    goal: "Keep keys out of your code and configure axios once for a whole app.",
    body: [
      "**Never commit API keys.** Put them in `.env.local` (and add it to `.gitignore`), then read them with `process.env.MY_KEY`.",
      "Anything sent to the browser can be read by anyone. In Next.js, only variables starting with `NEXT_PUBLIC_` reach the browser. **Secret keys belong on the server only**, so call the API from a server component or route handler.",
      "`axios.create({ baseURL, timeout, headers })` makes a configured client, so every call shares the same settings.",
      "**Interceptors** run on every request or response. Use them to add an auth token, or to turn every error into one friendly message.",
    ],
    example: { lang: "js", run: "check", code:
`import axios from "axios";

export const api = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  timeout: 8000,
});

api.interceptors.request.use((config) => {
  config.headers.Authorization = "Bearer " + process.env.TMDB_TOKEN;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error.response?.status;
    const message = status === 401 ? "Bad API token" : status === 404 ? "Not found" : "Network problem";
    return Promise.reject(new Error(message));
  },
);

export const searchMovies = (q, page = 1) =>
  api.get("/search/movie", { params: { query: q, page } }).then((r) => r.data);` },
    demo: [
      { lines: [3, 4, 5, 6], say: "One client with the base URL and an 8-second timeout." },
      { lines: [8, 9, 10, 11], say: "Every request gets the token from the environment, never from the code." },
      { lines: [13, 14], say: "Successful responses pass straight through." },
      { lines: [15, 16, 17, 18, 19], say: "Every failure becomes one clear message, written in one place." },
      { lines: [22, 23], say: "Callers stay tiny: a path plus params." },
    ],
    practice: { task: "Write the .env.local and .gitignore lines for a TMDB token, and say where in Next.js the searchMovies call should run.",
      hint: "Secret token, so not NEXT_PUBLIC_.",
      solution: { lang: "text", code: "# .env.local\nTMDB_TOKEN=eyJhbGciOi...\n\n# .gitignore\n.env*.local\n\nCall searchMovies from a server component or a route handler (app/api/search/route.js), never from a \"use client\" file." } },
    check: [
      { q: "A NEXT_PUBLIC_ variable is…", options: ["Secret", "Visible to anyone using the site", "Only on the server", "Encrypted"], answer: 1, why: "It's bundled into browser code." },
      { q: "What's a good use for a response interceptor?", options: ["Styling", "Turning every HTTP error into one friendly message", "Routing", "Caching CSS"], answer: 1, why: "It runs for every response, so error handling lives in one place." },
    ],
  },
];

export const ts = [
  {
    id: "i-ts-unions", title: "Union types and narrowing", minutes: 25,
    goal: "Describe values that can be one of several types, and narrow them safely.",
    body: [
      "A **union** says a value is one of several types: `string | number`, or literal values like `\"loading\" | \"success\" | \"error\"`.",
      "Before using a union, **narrow** it: `typeof x === \"string\"`, `Array.isArray(x)`, `\"key\" in obj`, or checking a shared property. Inside the check, TypeScript knows the exact type.",
      "**Discriminated unions** share a literal property (like `status`) and are the best way to model request state: each status carries exactly the data it needs.",
      "`never` in a `default` branch makes TypeScript warn you when you forget a case.",
    ],
    example: { lang: "ts", run: "ts", code:
`type Result =
  | { status: "loading" }
  | { status: "success"; data: string[] }
  | { status: "error"; message: string };

function render(r: Result): string {
  switch (r.status) {
    case "loading":
      return "Loading…";
    case "success":
      return r.data.join(", ");
    case "error":
      return "Error: " + r.message;
    default: {
      const unreachable: never = r;
      return unreachable;
    }
  }
}

function format(id: string | number): string {
  return typeof id === "number" ? "#" + id.toFixed(0) : id.toUpperCase();
}

console.log(render({ status: "success", data: ["Dune", "Beloved"] }));
console.log(render({ status: "error", message: "offline" }), format(7), format("ab"));`,
      output: "Dune, Beloved\nError: offline #7 AB" },
    demo: [
      { lines: [1, 2, 3, 4], say: "Three shapes, told apart by the status literal." },
      { lines: [7, 10, 11], say: "Inside case \"success\", TypeScript knows data exists." },
      { lines: [12, 13], say: "And here it knows message exists. Using r.data would be a type error." },
      { lines: [14, 15, 16], say: "If someone adds a new status and forgets a case, this line fails to compile." },
      { lines: [20, 21, 22], say: "typeof narrows a primitive union." },
      { lines: [24, 25], say: "Each call takes the right branch.", out: "Dune, Beloved\nError: offline #7 AB" },
    ],
    practice: { task: "Model a `Shape` union of circle (radius) and rect (width, height) with a `kind` property, and write `area(s: Shape)`.",
      hint: "`type Shape = { kind: \"circle\"; radius: number } | { kind: \"rect\"; width: number; height: number }`",
      solution: { lang: "ts", run: "ts", code:
`type Shape = { kind: "circle"; radius: number } | { kind: "rect"; width: number; height: number };
function area(s: Shape): number {
  return s.kind === "circle" ? Math.PI * s.radius ** 2 : s.width * s.height;
}
console.log(area({ kind: "rect", width: 3, height: 4 }), area({ kind: "circle", radius: 1 }).toFixed(2));`, output: "12 3.14" } },
    check: [
      { q: "What is narrowing?", options: ["Making a type smaller in memory", "Checking a value so TypeScript knows its exact type", "Removing properties", "A CSS term"], answer: 1, why: "Checks like typeof or a discriminant narrow a union." },
      { q: "Why the `never` default?", options: ["Speed", "Compile error if a case is forgotten", "Required syntax", "Runtime logging"], answer: 1, why: "Only an impossible value fits never." },
    ],
  },
  {
    id: "i-ts-generics", title: "Generics", minutes: 25,
    goal: "Write functions and types that work for any type, while staying type-safe.",
    body: [
      "A **generic** is a type parameter, like a function argument but for types: `function first<T>(items: T[]): T | undefined`.",
      "TypeScript usually **infers** T from what you pass in: `first([1, 2])` returns `number | undefined`.",
      "You see generics everywhere: `Array<string>`, `Promise<User>`, `useState<number>(0)`.",
      "`<T extends { id: string }>` **constrains** T: any type is fine as long as it has an id.",
    ],
    example: { lang: "ts", run: "ts", code:
`function first<T>(items: T[]): T | undefined {
  return items[0];
}

interface ApiResponse<T> {
  ok: boolean;
  data: T;
}

function byId<T extends { id: string }>(items: T[], id: string): T | undefined {
  return items.find((item) => item.id === id);
}

const n = first([10, 20]);
const res: ApiResponse<string[]> = { ok: true, data: ["a", "b"] };
const book = byId([{ id: "b1", title: "Dune" }], "b1");

console.log(n, res.data.length, book?.title);`,
      output: "10 2 Dune" },
    demo: [
      { lines: [1, 2, 3], say: "T is whatever type the array holds. The return type follows it." },
      { lines: [5, 6, 7, 8], say: "A generic interface: the response shape is the same, and the data type varies." },
      { lines: [10, 11, 12], say: "A constraint: T can be anything that has an id string." },
      { lines: [14], say: "T is inferred as number." },
      { lines: [16], say: "book is typed { id, title }, so book.title autocompletes." },
      { lines: [18], say: "All three are fully typed.", out: "10 2 Dune" },
    ],
    practice: { task: "Write a generic `groupBy<T>(items: T[], key: (item: T) => string): Record<string, T[]>`.",
      hint: "Like the reduce grouping exercise, with types added.",
      solution: { lang: "ts", run: "ts", code:
`function groupBy<T>(items: T[], key: (item: T) => string): Record<string, T[]> {
  const out: Record<string, T[]> = {};
  for (const item of items) (out[key(item)] ??= []).push(item);
  return out;
}
console.log(Object.keys(groupBy(["apple", "bean", "avocado"], (w) => w[0])));`, output: "[ 'a', 'b' ]" } },
    check: [
      { q: "In first<T>(items: T[]), what decides T?", options: ["You must always write it", "Usually inferred from the argument", "It's always any", "The return statement"], answer: 1, why: "TypeScript infers T from what you pass." },
      { q: "<T extends { id: string }> means…", options: ["T is exactly { id: string }", "T must at least have an id string", "T extends a class", "T is optional"], answer: 1, why: "extends constrains T to types with that shape." },
    ],
  },
  {
    id: "i-ts-react", title: "Typing React components and API data", minutes: 25,
    goal: "Type props, state, events and fetched JSON in a React + TypeScript project.",
    body: [
      "Type props with an interface, and destructure them in the parameters: `function Card({ title }: CardProps)`.",
      "`useState` infers simple types. For empty starting values, pass the type: `useState<User | null>(null)`.",
      "Events have types too: `React.ChangeEvent<HTMLInputElement>` and `React.FormEvent<HTMLFormElement>`.",
      "**JSON from an API is untrusted.** `await res.json()` is `any`. Give it a type, but remember that types don't check the data at runtime. For important data, validate it (with a schema library like Zod, in Advanced).",
    ],
    example: { lang: "ts", run: "check-tsx", code:
`import { useEffect, useState } from "react";

interface Book { id: number; title: string; author: string }
interface BookListProps { author?: string; onPick: (book: Book) => void }

export function BookList({ author, onPick }: BookListProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/api/books")
      .then((r) => r.json() as Promise<Book[]>)
      .then(setBooks);
  }, []);

  const shown = books.filter((b) => (!author || b.author === author) && b.title.toLowerCase().includes(query));

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value.toLowerCase());
  }

  return (
    <>
      <input aria-label="Search books" value={query} onChange={onChange} />
      <ul>{shown.map((b) => <li key={b.id}><button onClick={() => onPick(b)}>{b.title}</button></li>)}</ul>
    </>
  );
}` },
    demo: [
      { lines: [3], say: "The shape of one book from the API." },
      { lines: [4], say: "Props: an optional author filter and a callback that receives a Book." },
      { lines: [7], say: "An empty array needs a type, or TypeScript guesses never[]." },
      { lines: [12], say: "Tell TypeScript what the JSON is. Remember this isn't checked at runtime." },
      { lines: [18, 19, 20], say: "A typed event: e.target.value is known to be a string." },
      { lines: [25], say: "onPick(b) type-checks because b is a Book." },
    ],
    practice: { task: "Type a `Button` component that accepts a `variant` of \"primary\" or \"ghost\" plus every normal button prop.",
      hint: "`interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { variant?: \"primary\" | \"ghost\" }`",
      solution: { lang: "ts", run: "check-tsx", code:
`interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
}
export function Button({ variant = "primary", className = "", ...rest }: ButtonProps) {
  return <button className={"btn btn-" + variant + " " + className} {...rest} />;
}` } },
    check: [
      { q: "useState([]) with no type gives…", options: ["any[]", "never[]", "unknown[]", "string[]"], answer: 1, why: "An empty literal infers never[], so pass a type." },
      { q: "Does `as Book[]` check the JSON at runtime?", options: ["Yes", "No, it's only a promise to the compiler"], answer: 1, why: "Types disappear at runtime. Validate data you don't control." },
    ],
  },
];

export const tailwind = [
  {
    id: "i-tw-layout", title: "Layouts with flex and grid utilities", minutes: 25,
    goal: "Build common page layouts entirely from Tailwind's flex and grid classes.",
    body: [
      "Flex utilities: `flex`, `flex-col`, `items-center`, `justify-between`, `gap-4`, `flex-1` (grow to fill), `shrink-0` (never squash).",
      "Grid utilities: `grid`, `grid-cols-3`, `col-span-2`, and arbitrary templates like `grid-cols-[240px_1fr]`.",
      "Combine them with breakpoints for responsive layouts: `grid-cols-1 md:grid-cols-[240px_1fr]`.",
      "`min-w-0` on a flex or grid child lets long text shrink instead of pushing the layout wider than the screen.",
    ],
    example: { lang: "html", code:
`<div class="min-h-screen grid grid-cols-1 md:grid-cols-[240px_1fr]">
  <aside class="hidden md:block bg-sky-50 p-4">Sidebar</aside>
  <main class="min-w-0 p-6">
    <header class="flex items-center justify-between gap-4 mb-6">
      <h1 class="text-2xl font-bold truncate">Dashboard</h1>
      <button class="shrink-0 bg-red-500 text-white px-4 py-2 rounded-lg">New</button>
    </header>
    <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div class="p-4 rounded-xl bg-white shadow">Orders</div>
      <div class="p-4 rounded-xl bg-white shadow sm:col-span-2 xl:col-span-1">Revenue</div>
    </section>
  </main>
</div>` },
    demo: [
      { lines: [1], say: "One column on phones, then a fixed 240px sidebar plus the rest from md up." },
      { lines: [2], say: "The sidebar is hidden on phones." },
      { lines: [3], say: "min-w-0 stops wide content (like tables) breaking the layout." },
      { lines: [4, 5, 6], say: "Title left, button right. truncate cuts long titles with …, and shrink-0 keeps the button full size." },
      { lines: [8], say: "Stat cards: 1, then 2, then 4 columns." },
      { lines: [10], say: "Spans 2 columns on small screens and 1 on extra-large." },
    ],
    practice: { task: "Build a footer with three link columns on desktop that stack on phones, and a copyright line centered under them.",
      hint: "`grid md:grid-cols-3 gap-8`, then a `text-center` paragraph.",
      solution: { lang: "html", code:
`<footer class="p-8 bg-slate-900 text-white">
  <div class="grid gap-8 md:grid-cols-3">
    <nav aria-label="Shop">…</nav>
    <nav aria-label="Help">…</nav>
    <nav aria-label="Company">…</nav>
  </div>
  <p class="mt-8 text-center text-sm text-slate-400">© 2026 Plant Shop</p>
</footer>` } },
    check: [
      { q: "grid-cols-[240px_1fr] is an example of…", options: ["A plugin", "An arbitrary value", "A breakpoint", "A variant"], answer: 1, why: "Square brackets let you use any CSS value." },
      { q: "Why add min-w-0 to a flex child?", options: ["To hide it", "So it can shrink below its content's width", "To center it", "For dark mode"], answer: 1, why: "Flex items default to min-width: auto, which blocks shrinking." },
    ],
  },
  {
    id: "i-tw-theme", title: "Customizing the theme and dark mode", minutes: 25,
    goal: "Add your own colors and fonts to Tailwind and support a manual dark mode.",
    body: [
      "In Tailwind v4, customize in CSS with `@theme`. Adding `--color-sun: #ffd23f;` creates `bg-sun`, `text-sun`, `border-sun` and the rest.",
      "`--font-display: \"Archivo\", sans-serif;` creates the `font-display` class.",
      "`dark:` follows the device setting by default. For a **toggle**, define a custom variant that reads a `data-theme` attribute: `@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));`.",
      "Better still: point theme colors at CSS variables and swap the variables, so most components need no `dark:` classes at all.",
    ],
    example: { lang: "css", code:
`@import "tailwindcss";

@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));

:root {
  --bg: #ffffff;
  --ink: #0c2131;
}
[data-theme="dark"] {
  --bg: #0a1621;
  --ink: #ecf6fc;
}

@theme inline {
  --color-bg: var(--bg);
  --color-ink: var(--ink);
  --color-sky: #87ceeb;
  --color-sun: #ffd23f;
  --font-display: "Archivo", system-ui, sans-serif;
}` },
    demo: [
      { lines: [1], say: "Tailwind v4 is one import." },
      { lines: [3], say: "dark: now follows data-theme on <html>, so your toggle controls it." },
      { lines: [5, 6, 7, 8, 9, 10, 11, 12], say: "The color values live in variables, with dark versions." },
      { lines: [14, 15, 16], say: "bg-bg and text-ink read the variables, so they switch with the theme on their own." },
      { lines: [17, 18, 19], say: "Brand colors and a display font become utilities: bg-sun, font-display." },
    ],
    practice: { task: "Add a `red` brand color #e2363c and use it for a button with white text that darkens on hover.",
      hint: "`--color-brand-red: #e2363c;` then `bg-brand-red hover:brightness-90`.",
      solution: { lang: "html", code:
`<!-- in @theme: --color-brand-red: #e2363c; -->
<button class="bg-brand-red text-white px-4 py-2 rounded-lg hover:brightness-90 focus-visible:outline-2">
  Buy now
</button>` } },
    check: [
      { q: "In Tailwind v4, where do custom colors go?", options: ["tailwind.config.js only", "An @theme block in CSS", "package.json", "Inline styles"], answer: 1, why: "v4 is configured in CSS with @theme." },
      { q: "Why point theme colors at CSS variables?", options: ["Smaller files", "Swapping the variables re-themes everything without dark: on each element", "Required", "SEO"], answer: 1, why: "Components stay theme-agnostic." },
    ],
  },
  {
    id: "i-tw-reuse", title: "Reusing styles without the mess", minutes: 20,
    goal: "Know when to make a component, when to use @apply, and how to keep long class lists readable.",
    body: [
      "Repeated class lists are a sign you need a **component** (a React component or a partial template), not a CSS class. The component is the reuse.",
      "`@apply` copies utilities into a CSS class. It's fine for things you can't wrap in a component, like styling raw HTML from a CMS, but overusing it brings back the problems Tailwind solves.",
      "Keep variants in an object and pick from it, rather than building class names with string pieces: Tailwind only finds **complete** class names in your files, so `bg-${color}-500` never works.",
      "Arbitrary values (`top-[117px]`, `bg-[#bada55]`) are for one-offs. If you repeat one, add it to the theme.",
    ],
    example: { lang: "jsx", run: "check", code:
`const variants = {
  primary: "bg-red-500 text-white hover:bg-red-600",
  secondary: "bg-sky-100 text-sky-900 hover:bg-sky-200",
  ghost: "bg-transparent text-slate-700 hover:bg-slate-100",
};

export function Button({ variant = "primary", className = "", ...props }) {
  return (
    <button
      className={"px-4 py-2 rounded-lg font-semibold focus-visible:outline-2 " + variants[variant] + " " + className}
      {...props}
    />
  );
}

// ✗ Never works: Tailwind can't see a class that's built at runtime
// <div className={"bg-" + color + "-500"} />` },
    demo: [
      { lines: [1, 2, 3, 4, 5], say: "Each variant is a complete, literal class list, so Tailwind can find every class." },
      { lines: [7], say: "The component is the reuse. Anyone can use <Button variant=\"ghost\">." },
      { lines: [10], say: "Shared base classes plus the variant, plus any extras passed in." },
      { lines: [16, 17], say: "Building class names from pieces fails silently: the CSS is never generated." },
    ],
    practice: { task: "Make a `Badge` with tones success (green), warning (yellow) and danger (red), using a lookup object.",
      hint: "Same pattern as the variants object.",
      solution: { lang: "jsx", run: "check", code:
`const tones = {
  success: "bg-green-100 text-green-800",
  warning: "bg-yellow-100 text-yellow-800",
  danger: "bg-red-100 text-red-800",
};
export const Badge = ({ tone = "success", children }) => (
  <span className={"px-2 py-0.5 rounded-full text-xs font-bold " + tones[tone]}>{children}</span>
);` } },
    check: [
      { q: "Why doesn't `bg-${color}-500` work?", options: ["Syntax error", "Tailwind only generates classes it finds written out in full", "It's deprecated", "Colors need quotes"], answer: 1, why: "Tailwind scans your files for complete class names." },
      { q: "Best way to reuse a long button class list?", options: ["Copy it everywhere", "Make a Button component", "@apply on every element", "Inline styles"], answer: 1, why: "Components are Tailwind's unit of reuse." },
    ],
  },
];
