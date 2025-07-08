import { useRouteLoaderData } from "@remix-run/react";
import { createContext, useContext, useState } from "react";
import { LoaderData } from "~/root";
import { SidebarItem } from "~/utils/sidebar";

const SidebarDataContext = createContext<SidebarItem[] | null>(null);
const SidebarStateContext = createContext<{
  openSections: string[];
  toggleSection: (sectionId: string) => void;
} | null>(null);

export function SidebarDataProvider({ children }: any) {
  const loaderData = useRouteLoaderData<LoaderData>("root");
  if (!loaderData?.sidebar) {
    throw new Error("Sidebar data not found.");
  }
  const [sidebarData] = useState(loaderData.sidebar); // cache in state
  const [openSections, setOpenSections] = useState<string[]>([]);

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  return (
    <SidebarDataContext.Provider value={sidebarData}>
      <SidebarStateContext.Provider value={{ openSections, toggleSection }}>
        {children}
      </SidebarStateContext.Provider>
    </SidebarDataContext.Provider>
  );
}

export const useSidebarData = () => useContext(SidebarDataContext);
export const useSidebarState = () => useContext(SidebarStateContext);
/**
 * Next steps:
 * 1. Fetch the data in the loader
 * 2. Add it to the context provider in the root layout
 * 3. Use the context in the sidebar component to render the items
 *a
 * Note: Currently, the sidebar rerenders every time you load a
 *  new route, so that sucks. Gotta make sure that isn't happening
 */
