// Beginner lessons: HTML5, CSS3, JavaScript
// demo steps: lines are 1-based line numbers in example.code

export const html = {
  lessons: [
    {
      id: "html-structure", title: "Page structure and semantic tags", minutes: 20,
      goal: "Write a valid HTML5 page and pick tags by meaning, not looks.",
      diagram: "dom-tree",
      body: [
        "HTML describes **what** each part of a page is. The browser turns your HTML into a tree of elements called the **DOM**, which CSS styles and JavaScript changes.",
        "Every page starts with `<!DOCTYPE html>`, then `<html>` holding a `<head>` (information about the page) and a `<body>` (what people see).",
        "**Semantic tags** say what content means: `<header>`, `<nav>`, `<main>`, `<article>`, `<footer>`. Screen readers, search engines and other developers all rely on them. A page built only from `<div>`s looks the same but tells nobody anything.",
      ],
      example: { lang: "html", file: "index.html", code:
`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>My First Page</title>
  </head>
  <body>
    <header>
      <h1>Jordan's Bakery</h1>
      <nav><a href="#menu">Menu</a></nav>
    </header>
    <main>
      <h2 id="menu">Menu</h2>
      <p>Fresh bread every morning.</p>
    </main>
    <footer>© 2026 Jordan's Bakery</footer>
  </body>
</html>` },
      demo: [
        { lines: [1], say: "The doctype tells the browser to use modern HTML5 rules." },
        { lines: [2], say: "`lang=\"en\"` tells screen readers and translators the page language." },
        { lines: [3, 4, 5, 6, 7], say: "The head holds information about the page: the character set, mobile scaling, and the title shown in the browser tab." },
        { lines: [9, 10, 11, 12], say: "`<header>` holds the site name and `<nav>` holds the main links." },
        { lines: [13, 14, 15, 16], say: "`<main>` is the unique content of this page. There should be only one per page." },
        { lines: [17], say: "`<footer>` closes the page with small print." },
      ],
      practice: { task: "Build a one-page profile for yourself with a header, a main section with an `<h2>` About heading and two paragraphs, and a footer. Use no `<div>`s.",
        hint: "Start from the example. Change the text, then add a second `<p>` inside `<main>`.",
        solution: { lang: "html", code:
`<body>
  <header><h1>Alex Rivera</h1></header>
  <main>
    <h2>About</h2>
    <p>I'm learning web development.</p>
    <p>I like building small tools.</p>
  </main>
  <footer>Contact: alex@example.com</footer>
</body>` } },
      check: [
        { q: "Which element should wrap the unique content of a page?", options: ["<div>", "<main>", "<section>", "<body>"], answer: 1, why: "`<main>` marks the page's main content, and there should be one per page." },
        { q: "Where does the <title> go?", options: ["In <body>", "In <header>", "In <head>", "Anywhere"], answer: 2, why: "The title is information about the page, so it lives in `<head>`." },
      ],
    },
    {
      id: "html-content", title: "Headings, links, images and lists", minutes: 20,
      goal: "Use the everyday content tags correctly, including alt text.",
      body: [
        "Headings go from `<h1>` to `<h6>`. Use one `<h1>` per page and don't skip levels: an `<h3>` belongs under an `<h2>`.",
        "`<a href=\"...\">` makes a link. **Links go places; buttons do things.** If clicking it doesn't take you to a new URL, it should be a `<button>`.",
        "`<img>` needs an `alt` that says what the image shows. If the image is decoration only, use an empty `alt=\"\"` so screen readers skip it.",
        "`<ul>` is a bulleted list, `<ol>` a numbered list, and each item is an `<li>`.",
      ],
      example: { lang: "html", code:
`<h2>Our Breads</h2>
<img src="sourdough.jpg" alt="A round sourdough loaf on a board">
<ul>
  <li>Sourdough</li>
  <li>Rye</li>
</ul>
<h3>How to order</h3>
<ol>
  <li>Pick your bread</li>
  <li>Call the shop</li>
</ol>
<a href="https://example.com/menu" target="_blank" rel="noopener">Full menu</a>` },
      demo: [
        { lines: [1], say: "An `<h2>` starts a section under the page's `<h1>`." },
        { lines: [2], say: "The alt text describes the image for people who can't see it." },
        { lines: [3, 4, 5, 6], say: "Order doesn't matter in this list, so it's a `<ul>`." },
        { lines: [7], say: "`<h3>` is a sub-section of Our Breads." },
        { lines: [8, 9, 10, 11], say: "Steps happen in order, so they use a numbered `<ol>`." },
        { lines: [12], say: "`target=\"_blank\"` opens a new tab, and `rel=\"noopener\"` stops the new page from controlling yours." },
      ],
      practice: { task: "Add a Hobbies section to your profile: an `<h2>`, an image with good alt text, and a list of three hobbies.",
        hint: "Is the order of your hobbies important? That decides `<ul>` or `<ol>`.",
        solution: { lang: "html", code:
`<h2>Hobbies</h2>
<img src="bike.jpg" alt="My blue road bike leaning on a fence">
<ul>
  <li>Cycling</li>
  <li>Cooking</li>
  <li>Chess</li>
</ul>` } },
      check: [
        { q: "A clickable element opens a menu without changing the URL. Which tag?", options: ["<a>", "<button>", "<div onclick>", "<span>"], answer: 1, why: "It performs an action rather than navigating, so it's a button." },
        { q: "What alt should a purely decorative swirl image have?", options: ["alt=\"swirl\"", "No alt attribute", "alt=\"\"", "alt=\"image\""], answer: 2, why: "An empty alt tells screen readers to skip it. Leaving alt out makes them read the file name." },
      ],
    },
    {
      id: "html-forms", title: "Forms and labels", minutes: 25,
      goal: "Build a form where every input has a label and basic validation.",
      body: [
        "A `<form>` groups inputs. Each `<input>` needs a `<label>` connected by matching `for` and `id`. Clicking the label then focuses the input, and screen readers read the label aloud.",
        "The input `type` gives you free behavior: `type=\"email\"` checks for an @, `type=\"number\"` shows a number pad on phones.",
        "`required`, `minlength` and `maxlength` make the browser check the form before it submits. That's **validation** without JavaScript.",
        "Every input needs a `name`. That's the key its value is sent under.",
      ],
      example: { lang: "html", code:
`<form action="/signup" method="post">
  <label for="email">Email</label>
  <input id="email" name="email" type="email" required>

  <label for="pw">Password</label>
  <input id="pw" name="password" type="password" minlength="8" required>

  <label>
    <input name="news" type="checkbox"> Send me the newsletter
  </label>

  <button type="submit">Sign up</button>
</form>` },
      demo: [
        { lines: [1], say: "`action` is where the data goes and `method` is how it's sent." },
        { lines: [2, 3], say: "`for=\"email\"` matches `id=\"email\"`, which connects the label to the input." },
        { lines: [5, 6], say: "`minlength=\"8\"` and `required` block submitting until the password is long enough." },
        { lines: [8, 9, 10], say: "Wrapping the input inside the label also connects them, with no `for` needed." },
        { lines: [12], say: "`type=\"submit\"` sends the form. The browser runs its validation first." },
      ],
      practice: { task: "Build a contact form with name (required), email (required, type email), and message (a `<textarea>`, max 500 characters).",
        hint: "`<textarea>` uses `maxlength` too, and it needs a label like any other input.",
        solution: { lang: "html", code:
`<form>
  <label for="name">Name</label>
  <input id="name" name="name" required>
  <label for="email">Email</label>
  <input id="email" name="email" type="email" required>
  <label for="msg">Message</label>
  <textarea id="msg" name="message" maxlength="500"></textarea>
  <button type="submit">Send</button>
</form>` } },
      check: [
        { q: "What connects a <label> to an <input>?", options: ["Same class", "for on the label matching id on the input", "Putting them next to each other", "name attributes"], answer: 1, why: "`for`/`id` (or nesting the input in the label) makes the connection." },
        { q: "Which attribute is the key the value is submitted under?", options: ["id", "name", "for", "type"], answer: 1, why: "The form sends `name=value` pairs." },
      ],
    },
  ],
  project: { title: "Personal profile page", brief: "A single semantic HTML page about you or a fictional person: header with nav, About, Hobbies list with an image, and a contact form.",
    steps: ["Write the page skeleton with head and body", "Add header, nav, main and footer", "Add About and Hobbies sections", "Add a contact form with labels and validation", "Check it: tab through every link and input with the keyboard"],
    test: ["Every image has alt text", "Exactly one <h1>", "Tabbing reaches every input, in order", "Submitting an empty form shows the browser's required message"] },
};

