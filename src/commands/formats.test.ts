import { consoleMock } from "../util/mocks";
import { handler } from "./formats";

test("formats", () => {
  handler();
  expect(consoleMock).toHaveBeenCalledWith(
    [
      "docx",
      // "xlsx",
      // "pptx"
    ].join("\n"),
  );
});
