This readme is under construction

## Metadata and frontmatter

Instead of frontmatter, export a `meta` object at the top of each mdx file like so:

```js
export const meta = [
  { title: "Page title example" },
  { name: "description", content: "Hello" },
  { name: "keywords", content: "seoKeywords" },
  { property: "og:title", content: "Page description example" },
  { property: "og:description", content: "description here" },
  { property: "twitter::title", content: "my-twitter-title" },
  { property: "twitter::description", content: "my-twitter-description" },
  { name: "robots", content: "index,follow" },
  { name: "googlebot", content: "index,follow" },
];
```

Not all these are required.

Each object you add to the `meta` array maps to an individual `meta` tag. A `meta` array like this:

```js
export const meta = [
  { name: "description", content: "This app is the best" },
  { property: "og:title", content: "Very cool app" },
];
```

Will create `<meta>` tags like this:

```html
<meta name="description" content="This app is the best" />
<meta property="og:title" content="Very cool app" />
```

### Using frontmatter

Frontmatter is still supported. You can't access it easily from parent routes to render in a parent layout, but you can use it within the page with the `frontmatter` object.

This can allow you to write values once, but access them multiple places on the page. For example, this example demonstrates accessing `frontmatter.description` to define multiple meta tags without having to copy/paste the description over and over.

```mdx
---
description: My description
---

export const meta = [
  { name: "description", content: frontmatter.description },
  { property: "og:description", content: frontmatter.description },
];

;
```
