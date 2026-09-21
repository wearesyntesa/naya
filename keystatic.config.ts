import { config, fields, collection } from "@keystatic/core";

export default config({
  storage: {
    kind: "github",
    repo: { owner: "wearesyntesa", name: "naya-storage" },
  },
  ui: {
    brand: {
      name: "Naya",
    },
  },
  collections: {
    docs: collection({
      label: "Documentations",
      slugField: "title",
      path: "src/content/docs/*",
      format: { contentField: "content" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        content: fields.mdx({ label: "Content" }),
      },
    }),
  },
});
