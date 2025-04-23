This readme is under construction

## Metadata and frontmatter

Frontmatter is supported with a few requirements:

1. To apply frontmatter values to metadata, you must export a `meta` array from each MDX file that takes the frontmatter as its value
1. The value _must_ be an array, meaning you have to put a dash (`-`) in front of each item you expect to pass to it when writing up the YAML

Here are examples that work:

```mdx
---
meta:
  - title: My title
  - description: My description
---

export const meta = frontmatter.meta;
export const handle = meta;

;
```

```mdx
---
- title: My title
- description: My description
---

{/* Passing the frontmatter directly, not a nested array within the frontmatter */}
export const meta = frontmatter;
export const handle = meta;
```

Here's what DOESN'T work:

```mdx
---
meta:
  title: My title
  description: My description
---

{/* Bad -- meta is an object, not an array (missing the dashes - ) */}
export const meta = frontmatter.meta;
export const handle = meta;
```

```mdx
---
title: My title
description: My description
---

{/* Bad -- frontmatter is an object, not an array (missing the dashes - ) */}
export const meta = frontmatter;
export const handle = meta;
```

### As an array literal

You can specify metadata as an array literal instead of using frontmatter. Export a `meta` object at the top of each mdx file like so:

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
export const handle = meta;
```

Not all these are required.

Each object you add to the `meta` array maps to an individual `meta` tag. A `meta` array like this:

```js
export const meta = [
  { name: "description", content: "This app is the best" },
  { property: "og:title", content: "Very cool app" },
];
export const handle = meta;
```

Will create `<meta>` tags like this:

```html
<meta name="description" content="This app is the best" />
<meta property="og:title" content="Very cool app" />
```

## Exporting `handle`

To access metadata in layout routes in remix, you must add it to an exported `handle` variable. In order to display the page title from `meta`, add `export const handle = meta;` to each mdx file.

```mdx
---
- title: Example title
---

export const meta = frontmatter;
export const handle = meta;

...
```
