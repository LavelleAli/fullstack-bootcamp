// Assembles the whole course into one object.
import { tiers, modules, tierProjects } from "./map.js";
import { html, css, js } from "./lessons-web.js";
import { apis, ts, tailwind, react, next } from "./lessons-front.js";
import { python, postgres, express, firebase } from "./lessons-back.js";
import { testing, interview } from "./lessons-skills.js";
import * as iWeb from "./int-web.js";
import * as iApp from "./int-app.js";
import * as iServer from "./int-server.js";
import * as aWeb from "./adv-web.js";
import * as aApp from "./adv-app.js";
import * as aServer from "./adv-server.js";

const intermediate = { ...iWeb, ...iApp, ...iServer };
const advanced = { ...aWeb, ...aApp, ...aServer };

const beginner = { html, css, js, apis, ts, tailwind, react, next, python, postgres, express, firebase, testing, interview };

export const course = {
  title: "Full-Stack Bootcamp",
  version: "2026-11 beginner + intermediate + advanced",
  tiers,
  tierProjects,
  modules: modules.map((m) => ({
    ...m,
    beginner: { lessons: beginner[m.id].lessons, project: beginner[m.id].project },
    intermediateLessons: intermediate[m.id] || [],
    advancedLessons: advanced[m.id] || [],
  })),
  interview: {
    problems: [...interview.problems.map((p) => ({ ...p, tier: "beginner" })), ...iServer.problems, ...aServer.problems],
    questions: interview.questions,
  },
};
