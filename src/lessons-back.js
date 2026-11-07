// Beginner lessons: Python, PostgreSQL, Express.js + morgan, Firebase
// run values: "python" runs and compares, "sql" runs in a fresh Postgres database, "node" runs, "check" syntax-checks

export const python = {
  lessons: [
    {
      id: "py-basics", title: "Variables, types and print", minutes: 20,
      goal: "Write and run your first Python script.",
      body: [
        "Python is known for being readable. There are no semicolons or curly braces: **indentation** (4 spaces) shows where blocks begin and end.",
        "Run a script with `python3 hello.py`, or type `python3` to get an interactive prompt.",
        "Types: `str`, `int`, `float`, `bool` (`True`/`False` are capitalized) and `None`. Python works out the type from the value.",
        "**f-strings** put values inside text: `f\"Hi {name}\"`.",
      ],
      example: { lang: "python", run: "python", file: "hello.py", code:
`name = "Ada"
age = 36
height = 1.68
is_student = True

print(f"{name} is {age} years old")
print(type(age).__name__, type(height).__name__, type(is_student).__name__)
print(age + 4, age / 5, age // 5)
print("Py" * 3)`,
        output: "Ada is 36 years old\nint float bool\n40 7.2 7\nPyPyPy" },
      demo: [
        { lines: [1, 2, 3, 4], say: "No let or const: just name = value. Variables use snake_case." },
        { lines: [6], say: "An f-string puts values straight into the text.", out: "Ada is 36 years old" },
        { lines: [7], say: "type() tells you what something is.", out: "int float bool" },
        { lines: [8], say: "`/` always gives a float, and `//` divides then rounds down.", out: "40 7.2 7" },
        { lines: [9], say: "You can multiply strings!", out: "PyPyPy" },
      ],
      practice: { task: "Ask the user for their name with `input()` and print a greeting with its length, e.g. \"Hi Sam, your name has 3 letters\".",
        hint: "`len(name)` gives the length.",
        solution: { lang: "python", code:
`name = input("Your name: ")
print(f"Hi {name}, your name has {len(name)} letters")` } },
      check: [
        { q: "How does Python mark a code block?", options: ["Curly braces", "Indentation", "begin/end", "Semicolons"], answer: 1, why: "Indentation is part of the syntax." },
        { q: "What is 7 // 2?", options: ["3.5", "3", "4", "Error"], answer: 1, why: "// is floor division: it rounds down to 3." },
      ],
    },
    {
      id: "py-flow", title: "Conditionals, loops and functions", minutes: 25,
      goal: "Use if/elif/else, for and while loops, and def.",
      body: [
        "`if` / `elif` / `else` end with a colon, and the body is indented.",
        "`for item in collection:` loops over anything iterable. `range(5)` gives 0 to 4.",
        "`while` repeats as long as a condition is true. Make sure it eventually becomes false!",
        "Define functions with `def`. Use `and`, `or`, `not` (words, not symbols).",
      ],
      example: { lang: "python", run: "python", code:
`def fizzbuzz(n):
    if n % 15 == 0:
        return "FizzBuzz"
    elif n % 3 == 0:
        return "Fizz"
    elif n % 5 == 0:
        return "Buzz"
    return str(n)

for i in range(1, 16):
    print(fizzbuzz(i), end=" ")
print()

count = 3
while count > 0:
    print("countdown", count)
    count -= 1`,
        output: "1 2 Fizz 4 Buzz Fizz 7 8 Fizz Buzz 11 Fizz 13 14 FizzBuzz \ncountdown 3\ncountdown 2\ncountdown 1" },
      demo: [
        { lines: [1], say: "def, the name, the parameters and a colon." },
        { lines: [2, 3], say: "% is the remainder. Divisible by 15 means divisible by both 3 and 5, so check it first." },
        { lines: [4, 5, 6, 7], say: "elif is Python's else-if." },
        { lines: [8], say: "Otherwise, return the number as text." },
        { lines: [10, 11], say: "range(1, 16) runs from 1 to 15. `end=\" \"` keeps everything on one line.", out: "1 2 Fizz 4 Buzz Fizz 7 8 Fizz Buzz 11 Fizz 13 14 FizzBuzz" },
        { lines: [14, 15, 16, 17], say: "while repeats until count reaches 0.", out: "countdown 3\ncountdown 2\ncountdown 1" },
      ],
      practice: { task: "Write `is_leap(year)`: divisible by 4, except centuries, unless divisible by 400.",
        hint: "`(year % 4 == 0 and year % 100 != 0) or year % 400 == 0`",
        solution: { lang: "python", run: "python", code:
`def is_leap(year):
    return (year % 4 == 0 and year % 100 != 0) or year % 400 == 0

print(is_leap(2024), is_leap(1900), is_leap(2000))`, output: "True False True" } },
      check: [
        { q: "What does range(3) produce?", options: ["1, 2, 3", "0, 1, 2", "0, 1, 2, 3", "3"], answer: 1, why: "range starts at 0 and stops before the end." },
        { q: "Python's 'and' operator is written…", options: ["&&", "and", "&", "AND"], answer: 1, why: "Python uses English words for logic." },
      ],
    },
    {
      id: "py-collections", title: "Lists and dictionaries", minutes: 25,
      goal: "Store groups of data in lists and dicts, and loop over them.",
      body: [
        "A **list** is ordered and changeable: `nums = [3, 1, 2]`. Use `.append()`, `len()`, `sorted()` and slices like `nums[0:2]`.",
        "A **dict** maps keys to values, like a JavaScript object: `user = {\"name\": \"Ada\", \"age\": 36}`.",
        "`.get(key, default)` reads a key safely, without crashing when it's missing.",
        "**List comprehensions** build a list in one line: `[n * 2 for n in nums if n > 1]`. That's Python's map plus filter.",
      ],
      example: { lang: "python", run: "python", code:
`scores = [72, 95, 88, 61]
scores.append(99)
print(len(scores), max(scores), sorted(scores)[:3])

student = {"name": "Lee", "grade": 11}
student["club"] = "chess"
print(student["name"], student.get("email", "no email"))

for key, value in student.items():
    print(key, "=", value)

passed = [s for s in scores if s >= 70]
print(passed)`,
        output: "5 99 [61, 72, 88]\nLee no email\nname = Lee\ngrade = 11\nclub = chess\n[72, 95, 88, 99]" },
      demo: [
        { lines: [1, 2], say: "Make a list, then add to the end." },
        { lines: [3], say: "Built-in functions plus a slice of the first three sorted scores.", out: "5 99 [61, 72, 88]" },
        { lines: [5, 6], say: "A dict, plus a new key." },
        { lines: [7], say: ".get returns the default instead of crashing.", out: "Lee no email" },
        { lines: [9, 10], say: ".items() gives you each key and value.", out: "name = Lee\ngrade = 11\nclub = chess" },
        { lines: [12, 13], say: "A comprehension keeps the passing scores.", out: "[72, 95, 88, 99]" },
      ],
      practice: { task: "Count how many times each word appears in \"the cat and the hat\" using a dict.",
        hint: "Loop over `.split()` and use `counts[w] = counts.get(w, 0) + 1`.",
        solution: { lang: "python", run: "python", code:
`counts = {}
for w in "the cat and the hat".split():
    counts[w] = counts.get(w, 0) + 1
print(counts)`, output: "{'the': 2, 'cat': 1, 'and': 1, 'hat': 1}" } },
      check: [
        { q: "What does d.get('x', 0) return if 'x' is missing?", options: ["None", "0", "An error", "'x'"], answer: 1, why: "The second argument is the default." },
        { q: "[n for n in [1,2,3] if n != 2] is…", options: ["[1, 3]", "[2]", "[1, 2, 3]", "[True, False, True]"], answer: 0, why: "The if keeps only items that pass." },
      ],
    },
  ],
  project: { title: "Number guessing game", brief: "A command-line game: the computer picks 1–100, you guess, it says higher or lower, and it counts your attempts and keeps a best score in a dict for each player.",
    steps: ["import random and random.randint(1, 100)", "A while loop asking for input()", "Convert the input with int() inside try/except", "Track attempts and print the result", "Store best scores in a dict"],
    test: ["Write check_guess(guess, secret) returning 'higher', 'lower' or 'correct', and test it with pytest", "Typing letters doesn't crash the game"] },
};

