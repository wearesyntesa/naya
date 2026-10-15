import "server-only";
import { createGitHubReader } from "@keystatic/core/reader/github";
import keystaticConfig from "@/keystatic.config";

const token = process.env.NAYA_STORAGE_READ_TOKEN;

if (!token) {
  throw new Error(
    "NAYA_STORAGE_READ_TOKEN is not set. Create a fine-grained token with Contents: read on wearesyntesa/naya-storage.",
  );
}

export const reader = createGitHubReader(keystaticConfig, {
  repo: "wearesyntesa/naya-storage",
  token,
});
