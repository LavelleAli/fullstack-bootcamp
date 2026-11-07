// Beginner lessons: Writing Tests, Interview Prep
// run "vitest" = run with vitest, "pytest" = run with pytest

export const testing = {
  lessons: [
    {
      id: "test-why", title: "Why test, and the shape of a test", minutes: 15,
      goal: "Know what a unit test is and the Arrange–Act–Assert pattern.",
      diagram: "aaa",
      body: [
        "A **test** is code that runs your code and checks the result. When you change something later, the tests tell you right away if you broke it.",
        "A **unit test** checks one small piece, like a single function, in isolation. Most of your tests should be unit tests: they're fast and precise.",
        "Every test has three parts: **Arrange** (set up the input), **Act** (run the code), **Assert** (check the result).",
        "Test **behavior**, not implementation: check what the function returns or what the user sees, not how it works inside. Then you can rewrite the inside without rewriting the tests.",
        "Good first targets: pure functions (calculations, formatting, validation). They're the easiest to test.",
      ],
      example: { lang: "js", run: "node", code:
`// The code under test
function applyDiscount(price, percent) {
  if (percent < 0 || percent > 100) throw new Error("Invalid percent");
  return Math.round(price * (1 - percent / 100) * 100) / 100;
}

// A hand-made test, no library yet
function test(name, fn) {
  try { fn(); console.log("✓", name); }
  catch (e) { console.log("✗", name, "-", e.message); }
}

test("takes 20% off", () => {
  const price = 50;                       // Arrange
  const result = applyDiscount(price, 20); // Act
  if (result !== 40) throw new Error("expected 40, got " + result); // Assert
});

test("rejects 150%", () => {
  let threw = false;
  try { applyDiscount(10, 150); } catch { threw = true; }
  if (!threw) throw new Error("should have thrown");
});`,
        output: "✓ takes 20% off\n✓ rejects 150%" },
      demo: [
        { lines: [2, 3, 4, 5], say: "The function we want to prove works." },
        { lines: [8, 9, 10, 11], say: "A tiny test runner: run fn, print ✓ if nothing throws, ✗ if something does." },
        { lines: [14], say: "Arrange: set up the input." },
        { lines: [15], say: "Act: call the code." },
        { lines: [16], say: "Assert: throw if the result is wrong.", out: "✓ takes 20% off" },
        { lines: [19, 20, 21, 22, 23], say: "Test the error case too. Edge cases are where bugs hide.", out: "✓ rejects 150%" },
      ],
      practice: { task: "List four test cases for a function `isValidUsername(name)` that requires 3–15 characters, letters and numbers only.",
        hint: "Cover a normal case, both length limits, and a bad character.",
        solution: { lang: "text", code: "\"sam99\" → true (normal)\n\"ab\" → false (too short)\n\"a\" repeated 16 times → false (too long)\n\"sam!\" → false (bad character)\nBonus: \"abc\" → true (exactly the minimum)" } },
      check: [
        { q: "The three parts of a test, in order?", options: ["Act, Arrange, Assert", "Arrange, Act, Assert", "Assert, Act, Arrange", "Setup, Run, Log"], answer: 1, why: "Arrange the inputs, Act by calling the code, Assert on the result." },
        { q: "Which is easiest to unit test?", options: ["A function that calls an API", "A pure calculation function", "A whole page", "CSS"], answer: 1, why: "Pure functions: same input, same output, no setup." },
      ],
    },
    {
      id: "test-vitest", title: "Your first tests with Vitest", minutes: 25,
      goal: "Install Vitest and write tests with describe, it and expect.",
      body: [
        "**Vitest** is a fast test runner that works like **Jest** (same `describe`, `it`, `expect`), so learning one teaches you both. Install with `npm install -D vitest` and add `\"test\": \"vitest\"` to your package.json scripts.",
        "Name test files `something.test.js`, next to the code they test.",
        "`expect(value)` has **matchers**: `.toBe()` for exact primitives, `.toEqual()` for objects and arrays (it compares contents), `.toThrow()`, `.toContain()`, `.toBeTruthy()`.",
        "`npm test` re-runs your tests every time you save a file.",
      ],
      example: { lang: "js", run: "vitest", file: "cart.test.js", code:
`import { describe, it, expect } from "vitest";

function cartTotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.qty, 0);
}

describe("cartTotal", () => {
  it("returns 0 for an empty cart", () => {
    expect(cartTotal([])).toBe(0);
  });

  it("adds price times quantity", () => {
    const items = [{ price: 5, qty: 2 }, { price: 3, qty: 1 }];
    expect(cartTotal(items)).toBe(13);
  });

  it("does not change the input", () => {
    const items = [{ price: 5, qty: 1 }];
    cartTotal(items);
    expect(items).toEqual([{ price: 5, qty: 1 }]);
  });
});` },
      demo: [
        { lines: [1], say: "Import the test functions." },
        { lines: [3, 4, 5], say: "Normally you'd import this from cart.js. It's inline here to keep it short." },
        { lines: [7], say: "describe groups the related tests." },
        { lines: [8, 9, 10], say: "Each `it` is one behavior. Start with the edge case: an empty cart." },
        { lines: [12, 13, 14, 15], say: "The normal case: 5×2 + 3×1 = 13." },
        { lines: [17, 18, 19, 20, 21], say: "toEqual compares an object's contents. toBe would compare identity.", out: "✓ cartTotal (3 tests) passed" },
      ],
      practice: { task: "Write Vitest tests for your `calcSplit(bill, tipPct, people)` from the JavaScript project: a normal split, 0% tip, and people = 0 throwing an error.",
        hint: "`expect(() => calcSplit(100, 10, 0)).toThrow()`. Wrap the call in a function!",
        solution: { lang: "js", run: "vitest", code:
`import { it, expect } from "vitest";

function calcSplit(bill, tipPct, people) {
  if (people < 1) throw new Error("people must be at least 1");
  const tip = bill * tipPct / 100;
  return { tip, perPerson: (bill + tip) / people };
}

it("splits with tip", () => {
  expect(calcSplit(100, 20, 2)).toEqual({ tip: 20, perPerson: 60 });
});
it("handles 0% tip", () => {
  expect(calcSplit(90, 0, 3).perPerson).toBe(30);
});
it("throws for 0 people", () => {
  expect(() => calcSplit(100, 10, 0)).toThrow();
});` } },
      check: [
        { q: "Compare two arrays' contents with…", options: ["toBe", "toEqual", "toContain", "toMatch"], answer: 1, why: "toBe checks identity, so two different arrays fail even with the same items." },
        { q: "How do you test that a function throws?", options: ["expect(fn()).toThrow()", "expect(() => fn()).toThrow()", "expect(fn).toBe(Error)", "try/catch only"], answer: 1, why: "Wrap it, so expect can catch the throw itself." },
      ],
    },
    {
      id: "test-react", title: "Testing React components", minutes: 30,
      goal: "Render a component and test it the way a user would use it.",
      body: [
        "**React Testing Library** (RTL) renders a component in a fake browser (jsdom) and lets you find things the way a user does: by role, label or text.",
        "Install: `npm install -D @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom`, and set `test: { environment: \"jsdom\" }` in vite.config.",
        "Prefer queries in this order: `getByRole` (button, heading, textbox), then `getByLabelText`, then `getByText`. If you can't find an element by role, real users of screen readers probably can't either.",
        "Use `userEvent` to click and type. It behaves like a real user, including focus and key presses.",
      ],
      example: { lang: "jsx", run: "check", file: "Counter.test.jsx", code:
`import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { it, expect } from "vitest";
import "@testing-library/jest-dom/vitest";
import Counter from "./Counter";

it("increments when + is clicked", async () => {
  const user = userEvent.setup();
  render(<Counter />);

  expect(screen.getByText("0")).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "+" }));

  expect(screen.getByText("1")).toBeInTheDocument();
});

it("never goes below zero", async () => {
  const user = userEvent.setup();
  render(<Counter />);
  await user.click(screen.getByRole("button", { name: "−" }));
  expect(screen.getByText("0")).toBeInTheDocument();
});` },
      demo: [
        { lines: [1, 2, 3, 4], say: "render and screen come from RTL, user events from user-event, and extra matchers from jest-dom." },
        { lines: [8, 9], say: "Arrange: set up a user and render the component." },
        { lines: [11], say: "Assert the starting state, which is what the user sees." },
        { lines: [13], say: "Act: click the button whose accessible name is \"+\"." },
        { lines: [15], say: "Assert the result." },
        { lines: [18, 19, 20, 21, 22, 23], say: "Test the edge case from the React lesson's practice.", out: "✓ 2 tests passed" },
      ],
      practice: { task: "Test your to-do list: typing \"Buy milk\" and pressing Enter shows \"Buy milk\" in the list.",
        hint: "`await user.type(screen.getByRole(\"textbox\"), \"Buy milk{Enter}\")`",
        solution: { lang: "jsx", run: "check", code:
`it("adds a todo", async () => {
  const user = userEvent.setup();
  render(<TodoApp />);
  await user.type(screen.getByRole("textbox"), "Buy milk{Enter}");
  expect(screen.getByRole("listitem")).toHaveTextContent("Buy milk");
});` } },
      check: [
        { q: "Which query should you try first?", options: ["getByTestId", "getByRole", "querySelector", "getByClassName"], answer: 1, why: "Role queries match how users and assistive technology find elements." },
        { q: "Why test with user-event instead of calling functions directly?", options: ["It's faster", "It tests real user behavior", "It's required", "It skips rendering"], answer: 1, why: "You test what the user does and sees, not the internals." },
      ],
    },
    {
      id: "test-pytest", title: "Testing Python with pytest", minutes: 20,
      goal: "Write and run pytest tests with plain assert.",
      body: [
        "**pytest** is the standard Python test runner. Install with `pip install pytest`.",
        "Name files `test_something.py` and functions `test_something()`. pytest finds them automatically.",
        "Just use `assert`: `assert add(2, 3) == 5`. When it fails, pytest shows you both values.",
        "`pytest.raises(ValueError)` checks that an error is raised. Run everything with `pytest` in the terminal.",
      ],
      example: { lang: "python", run: "pytest", file: "test_grades.py", code:
`import pytest

def letter(score):
    if not 0 <= score <= 100:
        raise ValueError("score must be 0-100")
    if score >= 90:
        return "A"
    if score >= 80:
        return "B"
    return "C"

def test_top_grade():
    assert letter(95) == "A"

def test_boundary_is_inclusive():
    assert letter(90) == "A"
    assert letter(89) == "B"

def test_rejects_out_of_range():
    with pytest.raises(ValueError):
        letter(101)`,
        output: "3 passed" },
      demo: [
        { lines: [3, 4, 5], say: "The function under test, with validation." },
        { lines: [12, 13], say: "A test is just a function whose name starts with test_." },
        { lines: [15, 16, 17], say: "Test both sides of a boundary: off-by-one bugs live at 89/90." },
        { lines: [19, 20, 21], say: "pytest.raises passes only if the error happens.", out: "3 passed in 0.01s" },
      ],
      practice: { task: "Write pytest tests for `check_guess(guess, secret)` from the Python project: higher, lower and correct.",
        hint: "Three small test functions, each with one assert.",
        solution: { lang: "python", run: "pytest", code:
`def check_guess(guess, secret):
    if guess < secret:
        return "higher"
    if guess > secret:
        return "lower"
    return "correct"

def test_higher():
    assert check_guess(10, 50) == "higher"

def test_lower():
    assert check_guess(90, 50) == "lower"

def test_correct():
    assert check_guess(50, 50) == "correct"`, output: "3 passed" } },
      check: [
        { q: "How does pytest find tests?", options: ["You register them", "By file and function names starting with test", "From a config list", "Random"], answer: 1, why: "Test discovery uses the test_ naming convention." },
        { q: "pytest checks values with…", options: ["expect()", "assertEquals()", "plain assert", "check()"], answer: 2, why: "pytest rewrites plain assert to show helpful failure messages." },
      ],
    },
  ],
  project: { title: "Test your projects", brief: "Go back and add tests to three earlier projects: the tip calculator (Vitest), the React to-do list (React Testing Library), and the number guessing game (pytest).",
    steps: ["Set up Vitest in the tip calculator", "At least 4 tests for calcSplit, including edge cases", "RTL tests: add, toggle and delete a to-do", "pytest tests for check_guess", "Break the code on purpose and watch a test fail"],
    test: ["npm test and pytest both pass", "Each project has at least one edge-case test", "You saw every test fail at least once (proof it can catch bugs)"] },
};

