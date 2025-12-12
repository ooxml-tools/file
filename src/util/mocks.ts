import { vi } from "vitest";
const consoleMock = vi.fn();
console.log = consoleMock;

export { consoleMock };
