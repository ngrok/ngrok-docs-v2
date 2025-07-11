import { useRouteLoaderData } from "@remix-run/react";
import { createContext, useContext, useState } from "react";
import { LoaderData } from "~/root";
import { SidebarItemData } from "~/utils/sidebar";

const SidebarDataContext = createContext<SidebarItemData[] | null>(null);

export function SidebarDataProvider({ children }: any) {
  const loaderData = useRouteLoaderData<LoaderData>("root");
  if (!loaderData?.sidebar) {
    throw new Error("Sidebar data not found.");
  }
  const [sidebarData] = useState(loaderData.sidebar); // cache in state

  return (
    <SidebarDataContext.Provider value={sidebarData}>
      {children}
    </SidebarDataContext.Provider>
  );
}

export const useSidebarData = () => useContext(SidebarDataContext);
/**
 * Next steps:
 * 1. Fetch the data in the loader
 * 2. Add it to the context provider in the root layout
 * 3. Use the context in the sidebar component to render the items
 *a
 * Note: Currently, the sidebar rerenders every time you load a
 *  new route, so that sucks. Gotta make sure that isn't happening
 */