export const css = {
  lessons: [
    {
      id: "css-selectors", title: "Selectors and the cascade", minutes: 20,
      goal: "Target elements with selectors and predict which rule wins.",
      body: [
        "A CSS rule is a **selector** plus **declarations**: `p { color: red; }`.",
        "Common selectors: a tag (`p`), a class (`.card`), an id (`#hero`), a descendant (`nav a`), and states (`a:hover`).",
        "When two rules set the same property, **specificity** decides: an id beats a class, a class beats a tag. If they tie, the rule written **later** wins. That's the cascade.",
        "Prefer classes for styling. They're reusable and keep specificity low, so you rarely have to fight your own CSS.",
      ],
      example: { lang: "css", code:
`p { color: gray; }
.intro { color: navy; }
#special { color: crimson; }

nav a { text-decoration: none; }
nav a:hover { text-decoration: underline; }

.btn { background: skyblue; }
.btn { background: gold; }` },
      demo: [
        { lines: [1], say: "Every paragraph turns gray, the lowest specificity." },
        { lines: [2], say: "A paragraph with `class=\"intro\"` turns navy, because a class beats a tag." },
        { lines: [3], say: "`id=\"special\"` beats both: crimson." },
        { lines: [5, 6], say: "Links inside `<nav>` lose the underline, then get it back on hover." },
        { lines: [8, 9], say: "Same selector twice, so the later one wins: the button is gold." },
      ],
      practice: { task: "Make all links in your footer white, and make them turn yellow on hover, without changing links elsewhere.",
        hint: "Use a descendant selector that starts with `footer`.",
        solution: { lang: "css", code:
`footer a { color: white; }
footer a:hover { color: gold; }` } },
      check: [
        { q: "A <p class=\"note\" id=\"x\"> matches p, .note and #x rules. Which color wins?", options: ["p", ".note", "#x", "Whichever is last"], answer: 2, why: "Id specificity is highest." },
        { q: "Two rules have equal specificity. Which wins?", options: ["The first", "The later one", "Neither", "The shorter one"], answer: 1, why: "On a tie, source order decides and the later rule wins." },
      ],
    },
    {
      id: "css-box", title: "The box model", minutes: 20,
      goal: "Control size and spacing with content, padding, border and margin.",
      diagram: "box-model",
      body: [
        "Every element is a box with four layers: **content**, then **padding** (space inside the border), then **border**, then **margin** (space outside).",
        "By default `width` sets only the content, so padding and border make the box wider than you asked for. `box-sizing: border-box` makes `width` include padding and border, which is far easier to reason about.",
        "Margins push neighbours away. Padding gives breathing room inside a colored box.",
      ],
      example: { lang: "css", code:
`*, *::before, *::after {
  box-sizing: border-box;
}

.card {
  width: 300px;
  padding: 16px;
  border: 2px solid skyblue;
  margin: 24px auto;
}` },
      demo: [
        { lines: [1, 2, 3], say: "Apply border-box to everything. Most projects start with this line." },
        { lines: [6], say: "The card is exactly 300px wide, including padding and border." },
        { lines: [7], say: "16px of space between the border and the text inside." },
        { lines: [8], say: "A 2px sky-blue border." },
        { lines: [9], say: "24px above and below, and `auto` left and right centers the box." },
      ],
      practice: { task: "Create a `.badge` that is 120px wide in total, has 8px padding, a 1px red border and 12px of space below it.",
        hint: "With border-box, `width: 120px` already includes padding and border.",
        solution: { lang: "css", code:
`.badge {
  box-sizing: border-box;
  width: 120px;
  padding: 8px;
  border: 1px solid red;
  margin-bottom: 12px;
}` } },
      check: [
        { q: "Which layer is outside the border?", options: ["Padding", "Margin", "Content", "Outline"], answer: 1, why: "Margin is the space outside the border." },
        { q: "With content-box, width 200px + 10px padding each side. Rendered width (no border)?", options: ["200px", "210px", "220px", "180px"], answer: 2, why: "200 + 10 + 10 = 220px. border-box would keep it at 200px." },
      ],
    },
    {
      id: "css-flex", title: "Flexbox and responsive basics", minutes: 30,
      goal: "Lay out rows and columns with flexbox and adapt them to phones.",
      diagram: "flex-axes",
      body: [
        "`display: flex` lines a container's children up in a row. `justify-content` spaces them along that row (the **main axis**) and `align-items` lines them up across it (the **cross axis**).",
        "`gap` adds space between items, so you don't need margins on each one.",
        "`flex-wrap: wrap` lets items drop to a new line when there isn't room.",
        "A **media query** applies CSS only at certain screen sizes. Write the phone layout first, then add `@media (min-width: 768px)` for bigger screens. That's called **mobile-first**.",
      ],
      example: { lang: "css", code:
`.cards {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

@media (min-width: 768px) {
  .cards {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}` },
      demo: [
        { lines: [2], say: "Turn on flexbox for the container." },
        { lines: [3], say: "On phones, stack the cards vertically." },
        { lines: [4], say: "16px between cards, with no per-card margins." },
        { lines: [7], say: "From 768px wide and up (tablets and desktops)..." },
        { lines: [9, 10, 11], say: "...switch to a row, spread the cards out, and center them vertically." },
      ],
      practice: { task: "Make a navbar: logo on the left, links on the right, vertically centered. On phones, stack the logo above the links.",
        hint: "`justify-content: space-between` pushes the first and last items to the edges.",
        solution: { lang: "css", code:
`.nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
@media (min-width: 768px) {
  .nav {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}` } },
      check: [
        { q: "Which property spaces items along the main axis?", options: ["align-items", "justify-content", "gap", "flex-wrap"], answer: 1, why: "justify-content works on the main axis, align-items on the cross axis." },
        { q: "Mobile-first media queries usually use…", options: ["max-width", "min-width", "orientation", "hover"], answer: 1, why: "Start with the phone layout, then add min-width queries for larger screens." },
      ],
    },
  ],
  project: { title: "Responsive landing page", brief: "Style your profile page: a centered card layout, a flexbox navbar, and three hobby cards that stack on phones and sit in a row on desktop.",
    steps: ["Add a reset with box-sizing: border-box", "Style the navbar with flexbox", "Turn hobbies into cards with padding and borders", "Make cards stack on phones and sit in a row at 768px+", "Add hover states to links and buttons"],
    test: ["No horizontal scrolling at 375px wide", "Cards are in a row at 1024px", "Every link has a visible hover and focus style"] },
};

