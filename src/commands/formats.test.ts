import { consoleMock } from "../util/mocks";
import { handler } from "./formats";
import { test, expect } from "vitest"

test("formats", () => {
  handler();
  expect(consoleMock).toHaveBeenCalledWith(["docx", "xlsx", "pptx"].join("\n"));
});