export const postgres = {
  lessons: [
    {
      id: "sql-tables", title: "Tables, types and inserting data", minutes: 25,
      goal: "Create a table and insert rows.",
      diagram: "client-server-db",
      body: [
        "A relational database stores data in **tables**: **rows** are records and **columns** are fields. Each column has a type.",
        "Common PostgreSQL types: `INTEGER`, `TEXT`, `VARCHAR(n)`, `NUMERIC(10,2)` for money, `BOOLEAN`, `DATE`, and `TIMESTAMPTZ` for timestamps.",
        "`SERIAL PRIMARY KEY` (or `INTEGER GENERATED ALWAYS AS IDENTITY`) gives every row an automatic unique id.",
        "Install PostgreSQL locally, or use a free hosted database such as Neon or Supabase. Open the `psql` shell to type commands.",
      ],
      example: { lang: "sql", run: "sql", code:
`CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  pages INTEGER,
  price NUMERIC(6,2),
  in_stock BOOLEAN DEFAULT true
);

INSERT INTO books (title, author, pages, price)
VALUES ('Dune', 'Frank Herbert', 412, 9.99),
       ('Kindred', 'Octavia Butler', 264, 12.50);

SELECT id, title, in_stock FROM books;`,
        output: "CREATE TABLE\nINSERT 0 2\n id |  title  | in_stock \n----+---------+----------\n  1 | Dune    | t\n  2 | Kindred | t\n(2 rows)" },
      demo: [
        { lines: [1, 2], say: "A books table. id is filled in automatically." },
        { lines: [3, 4], say: "NOT NULL means a value is required." },
        { lines: [6], say: "NUMERIC(6,2) stores exact money values: 6 digits, 2 after the point." },
        { lines: [7], say: "DEFAULT fills in true when you don't give a value." },
        { lines: [10, 11, 12], say: "Insert two rows. Only list the columns you're setting." },
        { lines: [14], say: "Check what's stored.", out: " id |  title  | in_stock \n----+---------+----------\n  1 | Dune    | t\n  2 | Kindred | t" },
      ],
      practice: { task: "Create a `members` table (id, name, email that must be unique, joined DATE defaulting to today) and insert two members.",
        hint: "`email TEXT UNIQUE NOT NULL` and `joined DATE DEFAULT CURRENT_DATE`.",
        solution: { lang: "sql", run: "sql", code:
`CREATE TABLE members (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  joined DATE DEFAULT CURRENT_DATE
);
INSERT INTO members (name, email) VALUES ('Ana', 'ana@example.com'), ('Bo', 'bo@example.com');
SELECT name, email FROM members;`, output: "CREATE TABLE\nINSERT 0 2\n name |      email      \n------+-----------------\n Ana  | ana@example.com\n Bo   | bo@example.com\n(2 rows)" } },
      check: [
        { q: "Which type should store prices?", options: ["FLOAT", "NUMERIC(10,2)", "TEXT", "INTEGER"], answer: 1, why: "NUMERIC is exact, while floats can round money wrong." },
        { q: "What does PRIMARY KEY guarantee?", options: ["Fast inserts", "Unique, non-null identifier per row", "Alphabetical order", "Encryption"], answer: 1, why: "A primary key uniquely identifies each row." },
      ],
    },
    {
      id: "sql-select", title: "SELECT, WHERE, ORDER BY and LIMIT", minutes: 25,
      goal: "Read exactly the rows and columns you need.",
      body: [
        "`SELECT columns FROM table` reads data. `*` means every column, but naming the columns you need is clearer and faster.",
        "`WHERE` filters rows: `=`, `<>` (not equal), `<`, `>`, `AND`, `OR`, `IN (...)`, `BETWEEN`, and `ILIKE '%dune%'` for case-insensitive text search.",
        "`ORDER BY column DESC` sorts, and `LIMIT 5` returns at most 5 rows.",
        "`COUNT(*)`, `AVG()`, `MIN()`, `MAX()` and `SUM()` summarize rows into one value.",
      ],
      example: { lang: "sql", run: "sql", setup:
`CREATE TABLE books (id SERIAL PRIMARY KEY, title TEXT, author TEXT, pages INTEGER, price NUMERIC(6,2));
INSERT INTO books (title, author, pages, price) VALUES
('Dune','Frank Herbert',412,9.99),('Kindred','Octavia Butler',264,12.50),
('Beloved','Toni Morrison',324,14.00),('Parable of the Sower','Octavia Butler',345,11.25);`,
        code:
`SELECT title, price FROM books
WHERE price < 13
ORDER BY price DESC
LIMIT 2;

SELECT COUNT(*) AS total, ROUND(AVG(pages)) AS avg_pages
FROM books
WHERE author = 'Octavia Butler';

SELECT title FROM books WHERE title ILIKE '%of%';`,
        output: "" },
      demo: [
        { lines: [1, 2], say: "Only the title and price of books under $13." },
        { lines: [3, 4], say: "Most expensive first, and only the top 2.", out: "Kindred | 12.50\nParable of the Sower | 11.25" },
        { lines: [6, 7, 8], say: "Aggregate: how many books by one author, and their average page count.", out: "total 2 | avg_pages 305" },
        { lines: [10], say: "ILIKE with % wildcards: any title containing 'of'.", out: "Parable of the Sower" },
      ],
      practice: { task: "List authors and their book counts, most books first.",
        hint: "This needs GROUP BY: `SELECT author, COUNT(*) FROM books GROUP BY author ORDER BY COUNT(*) DESC;` (a preview of Intermediate).",
        solution: { lang: "sql", run: "sql", setup: "CREATE TABLE books (title TEXT, author TEXT); INSERT INTO books VALUES ('Kindred','Octavia Butler'),('Dawn','Octavia Butler'),('Dune','Frank Herbert');",
          code: "SELECT author, COUNT(*) AS books FROM books GROUP BY author ORDER BY books DESC;",
          output: "     author     | books \n----------------+-------\n Octavia Butler |     2\n Frank Herbert  |     1\n(2 rows)" } },
      check: [
        { q: "Which keyword filters rows?", options: ["ORDER BY", "WHERE", "LIMIT", "FROM"], answer: 1, why: "WHERE keeps only rows that match." },
        { q: "Case-insensitive text match in PostgreSQL?", options: ["LIKE", "ILIKE", "MATCH", "=="], answer: 1, why: "ILIKE ignores case. LIKE doesn't." },
      ],
    },
    {
      id: "sql-update", title: "UPDATE, DELETE and staying safe", minutes: 20,
      goal: "Change and remove rows without wiping the table.",
      body: [
        "`UPDATE table SET column = value WHERE ...` changes rows. `DELETE FROM table WHERE ...` removes them.",
        "**Always write the WHERE first.** Without it, UPDATE changes every row and DELETE empties the table.",
        "Run the same WHERE as a `SELECT` first to see which rows you're about to change.",
        "`RETURNING *` shows you the rows that changed.",
      ],
      example: { lang: "sql", run: "sql", setup:
`CREATE TABLE books (id SERIAL PRIMARY KEY, title TEXT, price NUMERIC(6,2), in_stock BOOLEAN DEFAULT true);
INSERT INTO books (title, price) VALUES ('Dune', 9.99), ('Kindred', 12.50), ('Beloved', 14.00);`,
        code:
`SELECT id, title FROM books WHERE price > 12;

UPDATE books SET price = price * 0.9
WHERE price > 12
RETURNING title, price;

DELETE FROM books WHERE title = 'Dune' RETURNING id;

SELECT COUNT(*) FROM books;`,
        output: "" },
      demo: [
        { lines: [1], say: "Preview: which rows does this WHERE match?", out: "2 | Kindred\n3 | Beloved" },
        { lines: [3, 4, 5], say: "10% off those same rows. RETURNING shows the new prices.", out: "Kindred | 11.25\nBeloved | 12.60" },
        { lines: [7], say: "Delete one specific row.", out: "id 1" },
        { lines: [9], say: "Two books left.", out: "2" },
      ],
      practice: { task: "Mark every book with a price over 12 as out of stock, then show the titles still in stock.",
        hint: "`UPDATE ... SET in_stock = false WHERE ...;` then `SELECT ... WHERE in_stock;`",
        solution: { lang: "sql", run: "sql", setup: "CREATE TABLE books (title TEXT, price NUMERIC(6,2), in_stock BOOLEAN DEFAULT true); INSERT INTO books (title, price) VALUES ('Dune', 9.99), ('Kindred', 12.50);",
          code: "UPDATE books SET in_stock = false WHERE price > 12;\nSELECT title FROM books WHERE in_stock;",
          output: "UPDATE 1\n title \n-------\n Dune\n(1 row)" } },
      check: [
        { q: "What does `DELETE FROM books;` do?", options: ["Deletes the table", "Deletes every row", "Errors without WHERE", "Nothing"], answer: 1, why: "Without WHERE, every row is removed (the table stays)." },
        { q: "Safest habit before UPDATE?", options: ["Run it twice", "SELECT with the same WHERE first", "Use LIMIT", "Restart the database"], answer: 1, why: "Preview the rows you'll change." },
      ],
    },
  ],
  project: { title: "Library database", brief: "Design books and members tables, insert 10 books, and write the queries a librarian would need: available books, search by author, the most expensive, and how many per author.",
    steps: ["CREATE both tables with sensible types and constraints", "Insert sample data", "Write 6 useful SELECT queries", "Write a safe UPDATE and DELETE (preview first)", "Save everything in a library.sql file"],
    test: ["Run library.sql on an empty database without errors", "Inserting a duplicate email fails", "Every UPDATE and DELETE has a WHERE"] },
};

