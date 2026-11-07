const { chromium } = require("playwright");
const path = require("path");
const D = __dirname;
const B = "http://localhost:3100";

(async () => {
  const browser = await chromium.launch();
  const errors = [];
  async function page(w, h, scheme) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, colorScheme: scheme });
    const p = await ctx.newPage();
    p.on("pageerror", (e) => errors.push(`[${w}] pageerror ${e.message}`));
    p.on("console", (m) => { if (m.type() === "error") errors.push(`[${w}] console ${m.text().slice(0, 200)}`); });
    return p;
  }
  const overflow = async (p, label) => {
    const o = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (o > 1) errors.push(`${label}: horizontal overflow ${o}px`);
  };

  let p = await page(1280, 900, "light");
  await p.goto(B + "/"); await p.waitForLoadState("networkidle");
  await p.screenshot({ path: path.join(D, "w-home.png") });
  await p.goto(B + "/learn/js/js-arrays"); await p.waitForLoadState("networkidle");
  for (let i = 0; i < 4; i++) await p.click("button[aria-label='Next step']");
  await p.click("text=A new array of the same length");
  await p.click("button:has-text('Mark complete')");
  const st = await p.evaluate(() => ({ out: document.querySelector(".console").textContent, step: document.querySelector(".stepno").textContent, overall: document.querySelector(".overall .txt").textContent, side: [...document.querySelectorAll(".navlink")].find((a) => a.textContent.startsWith("JavaScript")).textContent }));
  console.log("lesson:", JSON.stringify(st));
  await p.evaluate(() => document.querySelector(".player").scrollIntoView());
  await p.screenshot({ path: path.join(D, "w-lesson.png") });
  // client navigation keeps progress
  await p.click("a:has-text('The DOM and events')"); await p.waitForURL("**/js-dom");
  await p.goto(B + "/"); await p.waitForLoadState("networkidle");
  console.log("continue btn:", await p.textContent(".hero .btn.primary"));
  // theme toggle
  await p.click(".theme-btn"); const theme = await p.evaluate(() => document.documentElement.dataset.theme);
  await p.reload(); await p.waitForLoadState("networkidle");
  console.log("theme after reload:", theme, await p.evaluate(() => document.documentElement.dataset.theme));
  // interview
  await p.goto(B + "/interview/twosum"); await p.waitForLoadState("networkidle");
  const sol = "function twoSum(nums, target) {\n  const seen = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    if (seen.has(target - nums[i])) return [seen.get(target - nums[i]), i];\n    seen.set(nums[i], i);\n  }\n  return null;\n}";
  await p.fill("#editor", sol); await p.click("text=Run tests"); await p.waitForTimeout(700);
  console.log("run:", (await p.textContent(".results")).slice(-40));
  await p.reload(); await p.waitForLoadState("networkidle"); await p.waitForTimeout(300);
  console.log("draft kept:", (await p.inputValue("#editor")).includes("seen.set"));
  await p.fill("#editor", "function twoSum(){ while(true){} }"); await p.click("text=Run tests"); await p.waitForTimeout(2600);
  console.log("loop:", await p.textContent(".results"));
  await p.goto(B + "/learn/firebase/i-fb-rules"); await p.waitForLoadState("networkidle");
  console.log("int lesson:", await p.textContent(".crumbs"), "| tab:", await p.textContent("button[aria-pressed='true']"));
  await p.goto(B + "/tiers/advanced/react"); await p.waitForLoadState("networkidle");
  await p.goto(B + "/learn/testing/a-test-api"); await p.waitForLoadState("networkidle");
  await p.click("button:has-text('Mark complete')");
  console.log("adv lesson:", await p.textContent(".crumbs"), "| pill:", await p.getAttribute(".lesson-head .meta .pill", "class"), "| overall:", await p.textContent(".overall .txt"));
  await p.goto(B + "/tiers/advanced/testing"); await p.waitForLoadState("networkidle");
  console.log("adv module count:", await p.textContent(".section-head .muted, .section-head .count, .section-head span"));
  await p.screenshot({ path: path.join(D, "w-adv-tier.png") });
  console.log("tier tab pressed:", await p.getAttribute("button[aria-pressed='true']", "aria-pressed"), await p.textContent("button[aria-pressed='true']"));

  // phone dark
  p = await page(390, 844, "dark");
  for (const u of ["/", "/learn/react/react-state", "/learn/postgres/sql-tables", "/interview/flatten", "/projects", "/tiers/intermediate", "/tiers/intermediate/postgres", "/learn/postgres/i-sql-joins", "/learn/react/i-react-context", "/interview/group-anagrams", "/tiers/advanced/js", "/tiers/advanced", "/learn/express/a-ex-auth", "/learn/interview/a-int-graphs", "/interview/grid-path", "/learn/postgres"]) {
    await p.goto(B + u); await p.waitForLoadState("networkidle"); await overflow(p, "phone " + u);
  }
  await p.goto(B + "/learn/css/css-box"); await p.waitForLoadState("networkidle");
  await p.screenshot({ path: path.join(D, "w-phone.png") });
  await p.click(".menu-btn"); await p.waitForTimeout(350);
  await p.screenshot({ path: path.join(D, "w-phone-menu.png") });
  await p.click(".side >> text=Python"); await p.waitForURL("**/learn/python");
  console.log("drawer closed after nav:", !(await p.evaluate(() => document.querySelector(".side").classList.contains("open"))));

  console.log(errors.length ? "ERRORS:\n" + errors.join("\n") : "no errors");
  await browser.close();
})();
