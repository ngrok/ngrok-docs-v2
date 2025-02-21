export default {
  base: "/",
  lang: "en-US",
  title: "Ngrok Documentation",
  description: "Just playing around.",
  publicURL: "http://localhost:300",
  nav: [
    { text: "Docs", link: "/docs" },
    { text: "Blog", link: "/blog" },
  ],
  head: [],
  sidebar: [
    {
      title: "Introduction",
      links: [
        { title: "Example", href: "/docs/example" },
        { title: "Home", href: "/docs/" },
      ],
    },
    {
      title: "Core Concepts",
      links: [
        { title: "Roadmap", href: "/docs/roadmap" },
        { title: "Changelog", href: "/docs/changelog" },
      ],
    },
  ],
  search: {
    enabled: true,
  },
  editLink: {
    enabled: true,
    link: "https://github.com/freekrai/remix-docs",
    text: "Edit this page on GitHub",
  },
};
