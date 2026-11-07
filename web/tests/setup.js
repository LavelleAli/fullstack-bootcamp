import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import { _resetForTests } from "@/lib/progress";

afterEach(() => {
  cleanup();
  localStorage.clear();
  _resetForTests();
});

// jsdom has no matchMedia or scrollTo on elements
window.matchMedia ??= () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
Element.prototype.scrollTo ??= function () {};
