// Builds dist/index.html (the app with the course inlined) and dist/course.json (the content, reusable for a Next.js version).
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { course } from "./course.js";
import { diagrams } from "./diagrams.js";

// "</" inside a <script> would end it early, so escape it
const safe = (o) => JSON.stringify(o).replace(/<\//g, "<\\/");
const tpl = readFileSync(new URL("./template.html", import.meta.url), "utf8");
const out = tpl.replace("/*COURSE*/null", safe(course)).replace("/*DIAGRAMS*/null", safe(diagrams));
mkdirSync(new URL("../dist/", import.meta.url), { recursive: true });
writeFileSync(new URL("../dist/index.html", import.meta.url), out);
writeFileSync(new URL("../dist/course.json", import.meta.url), JSON.stringify({ course, diagrams }, null, 2));
console.log("built", (out.length / 1024).toFixed(0) + " KB");
