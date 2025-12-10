import { expect, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";

// automatically remove rendered components between tests
afterEach(() => {
  cleanup();
});
