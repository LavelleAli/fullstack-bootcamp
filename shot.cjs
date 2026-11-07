const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const D = __dirname;
const body = fs.readFileSync(path.join(D, "dist/index.html"), "utf8");
fs.writeFileSync(path.join(D, "dist/test.html"),
  '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><style>:root{color-scheme:light}body{margin:0;font:14px system-ui}img{max-width:100%}[hidden]{display:none!important}</style></head><body>' + body + "</body></html>");
const url = "file://" + path.join(D, "dist/test.html");

(async () => {
  const browser = await chromium.launch();
  const errors = [];
  async function page(w, h, scheme) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, colorScheme: scheme });
    const p = await ctx.newPage();
    p.on("pageerror", (e) => errors.push(`[${w} ${scheme}] pageerror ${e.message}`));
    p.on("console", (m) => { if (m.type() === "error" && !/ERR_|net::|Failed to load resource/.test(m.text())) errors.push(`[${w}] console ${m.text()}`); });
    return p;
  }
  const overflow = async (p, label) => {
    const o = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (o > 1) errors.push(`${label}: horizontal overflow ${o}px`);
  };

  // desktop light
  let p = await page(1280, 900, "light");
  await p.goto(url + "#home"); await p.waitForTimeout(400);
  await p.screenshot({ path: path.join(D, "s-home.png") });
  await overflow(p, "home desktop");
  await p.goto(url + "#l-js-arrays"); await p.waitForTimeout(300);
  await p.click(".controls .next"); await p.click(".controls .next"); await p.click(".controls .next"); await p.click(".controls .next");
  await p.click(".q[data-q='0'] .opt[data-o='1']");
  await p.click("#doneBtn");
  await p.waitForTimeout(300);
  const lessonText = await p.evaluate(() => ({ console: document.querySelector(".console").textContent, step: document.querySelector(".stepno").textContent, why: !document.querySelector(".q .why").hidden, done: document.querySelector("#doneBtn").textContent, overall: document.querySelector("#overallTxt").textContent }));
  console.log("lesson state:", JSON.stringify(lessonText));
  await p.screenshot({ path: path.join(D, "s-lesson.png"), fullPage: false });
  await p.goto(url + "#l-css-box"); await p.waitForTimeout(300);
  await p.evaluate(() => document.querySelector("figure.diagram").scrollIntoView());
  await p.screenshot({ path: path.join(D, "s-diagram.png") });
  // interview
  await p.goto(url + "#p-twosum"); await p.waitForTimeout(300);
  await p.click("#runBtn"); await p.waitForTimeout(600);
  console.log("stub run:", await p.$eval("#results", (e) => e.innerText.split("\n").slice(-1)[0]));
  const sol = await p.evaluate(() => COURSE.interview.problems.find((x) => x.id === "twosum").solution);
  await p.fill("#editor", sol); await p.click("#runBtn"); await p.waitForTimeout(600);
  console.log("solution run:", await p.$eval("#results", (e) => e.innerText.split("\n").slice(-1)[0]));
  await p.fill("#editor", "function twoSum(){ while(true){} }"); await p.click("#runBtn"); await p.waitForTimeout(2600);
  console.log("loop run:", await p.$eval("#results", (e) => e.innerText));
  await p.screenshot({ path: path.join(D, "s-problem.png") });
  // every view renders without errors
  const ids = await p.evaluate(() => [...COURSE.modules.flatMap((m) => ["m-" + m.id, "t-intermediate-" + m.id, "t-advanced-" + m.id, ...m.beginner.lessons.map((l) => "l-" + l.id), ...m.intermediateLessons.map((l) => "l-" + l.id), ...m.advancedLessons.map((l) => "l-" + l.id)]), "t-advanced", "t-intermediate", "interview", "projects", ...COURSE.interview.problems.map((x) => "p-" + x.id)]);
  for (const id of ids) { await p.goto(url + "#" + id); await p.waitForTimeout(40); const h = await p.$eval("main h1", (e) => e.textContent).catch(() => null); if (!h) errors.push("no h1 on #" + id); }
  console.log("views checked:", ids.length);

  // phone dark
  p = await page(390, 844, "dark");
  await p.goto(url + "#home"); await p.waitForTimeout(300);
  await overflow(p, "home phone");
  await p.screenshot({ path: path.join(D, "s-phone-home.png") });
  await p.goto(url + "#l-react-state"); await p.waitForTimeout(300);
  await overflow(p, "lesson phone");
  await p.click(".controls .play"); await p.waitForTimeout(500);
  await p.screenshot({ path: path.join(D, "s-phone-lesson.png") });
  await p.click("#menuBtn"); await p.waitForTimeout(400);
  await p.screenshot({ path: path.join(D, "s-phone-menu.png") });
  await p.goto(url + "#l-sql-tables"); await p.waitForTimeout(300); await overflow(p, "sql phone");
  await p.goto(url + "#p-flatten"); await p.waitForTimeout(300); await overflow(p, "problem phone");
  await p.goto(url + "#l-i-sql-joins"); await p.waitForTimeout(300); await overflow(p, "int lesson phone");
  for (const h of ["#t-advanced", "#t-advanced-express", "#l-a-ex-auth", "#l-a-int-graphs", "#l-a-sql-transactions", "#p-grid-path", "#m-postgres", "#projects"]) { await p.goto(url + h); await p.waitForTimeout(250); await overflow(p, "adv phone " + h); }
  await p.goto(url + "#l-a-int-graphs"); await p.waitForTimeout(300); await p.screenshot({ path: path.join(D, "s-phone-adv.png") });
  console.log("adv tier pill:", await (async () => { await p.goto(url + "#t-advanced"); await p.waitForTimeout(250); return p.$eval(".lesson-head .meta", (e) => e.textContent); })());
  await p.screenshot({ path: path.join(D, "s-phone-int.png") });
  p = await page(1280, 900, "light");
  await p.goto(url + "#t-intermediate"); await p.waitForTimeout(300); await p.screenshot({ path: path.join(D, "s-int-tier.png") });
  await p.goto(url + "#m-react"); await p.waitForTimeout(300); await p.screenshot({ path: path.join(D, "s-module.png"), fullPage: true });

  console.log(errors.length ? "ERRORS:\n" + errors.join("\n") : "no errors");
  await browser.close();
})();
