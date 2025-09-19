# [ngrok docs](https://ngrok.com/docs)

Source code for [ngrok docs](https://ngrok.com/docs); feel free to suggest changes and improvements to our documentation!

## Contributing

See our [Contribution Guidelines](CONTRIBUTING.md) for detailed instructions on how to help improve ngrok documentation.

Our docs use [markdown](https://www.markdownguide.org/getting-started/#what-is-markdown) and [MDX](https://mdxjs.com/docs/what-is-mdx/) for content. The site is build with [Vite](https://vite.dev/) using [Vike](https://vike.dev/).

## Prerequisites

- [Node 22](https://nodejs.org/en/download)
- [pnpm 10](https://pnpm.io/installation#using-npm)
- [nvm](https://github.com/nvm-sh/nvm)
- `corepack` is included with node by default, no need to install

## Setup

1. Install [nvm](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating) or your node version manager of choice.
2. Ensure that `node 22` is installed. With `nvm`, run `nvm install`.
3. Enable `pnpm` with `corepack`: `corepack enable pnpm`
4. Install `pnpm` with `corepack`: `corepack install`
5. Install project dependencies with `pnpm`: `pnpm install`

## Running the site locally

When using `pnpm run dev`, this site runs locally at `http://localhost:3333/`

- `pnpm run dev`: Runs build scripts and starts the dev server
- `pnpm run links`: Runs mintlify's built-in broken link checker

### Other commands

- `pnpm run build`: Runs build scripts and builds the site, but isn't generally necessary.

## Creating content

When creating content, directories must exist at the root level of the project. To create a page that will exist at the URL path `/example/page1/`, you can create your `.mdx` file at either of the following file paths:

- `/example/page1.mdx`
- `/example/page1/index.mdx`

### All pages must be MDX

`.md` files won't be turned into pages.

### Adding items to the sidebar

Pages will not be automatically added to the sidebar. You'll need to edit the `"navigation"` object in `docs.json` to add a file to the sidebar.

In general, find the `"pages"` array of the nav section you want to add your page to, and put the path to your page there.

To add `/example/page1.mdx` to the Universal Gateway sidebar:

1. Search for `"item": "Universal Gateway"`
2. Add the path to the `"pages"` array there, excluding the file extension and leading slash: `"example/page1"`.

## Metadata and frontmatter

When you add a title and description to a page's frontmatter, it's automatically added to the metadata.

```md
---
title: Example
description: Example description
---
```

### Accessing frontmatter within a page

You can access a page's frontmatter from within that page, such as the following example:

```md
---
title: Example Title
description: Example description
---

<h1>{frontmatter.title}</h1>

<p>{frontmatter.description</p>
```

## Redirects

To create a redirect quickly, add it to `pages/utils/redirects/data/general.ts`.

For more structured redirects, you can:

1. Create a new `.ts` file in `pages/utils/redirects/data` that exports an object containing your redirects, for example `universalGatewayRedirects.ts`:

 ```js
 export const universalGatewayRedirects = {
  "/docs/source" : "/docs/destination"
 };
 ```

2. Then, import that object in `pages/utils/redirects/redirectAggregator.ts`, and add it to the object exported there.

  ```js
  import { generalRedirects } from "./data/general";
  import { universalGatewayRedirects } from "./data/universalGatewayRedirects";
  
  export const allRedirects = { 
   ...generalRedirects,
   ...universalGatewayRedirects
  };
  ```

### Server vs Client-side redirects

- Hash redirects, i.e. redirects from `/docs/starting-path/#hash` to `/docs/destination-path`, are executed on the client.
- All route-level redirects are executed server-side.

Why? Because the server doesn't have access to the hash (`#this-part`) of a URL, so only the client can execute these redirects.

## Technical questions

### Why is everything in the `pages` directory?

Some stuff that might normally be in a `src` directory is in `pages`, such as `components`, `utils`, etc. Because of how vike works, if you want to access the [`pageContext`](https://vike.dev/pageContext#) object, your code needs to live within the `pages` directory. We could pass this data around, use some sort of context, or do other things, but for now everything lives in `pages`.

## Testing

We use [Vitest](https://vitest.dev/) for testing. To run the tests, use:

```sh
pnpm run test
```

To run tests in watch mode during development:

```sh
pnpm run test:watch
```

## Looking for support?

For bug reports, feature request, questions and community support please open an issue or discussion in our [ngrok Community](https://github.com/ngrok/ngrok).
To report a problem with our documentation, please open a new [Github issue](https://github.com/ngrok/ngrok-docs-v2/issues).
