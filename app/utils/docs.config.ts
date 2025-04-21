import sidebar from "./sidebar";

export default {
  base: "/",
  lang: "en-US",
  title: "Ngrok Documentation",
  description: "Just playing around.",
  publicURL: "http://localhost:300",
  nav: [
    { text: "Home", link: "/" },
    { text: "Docs", link: "/docs" },
  ],
  head: [],
  sidebar,
  search: {
    enabled: true,
  },
  editLink: {
    enabled: true,
    link: "https://github.com/freekrai/remix-docs",
    text: "Edit this page on GitHub",
  },
};
