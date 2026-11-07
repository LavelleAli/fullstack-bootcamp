import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Quiz, CompleteRow } from "@/components/LessonParts";
import Walkthrough from "@/components/Walkthrough";

const questions = [
  { q: "What does .map() return?", options: ["The same array", "A new array"], answer: 1, why: "map returns a new array." },
];

describe("Quiz", () => {
  it("marks a right answer, explains it, and locks the question", async () => {
    const user = userEvent.setup();
    render(<Quiz lessonId="l1" questions={questions} />);
    await user.click(screen.getByRole("button", { name: /A new array/ }));
    expect(screen.getByText(/Correct\./)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /The same array/ })).toBeDisabled();
  });

  it("remembers the answer after a reload", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<Quiz lessonId="l2" questions={questions} />);
    await user.click(screen.getByRole("button", { name: /The same array/ }));
    unmount();
    render(<Quiz lessonId="l2" questions={questions} />);
    expect(screen.getByText(/Not quite\./)).toBeInTheDocument();
  });
});

describe("CompleteRow", () => {
  it("toggles a lesson between done and not done", async () => {
    const user = userEvent.setup();
    render(<CompleteRow lessonId="l3" />);
    await user.click(screen.getByRole("button", { name: "Mark complete" }));
    expect(screen.getByText("Lesson complete.")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Mark as not done" }));
    expect(screen.getByText("Finished the lesson?")).toBeInTheDocument();
  });
});

describe("Walkthrough", () => {
  const steps = [
    { lines: [1], say: "First line." },
    { lines: [2], say: "Second line.", out: "hello" },
  ];

  it("steps forward and back, highlighting lines and building output", async () => {
    const user = userEvent.setup();
    const { container } = render(<Walkthrough lines={["a", "b"]} steps={steps} code={"a\nb"} file="x.js" langName="JavaScript" />);
    const next = screen.getByRole("button", { name: "Next step" });
    await user.click(next);
    expect(screen.getByText("First line.")).toBeInTheDocument();
    expect(container.querySelector('[data-n="1"]')).toHaveClass("on");
    await user.click(next);
    expect(screen.getByText("Second line.")).toBeInTheDocument();
    expect(screen.getByLabelText("Output")).toHaveTextContent("hello");
    expect(next).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Previous step" }));
    expect(screen.getByLabelText("Output")).toHaveTextContent("");
  });
});