export const express = {
  lessons: [
    {
      id: "ex-server", title: "Your first Express server", minutes: 25,
      goal: "Start a Node server and respond to routes.",
      diagram: "http-cycle",
      body: [
        "**Express** is a small framework for building web servers with Node.js. Set up with `npm init -y`, then `npm install express`.",
        "Add `\"type\": \"module\"` to package.json to use `import` syntax.",
        "A **route** is a method plus a path plus a handler: `app.get(\"/\", (req, res) => ...)`. `req` is the incoming request and `res` is your response.",
        "`res.send()` sends text or HTML, `res.json()` sends JSON, and `res.status(404)` sets the status code.",
        "`app.listen(3000)` starts the server. Visit http://localhost:3000.",
      ],
      example: { lang: "js", run: "server", file: "server.js", code:
`import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("<h1>Hello from Express</h1>");
});

app.get("/api/status", (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log("Server running on http://localhost:" + PORT);
});` },
      demo: [
        { lines: [1, 3], say: "Import Express and create the app." },
        { lines: [4], say: "Use the PORT environment variable in production, or 3000 locally." },
        { lines: [6, 7, 8], say: "GET / sends back HTML." },
        { lines: [10, 11, 12], say: "GET /api/status sends JSON, the usual format for APIs.", out: "{\"ok\":true,\"time\":\"2026-…\"}" },
        { lines: [14, 15, 16], say: "Start listening, and log the address.", out: "Server running on http://localhost:3000" },
      ],
      practice: { task: "Add GET /api/hello that returns { message: \"Hello\" }, and a catch-all at the end that returns a 404 JSON error.",
        hint: "Put `app.use((req, res) => res.status(404).json({ error: \"Not found\" }))` after all your routes.",
        solution: { lang: "js", run: "check", code:
`app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello" });
});

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});` } },
      check: [
        { q: "Which sends JSON?", options: ["res.send()", "res.json()", "res.write()", "req.json()"], answer: 1, why: "res.json serializes the object and sets the JSON content type." },
        { q: "Where does a catch-all 404 handler go?", options: ["First", "After all routes", "In package.json", "Anywhere"], answer: 1, why: "Express runs things in order, so the fallback goes last." },
      ],
    },
    {
      id: "ex-params", title: "Route params, query strings and JSON bodies", minutes: 25,
      goal: "Read input from req.params, req.query and req.body.",
      body: [
        "**Route params** are parts of the path: `/api/books/:id` puts the id in `req.params.id`.",
        "**Query strings** come after `?`: `/api/books?author=Butler` puts it in `req.query.author`.",
        "**JSON bodies** (from POST and PUT) need `app.use(express.json())`, then you read them from `req.body`.",
        "Everything arrives as **text**, so convert numbers with `Number()` and **validate** before trusting it.",
      ],
      example: { lang: "js", run: "server", code:
`import express from "express";
const app = express();
app.use(express.json());

const books = [{ id: 1, title: "Dune", author: "Herbert" }];

app.get("/api/books", (req, res) => {
  const { author } = req.query;
  res.json(author ? books.filter((b) => b.author === author) : books);
});

app.get("/api/books/:id", (req, res) => {
  const book = books.find((b) => b.id === Number(req.params.id));
  if (!book) return res.status(404).json({ error: "Book not found" });
  res.json(book);
});

app.post("/api/books", (req, res) => {
  const { title, author } = req.body;
  if (!title || !author) return res.status(400).json({ error: "title and author are required" });
  const book = { id: books.length + 1, title, author };
  books.push(book);
  res.status(201).json(book);
});

app.listen(3000);` },
      demo: [
        { lines: [3], say: "Without this line, req.body is undefined." },
        { lines: [7, 8, 9, 10], say: "GET /api/books?author=Herbert filters the list by the query string." },
        { lines: [12, 13], say: "`:id` becomes req.params.id, which is a string, so convert it with Number()." },
        { lines: [14], say: "Return early with a 404 when nothing matches." },
        { lines: [18, 19, 20], say: "Read the JSON body and validate it, sending 400 for bad input." },
        { lines: [21, 22, 23], say: "Create the book and answer 201 Created.", out: "{\"id\":2,\"title\":\"Kindred\",\"author\":\"Butler\"}" },
      ],
      practice: { task: "Add DELETE /api/books/:id that removes the book and returns 204 (no content), or 404 if it doesn't exist.",
        hint: "Use findIndex and splice, then `res.status(204).end()`.",
        solution: { lang: "js", run: "check", code:
`app.delete("/api/books/:id", (req, res) => {
  const i = books.findIndex((b) => b.id === Number(req.params.id));
  if (i === -1) return res.status(404).json({ error: "Book not found" });
  books.splice(i, 1);
  res.status(204).end();
});` } },
      check: [
        { q: "In /users/:id, where is the id?", options: ["req.query.id", "req.params.id", "req.body.id", "req.id"], answer: 1, why: "Path segments with a colon land in req.params." },
        { q: "Status for 'you sent invalid data'?", options: ["200", "201", "400", "500"], answer: 2, why: "400 Bad Request means the client's input was wrong." },
      ],
    },
    {
      id: "ex-middleware", title: "Middleware and logging with morgan", minutes: 25,
      goal: "Understand middleware order and log every request with morgan.",
      body: [
        "**Middleware** is a function that runs on requests **before** your routes: `(req, res, next) => { ...; next(); }`. Calling `next()` passes the request along. Forget it and the request hangs.",
        "`app.use()` adds middleware. **Order matters**: Express runs everything top to bottom.",
        "**morgan** is middleware that logs every request: method, path, status and time. Install with `npm install morgan`.",
        "Use `morgan(\"dev\")` locally for short colored logs, and `morgan(\"combined\")` in production for the standard log format.",
      ],
      example: { lang: "js", run: "server", code:
`import express from "express";
import morgan from "morgan";

const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.use((req, res, next) => {
  req.startedAt = Date.now();
  next();
});

app.get("/api/ping", (req, res) => {
  res.json({ pong: true, tookMs: Date.now() - req.startedAt });
});

app.listen(3000);` },
      demo: [
        { lines: [2], say: "Import morgan after installing it." },
        { lines: [6], say: "First middleware: log every request.", out: "GET /api/ping 200 1.950 ms - 24" },
        { lines: [7], say: "Second: parse JSON bodies." },
        { lines: [9, 10, 11, 12], say: "Your own middleware: add data to req, then call next()." },
        { lines: [14, 15, 16], say: "The route can read what the middleware added." },
      ],
      practice: { task: "Write middleware that rejects any request without the header `x-api-key: secret123` with a 401.",
        hint: "`req.get(\"x-api-key\")` reads a header. Return before calling next().",
        solution: { lang: "js", run: "check", code:
`function requireKey(req, res, next) {
  if (req.get("x-api-key") !== "secret123") {
    return res.status(401).json({ error: "Missing or wrong API key" });
  }
  next();
}
app.use("/api", requireKey);` } },
      check: [
        { q: "What happens if middleware never calls next() or responds?", options: ["Express skips it", "The request hangs", "It errors at once", "It retries"], answer: 1, why: "The request never moves on and never gets a response." },
        { q: "What does morgan do?", options: ["Parses JSON", "Logs HTTP requests", "Connects to databases", "Handles CORS"], answer: 1, why: "morgan is a request logger." },
      ],
    },
  ],
  project: { title: "Notes REST API", brief: "An Express API for notes (GET all, GET one, POST, DELETE) stored in an array, with morgan logging, JSON validation and proper status codes. Test it with a tool like Postman or Thunder Client.",
    steps: ["npm init, express, morgan, \"type\": \"module\"", "GET /api/notes and GET /api/notes/:id", "POST with validation (400 on a missing title)", "DELETE with 204 and 404", "A 404 catch-all and morgan('dev')"],
    test: ["POST with no title gives 400", "GET /api/notes/999 gives 404", "Every request appears in the morgan log"] },
};

