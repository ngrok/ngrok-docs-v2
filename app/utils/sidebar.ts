export type SidebarItem = {
  title: string;
  path?: string;
  children: SidebarItem[];
};

export default [
  {
    title: "Introduction",
    children: [
      {
        title: "Example",
        path: "/docs/whats-new",
        children: [
          { title: "Example 3", path: "/docs/whats-new" },
          { title: "Home 3", path: "/docs/overview/" },
        ],
      },
      { title: "Home", path: "/docs/overview/" },
    ],
  },
  {
    title: "Section 2",
    children: [
      { title: "Example 2", path: "/docs/whats-new" },
      { title: "Home 2", path: "/docs/overview/" },
    ],
  },
] as SidebarItem[];