export const js = {
  lessons: [
    {
      id: "js-vars", title: "Variables, types and console.log", minutes: 20,
      goal: "Store values with const and let and know the basic types.",
      body: [
        "Use `const` for values that won't be reassigned and `let` for ones that will. Avoid `var`: it has confusing scoping rules.",
        "The basic types are **string** (text), **number**, **boolean** (`true`/`false`), **null** (empty on purpose), **undefined** (not set yet), plus **objects** and **arrays** for groups of values.",
        "`typeof` tells you a value's type. `console.log` prints to the console, which is your main debugging tool.",
        "Compare with `===` (strict equality). `==` converts types first, so `\"5\" == 5` is true, which hides bugs.",
      ],
      example: { lang: "js", run: "node", code:
`const name = "Sam";
let score = 10;
score = score + 5;

const isMember = true;
const tags = ["new", "vip"];
const user = { name: name, score: score };

console.log(typeof name, typeof score, typeof isMember);
console.log(user.name + " has " + score + " points");
console.log("5" === 5, "5" == 5);
console.log(tags.length);`,
        output: "string number boolean\nSam has 15 points\nfalse true\n2" },
      demo: [
        { lines: [1], say: "`const`: this name won't be reassigned." },
        { lines: [2, 3], say: "`let` can change. score is now 15." },
        { lines: [5, 6, 7], say: "A boolean, an array and an object." },
        { lines: [9], say: "typeof reports each type.", out: "string number boolean" },
        { lines: [10], say: "Read a property with a dot, and join text with +.", out: "Sam has 15 points" },
        { lines: [11], say: "Strict equality is false because the types differ. Loose equality converts and says true.", out: "false true" },
        { lines: [12], say: "Arrays know their length.", out: "2" },
      ],
      practice: { task: "Create a `product` object with a name, a price (a number) and inStock (a boolean). Log a sentence like \"Mug costs $12\".",
        hint: "Read properties with `product.name` and `product.price`.",
        solution: { lang: "js", run: "node", code:
`const product = { name: "Mug", price: 12, inStock: true };
console.log(product.name + " costs $" + product.price);`, output: "Mug costs $12" } },
      check: [
        { q: "What does \"5\" === 5 return?", options: ["true", "false", "error", "undefined"], answer: 1, why: "Strict equality checks the type too: string vs number." },
        { q: "Which keyword for a value you will reassign?", options: ["const", "let", "var", "static"], answer: 1, why: "let allows reassignment. const doesn't." },
      ],
    },
    {
      id: "js-functions", title: "Functions and conditionals", minutes: 25,
      goal: "Write functions that take input, make decisions and return output.",
      body: [
        "A **function** is a reusable block of code. It takes **parameters** and **returns** a value.",
        "Arrow functions are a shorter way to write them: `const double = (n) => n * 2;`",
        "`if / else if / else` runs different code depending on a condition. Combine conditions with `&&` (and), `||` (or) and `!` (not).",
        "Keep functions small and **pure** when you can: the same input always gives the same output. Pure functions are the easiest to test.",
      ],
      example: { lang: "js", run: "node", code:
`function grade(score) {
  if (score >= 90) {
    return "A";
  } else if (score >= 80) {
    return "B";
  } else {
    return "Keep going";
  }
}

const isPassing = (score) => score >= 60;

console.log(grade(95));
console.log(grade(83));
console.log(grade(40), isPassing(40));`,
        output: "A\nB\nKeep going false" },
      demo: [
        { lines: [1], say: "`grade` takes one parameter: score." },
        { lines: [2, 3], say: "The first true condition wins and `return` exits the function." },
        { lines: [4, 5], say: "Only checked if the first condition was false." },
        { lines: [6, 7], say: "The fallback for everything else." },
        { lines: [11], say: "An arrow function that returns a boolean." },
        { lines: [13], say: "95 hits the first branch.", out: "A" },
        { lines: [14], say: "83 fails the first and passes the second.", out: "B" },
        { lines: [15], say: "40 falls through, and isPassing is false.", out: "Keep going false" },
      ],
      practice: { task: "Write `shippingCost(total)`: free if total is 50 or more, otherwise 5.99.",
        hint: "One `if` with an early return is enough.",
        solution: { lang: "js", run: "node", code:
`function shippingCost(total) {
  if (total >= 50) return 0;
  return 5.99;
}
console.log(shippingCost(60), shippingCost(20));`, output: "0 5.99" } },
      check: [
        { q: "What does a function return with no return statement?", options: ["null", "0", "undefined", "an error"], answer: 2, why: "Functions return undefined by default." },
        { q: "true && false || true evaluates to…", options: ["true", "false", "error", "undefined"], answer: 0, why: "&& runs first: false, then false || true is true." },
      ],
    },
    {
      id: "js-arrays", title: "Arrays and loops: for, map, filter", minutes: 30,
      goal: "Loop over lists and transform them with map and filter.",
      body: [
        "An **array** is an ordered list: `const nums = [3, 8, 1];`. Positions start at **0**, so `nums[0]` is 3.",
        "`for...of` loops over every item. `.push()` adds to the end.",
        "`.map()` makes a **new** array by changing each item. `.filter()` makes a new array keeping only the items that pass a test. Neither changes the original array.",
        "In React you'll use `.map()` constantly to turn data into a list of elements.",
      ],
      example: { lang: "js", run: "node", code:
`const prices = [4, 12, 30, 7];

let total = 0;
for (const price of prices) {
  total += price;
}
console.log("Total:", total);

const withTax = prices.map((p) => p * 1.1);
console.log(withTax.map((p) => p.toFixed(2)));

const cheap = prices.filter((p) => p < 10);
console.log(cheap, prices.length);`,
        output: "Total: 53\n[ '4.40', '13.20', '33.00', '7.70' ]\n[ 4, 7 ] 4" },
      demo: [
        { lines: [1], say: "An array of four numbers." },
        { lines: [3, 4, 5, 6], say: "for...of visits each price and adds it to the running total." },
        { lines: [7], say: "Print the total.", out: "Total: 53" },
        { lines: [9], say: "map returns a NEW array with every price times 1.1." },
        { lines: [10], say: "toFixed(2) formats each one to two decimals.", out: "[ '4.40', '13.20', '33.00', '7.70' ]" },
        { lines: [12, 13], say: "filter keeps only prices under 10. The original still has 4 items.", out: "[ 4, 7 ] 4" },
      ],
      practice: { task: "Given `const names = [\"ana\", \"ben\", \"cy\"]`, make a new array of the names in capitals, keeping only those longer than 2 letters.",
        hint: "Chain them: `.filter(...)` then `.map(...)`.",
        solution: { lang: "js", run: "node", code:
`const names = ["ana", "ben", "cy"];
const result = names.filter((n) => n.length > 2).map((n) => n.toUpperCase());
console.log(result);`, output: "[ 'ANA', 'BEN' ]" } },
      check: [
        { q: "What does .map() return?", options: ["The same array, changed", "A new array of the same length", "A single value", "undefined"], answer: 1, why: "map always returns a new array with one result per item." },
        { q: "[5, 2, 9].filter(n => n > 4) is…", options: ["[5, 9]", "[2]", "[true, false, true]", "2"], answer: 0, why: "filter keeps the items whose test returns true." },
      ],
    },
    {
      id: "js-dom", title: "The DOM and events", minutes: 30,
      goal: "Find elements, change them, and respond to clicks and typing.",
      diagram: "dom-tree",
      body: [
        "The **DOM** is the browser's live tree of your HTML. JavaScript reads and changes it.",
        "`document.querySelector(\".btn\")` finds the first element matching a CSS selector.",
        "Change text with `.textContent`, and toggle classes with `.classList.add/remove/toggle`.",
        "`addEventListener(\"click\", fn)` runs `fn` every time the event happens. Other common events: `input`, `submit`, `keydown`.",
        "In a form's submit handler, call `event.preventDefault()` to stop the page reloading.",
      ],
      example: { lang: "html", code:
`<button id="like">Like</button>
<span id="count">0</span>

<script>
  const btn = document.querySelector("#like");
  const countEl = document.querySelector("#count");
  let count = 0;

  btn.addEventListener("click", () => {
    count = count + 1;
    countEl.textContent = count;
    btn.classList.toggle("liked", count > 0);
  });
</script>` },
      demo: [
        { lines: [1, 2], say: "Two elements: a button, and a span showing the count." },
        { lines: [5, 6], say: "Grab both elements once, at the start." },
        { lines: [7], say: "The count lives in a variable. That's your state." },
        { lines: [9], say: "Listen for clicks on the button." },
        { lines: [10, 11], say: "Each click: add 1 to the count and show it on the page." },
        { lines: [12], say: "Add the `liked` class once the count is above 0, so CSS can restyle the button." },
      ],
      practice: { task: "Build a character counter: a `<textarea>` and a line of text that shows \"0 / 200\" and updates as you type.",
        hint: "Listen for the `input` event and read `textarea.value.length`.",
        solution: { lang: "html", code:
`<textarea id="msg" maxlength="200"></textarea>
<p id="left">0 / 200</p>
<script>
  const msg = document.querySelector("#msg");
  const left = document.querySelector("#left");
  msg.addEventListener("input", () => {
    left.textContent = msg.value.length + " / 200";
  });
</script>` } },
      check: [
        { q: "Which method finds the first element matching a CSS selector?", options: ["getElement", "querySelector", "findElement", "select"], answer: 1, why: "querySelector takes any CSS selector." },
        { q: "How do you stop a form submit from reloading the page?", options: ["return false", "event.preventDefault()", "form.stop()", "event.cancel = true"], answer: 1, why: "preventDefault cancels the browser's default action." },
      ],
    },
  ],
  project: { title: "Tip calculator", brief: "A small app: enter a bill and a tip percentage, choose how many people are splitting it, and see the tip and the total per person update live.",
    steps: ["HTML: a labelled form with three inputs", "JS: read the values on every input event", "Write a pure function calcSplit(bill, tipPct, people)", "Show the results with toFixed(2)", "Handle bad input: people below 1, empty fields"],
    test: ["calcSplit(100, 20, 2) returns { tip: 20, perPerson: 60 }", "People = 0 shows a message instead of Infinity", "Works with the keyboard only"] },
};