export const firebase = {
  lessons: [
    {
      id: "fb-setup", title: "What Firebase is, and setup", minutes: 20,
      goal: "Create a Firebase project and connect a web app.",
      body: [
        "**Firebase** is Google's set of back-end services: **Authentication** (sign-in), **Firestore** (a NoSQL database), **Hosting**, **Storage** and more. You get a back end without writing a server.",
        "Steps: create a project at console.firebase.google.com, add a **Web app**, copy the config object, then run `npm install firebase`.",
        "The web config (apiKey and the rest) is **not a secret**: it identifies your project. Your data is protected by **Security Rules**, so set them before you go live.",
        "Keep the config in environment variables anyway, so you can switch between projects.",
      ],
      example: { lang: "js", run: "check", file: "firebase.js", code:
`import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FB_API_KEY,
  authDomain: import.meta.env.VITE_FB_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FB_PROJECT_ID,
  appId: import.meta.env.VITE_FB_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);` },
      demo: [
        { lines: [1, 2, 3], say: "The modular SDK: import only what you use." },
        { lines: [5, 6, 7, 8, 9, 10], say: "The config comes from .env (in Next.js, use process.env.NEXT_PUBLIC_...)." },
        { lines: [12], say: "Initialize once, in a single file." },
        { lines: [13, 14], say: "Export auth and db so every other file imports from here." },
      ],
      practice: { task: "Create a Firebase project, enable Email/Password sign-in, create a Firestore database in test mode, and put your config in a .env file.",
        hint: "Authentication → Sign-in method → Email/Password. Firestore → Create database.",
        solution: { lang: "text", code: "VITE_FB_API_KEY=...\nVITE_FB_AUTH_DOMAIN=yourapp.firebaseapp.com\nVITE_FB_PROJECT_ID=yourapp\nVITE_FB_APP_ID=1:...:web:...\n\nAdd .env to .gitignore." } },
      check: [
        { q: "What actually protects Firestore data?", options: ["Hiding the apiKey", "Security Rules", "HTTPS", "The project name"], answer: 1, why: "Security Rules decide who can read and write." },
        { q: "How many times should you call initializeApp?", options: ["In every file", "Once", "Per request", "Never"], answer: 1, why: "Initialize once and export the instances." },
      ],
    },
    {
      id: "fb-auth", title: "Email/password authentication", minutes: 25,
      goal: "Sign users up, in and out, and react to auth changes.",
      body: [
        "`createUserWithEmailAndPassword(auth, email, password)` signs up, and `signInWithEmailAndPassword` signs in. Both return a Promise and throw on failure.",
        "Errors have a `code` like `auth/invalid-credential` or `auth/email-already-in-use`. Turn these into friendly messages.",
        "`onAuthStateChanged(auth, callback)` runs whenever someone signs in or out, **including on page load**. Use it to know who's logged in.",
        "`signOut(auth)` logs the user out.",
      ],
      example: { lang: "js", run: "check", code:
`import {
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signOut, onAuthStateChanged,
} from "firebase/auth";
import { auth } from "./firebase.js";

export async function signUp(email, password) {
  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    return user;
  } catch (err) {
    if (err.code === "auth/email-already-in-use") alert("That email already has an account");
    else alert("Sign up failed: " + err.code);
  }
}

export const logIn = (email, pw) => signInWithEmailAndPassword(auth, email, pw);
export const logOut = () => signOut(auth);

onAuthStateChanged(auth, (user) => {
  document.body.dataset.loggedIn = user ? "yes" : "no";
  console.log(user ? "Signed in as " + user.email : "Signed out");
});` },
      demo: [
        { lines: [1, 2, 3, 4, 5], say: "Import the functions you need, plus your shared auth instance." },
        { lines: [9], say: "Create the account. The new user comes back on success." },
        { lines: [11, 12, 13], say: "Map Firebase error codes to messages people understand." },
        { lines: [17, 18], say: "Sign in and sign out are one-liners." },
        { lines: [20, 21, 22, 23], say: "This listener fires on load and on every change, so it's the one source of truth for who's logged in.", out: "Signed in as ana@example.com" },
      ],
      practice: { task: "Build a sign-in form that shows the error message under the form instead of an alert.",
        hint: "Catch the error and set `errorEl.textContent`. Add `role=\"alert\"` so screen readers announce it.",
        solution: { lang: "js", run: "check", code:
`form.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorEl.textContent = "";
  try {
    await logIn(form.email.value, form.password.value);
  } catch (err) {
    errorEl.textContent = err.code === "auth/invalid-credential"
      ? "Email or password is incorrect"
      : "Couldn't sign in. Try again.";
  }
});` } },
      check: [
        { q: "When does onAuthStateChanged fire?", options: ["Only on sign-in", "On load and on every sign-in or sign-out", "Every second", "Only on sign-out"], answer: 1, why: "It also reports the restored session on page load." },
        { q: "Where is the error type?", options: ["err.type", "err.code", "err.status", "err.name only"], answer: 1, why: "Firebase errors carry a string code." },
      ],
    },
    {
      id: "fb-firestore", title: "Firestore: add and read documents", minutes: 25,
      goal: "Write documents to a collection and read them back.",
      diagram: "firestore",
      body: [
        "Firestore stores **documents** (JSON-like objects) inside **collections**. Each document has an id.",
        "`addDoc(collection(db, \"notes\"), data)` adds a document with an automatic id. `setDoc(doc(db, \"users\", uid), data)` writes one with an id you choose.",
        "`getDocs(collection(...))` reads all the documents once. `query()` with `where()` and `orderBy()` filters them.",
        "Use `serverTimestamp()` for created-at times, so every user's clock doesn't matter.",
      ],
      example: { lang: "js", run: "check", code:
`import {
  collection, addDoc, getDocs, query, where, orderBy, serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "./firebase.js";

export async function addNote(text) {
  await addDoc(collection(db, "notes"), {
    text,
    owner: auth.currentUser.uid,
    createdAt: serverTimestamp(),
  });
}

export async function myNotes() {
  const q = query(
    collection(db, "notes"),
    where("owner", "==", auth.currentUser.uid),
    orderBy("createdAt", "desc"),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}` },
      demo: [
        { lines: [6, 7, 8, 9, 10, 11], say: "Add a note to the notes collection, tagged with the signed-in user's id." },
        { lines: [10], say: "The server sets the time." },
        { lines: [15, 16, 17, 18, 19], say: "Build a query: only my notes, newest first." },
        { lines: [20, 21], say: "Run it, then combine each document's id with its data.", out: "[{ id: \"aB3…\", text: \"Buy milk\", … }]" },
      ],
      practice: { task: "Write `deleteNote(id)` using `deleteDoc(doc(db, \"notes\", id))`.",
        hint: "Import deleteDoc and doc from firebase/firestore.",
        solution: { lang: "js", run: "check", code:
`import { deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebase.js";

export const deleteNote = (id) => deleteDoc(doc(db, "notes", id));` } },
      check: [
        { q: "addDoc vs setDoc?", options: ["Same thing", "addDoc auto-generates the id; setDoc uses yours", "setDoc is for reading", "addDoc deletes"], answer: 1, why: "setDoc writes to a specific document id." },
        { q: "Why serverTimestamp()?", options: ["Faster", "Consistent time from the server", "Required by Firestore", "It's encrypted"], answer: 1, why: "Users' device clocks can be wrong." },
      ],
    },
  ],
  project: { title: "Private notes app", brief: "Sign up and log in with email, add and delete notes, and see only your own notes. Add a Firestore rule so nobody can read anyone else's notes.",
    steps: ["Firebase project, auth and Firestore", "A sign-up / log-in form with friendly errors", "Show the notes list only when signed in (onAuthStateChanged)", "Add and delete notes", "Security rules: allow create if request.auth.uid == request.resource.data.owner; allow read, delete if request.auth.uid == resource.data.owner"],
    test: ["Sign in as user A, add a note, sign in as B: A's note isn't visible", "A wrong password shows a message, not a crash", "Signing out hides the notes"] },
};