// Interview prep: coding problems. Each has tests that the build script runs against the solution.
export const interview = {
  lessons: [
    {
      id: "int-how", title: "How junior coding interviews work", minutes: 15,
      goal: "Know the format and a method for any problem.",
      body: [
        "Junior frontend interviews usually mix: a **take-home** or live **coding problem** (strings, arrays, objects), a **build-a-component** task in React, **concept questions** (HTML, CSS, JS, React), and **talking through your projects**.",
        "Use this method out loud for every problem. **1. Restate** the problem and ask about edge cases (empty input? negative numbers?). **2. Give examples** with input and expected output. **3. Plan** in plain words before coding. **4. Code** the simple version first. **5. Test** with your examples, out loud. **6. Improve**, and talk about speed (Big-O) if asked.",
        "Interviewers grade **communication** as much as the answer. Silence is the most common reason juniors fail.",
        "It's fine to say \"I'd look that method up\". Then describe what it does.",
      ],
      example: { lang: "text", code:
`Problem: "Return the most frequent character in a string."

1. Restate: "So for 'banana' I return 'a'? What about a tie, or an empty string?"
2. Examples: 'banana' -> 'a'   'abc' -> 'a' (first wins)   '' -> null
3. Plan: count each char in an object, then find the key with the biggest count.
4. Code it.
5. Test: run 'banana', 'abc' and '' by hand.
6. Improve: "One pass to count plus one pass over the keys, so O(n)."` },
      demo: [
        { lines: [3], say: "Ask about edge cases before writing any code." },
        { lines: [4], say: "Write examples down. They become your tests." },
        { lines: [5], say: "Plan in plain words. The interviewer can correct you early." },
        { lines: [7], say: "Walk through your own examples out loud." },
        { lines: [8], say: "Finish with how fast it is." },
      ],
      practice: { task: "Practice the method on 'count the vowels in a string', speaking each step out loud. Time yourself: aim for under 10 minutes.",
        hint: "Edge cases: uppercase letters? empty string? Is 'y' a vowel?",
        solution: { lang: "js", run: "node", code:
`function countVowels(str) {
  let count = 0;
  for (const ch of str.toLowerCase()) {
    if ("aeiou".includes(ch)) count++;
  }
  return count;
}
console.log(countVowels("Hello World"), countVowels(""));`, output: "3 0" } },
      check: [
        { q: "What should you do first in a coding interview?", options: ["Start typing", "Restate the problem and ask about edge cases", "Ask for the answer", "Write tests"], answer: 1, why: "Clarifying shows thinking and avoids solving the wrong problem." },
      ],
    },
  ],
  // Coding tests: solutions are verified by the build script
  problems: [
    { id: "reverse", title: "Reverse a string", level: "Easy", topic: "Strings",
      prompt: "Write `reverse(str)` that returns the string backwards.",
      approach: "Split into characters, reverse the array, join it back. Or loop from the end.",
      solution: `function reverse(str) {\n  return [...str].reverse().join("");\n}`,
      fn: "reverse", tests: [[["hello"], "olleh"], [[""], ""], [["ab c"], "c ba"]],
      followUp: "Why [...str] instead of str.split('')? Spread handles emoji correctly." },
    { id: "palindrome", title: "Palindrome check", level: "Easy", topic: "Strings",
      prompt: "Write `isPalindrome(str)` that ignores case and anything that isn't a letter or number.",
      approach: "Clean the string with a regex, lowercase it, then compare it to its reverse. Two pointers from both ends is the O(1)-space version.",
      solution: `function isPalindrome(str) {\n  const clean = str.toLowerCase().replace(/[^a-z0-9]/g, "");\n  return clean === [...clean].reverse().join("");\n}`,
      fn: "isPalindrome", tests: [[["Racecar"], true], [["A man, a plan, a canal: Panama"], true], [["hello"], false], [[""], true]],
      followUp: "Solve it with two pointers and no extra string." },
    { id: "fizzbuzz", title: "FizzBuzz", level: "Easy", topic: "Loops",
      prompt: "Return an array from 1 to n: 'Fizz' for multiples of 3, 'Buzz' for 5, 'FizzBuzz' for both, otherwise the number.",
      approach: "Check 15 (both) first, then 3, then 5.",
      solution: `function fizzBuzz(n) {\n  const out = [];\n  for (let i = 1; i <= n; i++) {\n    if (i % 15 === 0) out.push("FizzBuzz");\n    else if (i % 3 === 0) out.push("Fizz");\n    else if (i % 5 === 0) out.push("Buzz");\n    else out.push(i);\n  }\n  return out;\n}`,
      fn: "fizzBuzz", tests: [[[5], [1, 2, "Fizz", 4, "Buzz"]], [[15], [1, 2, "Fizz", 4, "Buzz", "Fizz", 7, 8, "Fizz", "Buzz", 11, "Fizz", 13, 14, "FizzBuzz"]], [[0], []]],
      followUp: "Why does the 15 check have to come first?" },
    { id: "max", title: "Largest number without Math.max", level: "Easy", topic: "Arrays",
      prompt: "Write `largest(nums)` that returns the biggest number, or null for an empty array.",
      approach: "Keep the best value so far, starting from the first item, and compare each number.",
      solution: `function largest(nums) {\n  if (nums.length === 0) return null;\n  let best = nums[0];\n  for (const n of nums) if (n > best) best = n;\n  return best;\n}`,
      fn: "largest", tests: [[[[3, 9, 2]], 9], [[[-5, -1, -9]], -1], [[[]], null]],
      followUp: "Why start at nums[0] and not 0? (Try it with all negative numbers.)" },
    { id: "dedupe", title: "Remove duplicates", level: "Easy", topic: "Arrays",
      prompt: "Write `unique(arr)` returning the items with duplicates removed, keeping first-seen order.",
      approach: "A Set only keeps unique values and remembers insertion order.",
      solution: `function unique(arr) {\n  return [...new Set(arr)];\n}`,
      fn: "unique", tests: [[[[1, 2, 2, 3, 1]], [1, 2, 3]], [[["a", "b", "a"]], ["a", "b"]], [[[]], []]],
      followUp: "Do it without a Set, using an object to track what you've seen." },
    { id: "anagram", title: "Anagram check", level: "Easy", topic: "Hash maps",
      prompt: "Write `isAnagram(a, b)`: true if b uses exactly the same letters as a (ignore spaces and case).",
      approach: "Normalize both strings, then compare sorted letters, or count letters in an object.",
      solution: `function isAnagram(a, b) {\n  const norm = (s) => [...s.toLowerCase().replace(/\\s/g, "")].sort().join("");\n  return norm(a) === norm(b);\n}`,
      fn: "isAnagram", tests: [[["listen", "silent"], true], [["Dormitory", "dirty room"], true], [["cat", "cart"], false]],
      followUp: "Sorting is O(n log n). Make it O(n) with a counting object." },
    { id: "twosum", title: "Two Sum", level: "Medium", topic: "Hash maps",
      prompt: "Given an array of numbers and a target, return the indexes of the two numbers that add up to the target, or null if there are none.",
      approach: "Brute force checks every pair: O(n²). Better: one pass with a Map from number to index, checking whether target − n has already been seen: O(n).",
      solution: `function twoSum(nums, target) {\n  const seen = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const need = target - nums[i];\n    if (seen.has(need)) return [seen.get(need), i];\n    seen.set(nums[i], i);\n  }\n  return null;\n}`,
      fn: "twoSum", tests: [[[[2, 7, 11, 15], 9], [0, 1]], [[[3, 2, 4], 6], [1, 2]], [[[1, 2], 10], null]],
      followUp: "Explain why the Map version is O(n)." },
    { id: "charcount", title: "Most frequent character", level: "Medium", topic: "Hash maps",
      prompt: "Return the character that appears most often. On a tie, return the one that appears first. Return null for an empty string.",
      approach: "Count with an object or Map, then find the highest count. A Map keeps first-seen order, so ties go to the earliest character.",
      solution: `function mostFrequent(str) {\n  const counts = new Map();\n  for (const ch of str) counts.set(ch, (counts.get(ch) || 0) + 1);\n  let best = null, bestCount = 0;\n  for (const [ch, c] of counts) {\n    if (c > bestCount) { best = ch; bestCount = c; }\n  }\n  return best;\n}`,
      fn: "mostFrequent", tests: [[["banana"], "a"], [["abc"], "a"], [[""], null]],
      followUp: "What changes if you need to ignore spaces?" },
    { id: "flatten", title: "Flatten a nested array", level: "Medium", topic: "Recursion",
      prompt: "Write `flatten(arr)` that turns [1, [2, [3, [4]]]] into [1, 2, 3, 4] without using .flat().",
      approach: "Loop over the items: if an item is an array, flatten it (recursion) and spread the result in; otherwise push it.",
      solution: `function flatten(arr) {\n  const out = [];\n  for (const item of arr) {\n    if (Array.isArray(item)) out.push(...flatten(item));\n    else out.push(item);\n  }\n  return out;\n}`,
      fn: "flatten", tests: [[[[1, [2, [3, [4]]]]], [1, 2, 3, 4]], [[[[], [1], 2]], [1, 2]], [[[]], []]],
      followUp: "Add a depth parameter like .flat(depth)." },
    { id: "capitalize", title: "Capitalize each word", level: "Easy", topic: "Strings",
      prompt: "Write `titleCase(str)` so 'the quick fox' becomes 'The Quick Fox'.",
      approach: "Split on spaces, uppercase the first letter of each word, join back together.",
      solution: `function titleCase(str) {\n  return str\n    .split(" ")\n    .map((w) => (w ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w))\n    .join(" ");\n}`,
      fn: "titleCase", tests: [[["the quick fox"], "The Quick Fox"], [["hELLO wORLD"], "Hello World"], [[""], ""]],
      followUp: "What happens with double spaces? Does your version keep them?" },
  ],
  questions: [
    { q: "What's the difference between == and ===?", a: "=== compares value and type with no conversion. == converts types first, so \"5\" == 5 is true. Use === by default." },
    { q: "let vs const vs var?", a: "const can't be reassigned; let can. Both are block-scoped. var is function-scoped and hoisted, which causes bugs, so avoid it." },
    { q: "What is the box model?", a: "Every element is content + padding + border + margin. box-sizing: border-box makes width include padding and border." },
    { q: "Why use semantic HTML?", a: "Tags like <nav>, <main> and <button> carry meaning for screen readers, search engines and other developers, and they come with built-in behavior like keyboard support." },
    { q: "What does async/await do?", a: "It lets you write asynchronous Promise code that reads top to bottom. await pauses the async function until the Promise settles." },
    { q: "Props vs state in React?", a: "Props are inputs passed from a parent and are read-only. State is data a component owns and changes with its setter, which triggers a re-render." },
    { q: "Why do list items need a key in React?", a: "Keys tell React which item is which between renders, so it updates the right DOM nodes. Use stable unique ids, not indexes, when lists change." },
    { q: "What is a REST API?", a: "An API that uses HTTP methods on resource URLs: GET /books reads, POST /books creates, PUT/PATCH updates, DELETE removes, with status codes and usually JSON." },
    { q: "What is the DOM?", a: "The browser's in-memory tree of the page's elements. JavaScript reads and changes it, and the browser re-draws." },
    { q: "Server vs client components in Next.js?", a: "Server components render on the server, can fetch data directly and ship no JS. Client components (\"use client\") run in the browser and can use state, effects and events." },
    { q: "What is SQL injection and how do you prevent it?", a: "Inserting user input directly into a SQL string lets attackers run their own SQL. Use parameterized queries (placeholders like $1) instead." },
    { q: "What is middleware in Express?", a: "A function that runs between the request and your route: (req, res, next). It's used for logging (morgan), parsing bodies, auth and more. Order matters." },
  ],
  project: { title: "Mock interview", brief: "Do a 45-minute practice interview: two coding problems from the list (one Easy, one Medium) while explaining out loud, three concept questions, and a 2-minute walkthrough of one of your projects.",
    steps: ["Pick problems you haven't seen", "Set a timer and talk through the 6-step method", "Record yourself, or practice with a friend", "Answer three questions from the list without notes", "Explain one project: the problem, your choices, what you'd improve"],
    test: ["Both solutions pass their test cases", "You asked at least one clarifying question per problem", "You stated the Big-O of each solution"] },
};
