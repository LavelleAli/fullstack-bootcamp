"use client";
// Learner progress, kept in this browser's localStorage and shared by every component through
// useSyncExternalStore. The server always sees EMPTY, so the first render matches the HTML.
import { useSyncExternalStore } from "react";

const KEY = "fsb-progress-v1";
const EMPTY = Object.freeze({ done: {}, quiz: {}, solved: {}, last: null });
const listeners = new Set();
let cache = null;

function read() {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    cache = raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY;
  } catch {
    cache = EMPTY; // private mode or blocked storage: progress just isn't kept
  }
  return cache;
}

function subscribe(fn) {
  listeners.add(fn);
  const onStorage = (e) => { if (e.key === KEY) { cache = null; fn(); } }; // other tabs
  window.addEventListener("storage", onStorage);
  return () => { listeners.delete(fn); window.removeEventListener("storage", onStorage); };
}

export function useProgress() {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

/** Replace progress with fn(current). fn must return a new object. */
export function updateProgress(fn) {
  cache = fn(read());
  try { localStorage.setItem(KEY, JSON.stringify(cache)); } catch { /* keep in memory only */ }
  listeners.forEach((l) => l());
}

export const toggleDone = (id) =>
  updateProgress((p) => {
    const done = { ...p.done };
    if (done[id]) delete done[id]; else done[id] = true;
    return { ...p, done };
  });

export const answerQuiz = (lessonId, qIndex, choice) =>
  updateProgress((p) => ({ ...p, quiz: { ...p.quiz, [lessonId]: { ...(p.quiz[lessonId] || {}), [qIndex]: choice } } }));

export const markSolved = (id) => updateProgress((p) => (p.solved[id] ? p : { ...p, solved: { ...p.solved, [id]: true } }));

export const setLast = (id) => updateProgress((p) => (p.last === id ? p : { ...p, last: id }));

/** Test helper: forget the in-memory copy so the next read comes from storage. */
export function _resetForTests() { cache = null; listeners.clear(); }
