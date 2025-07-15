import { Link, NavLink, NavLinkProps, useLoaderData, useLocation } from "@remix-run/react";
import { getActiveNavBucket, type SidebarItemData } from "~/utils/sidebar";
import { CustomDocSearch } from "@components/CustomDocSearch";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { DocsLoaderData } from "~/routes/docs+/route";
import { doesIncludeNormalizedPath, doNormalizedPathsMatch } from "~/utils/redirects/pathMethods";
import {
  Accordion,
  AccordionContent,
  AccordionHeading,
  AccordionItem,
  AccordionTrigger,
  AccordionTriggerIcon,
} from "@ngrok/mantle/accordion";
import { useIsPathActive } from "~/hooks/useIsPathActive";

function getSortedItems(items: SidebarItemData[]) {
  
  const positionedItems: SidebarItemData["children"] = [];  
  for(const item of items) {
    if (!item) continue;
    if (item.frontmatter?.sidebar_position) {
      positionedItems.push(item);
    } 
  }
  items.sort((a, b) => {
    if (a.explicitSidebarPosition && b.explicitSidebarPosition) {
      return a.explicitSidebarPosition - b.explicitSidebarPosition;
    } else if (a.explicitSidebarPosition) {
      return -1; // a should come before b      
    } else if (b.explicitSidebarPosition) {
      return 1; // b should come before a
    } else {
      return a.title.localeCompare(b.title); // Fallback to title comparison
    }
  });
  
  return [...positionedItems, ...items.filter(item => !positionedItems.includes(item))];
}

const SectionChildren = ({
  items,
  className,
}: {
  items: SidebarItemData["children"];
  className?: string;
}) => {
  const { pathname } = useLocation();
if(!items) return null;  
  const sortedItems: SidebarItemData["children"] = getSortedItems(items);

  return (
    <ul>
      {sortedItems?.map((item: any, key) => {
        if (!item) return null;
        const itemRef = useRef<HTMLLIElement | null>(null);
        const isPathActive = useIsPathActive(item.path);

        useEffect(() => {
          if (isPathActive && itemRef.current) {
            itemRef.current.scrollIntoView({
              behavior: "smooth",
              block: "center",
              inline: "nearest",
            });
          }
        }, [isPathActive]);

        return (
          <li  ref={itemRef} key={`${key}${item.path || item.title}`}>
            <SidebarItem className={clsx("", className)} item={item} />
          </li>
        );
      })}
    </ul>
  );
};

const NavItem = ({
  path,
  title,
  className,
}: {
  path: SidebarItemData["path"] | SidebarItemData["href"];
  title: SidebarItemData["title"];
  className?: string;
}) => {
  return (
    <NavLink className={({isActive})=>clsx("", className, isActive
                      ? "font-semibold text-sky-500 before:bg-sky-500"
                      : "text-black before:hidden before:bg-slate-300 hover:text-slate-600"  )}
                    to={path}>
      {title}
    </NavLink>
  );
};

export const Sidebar = ({ className, algoliaInfo }: any) => {
  const { sidebarData } = useLoaderData<DocsLoaderData>();
  const { pathname } = useLocation();
  if (!sidebarData || sidebarData.length === 0) {
    return null;
  }
  const navBucket = getActiveNavBucket(pathname, sidebarData);
  if (!navBucket) {
    console.error("No active nav bucket found for path:", pathname);
    return null;
  }
  return (
    <nav className={clsx("", className)}>
      <CustomDocSearch algoliaInfo={algoliaInfo} />
      <div className="sticky top-0 self-start h-[calc(100vh-4rem)] w-64 overflow-y-auto pr-8 xl:w-72 xl:pr-16">
        <h2>
          <NavLink
            to={navBucket.path || window.location.pathname}
            prefetch="intent"
          >
            {navBucket.title}
          </NavLink>
        </h2>
        <ul className="list-none" role="list">
          {navBucket &&
            navBucket.children?.map((topLevelItem: SidebarItemData) => {
              if (!topLevelItem) return null;
              if (
                doNormalizedPathsMatch(topLevelItem.path, navBucket.path) &&
                topLevelItem.title === navBucket.title
              ) {
                // Skip the top-level item if it matches the current nav bucket path
                // This is to avoid showing the same item twice in the sidebar
                return null;
              }
              const fontStyle = !topLevelItem?.children ? "font-mono" : "";
              return (
                <li key={topLevelItem.path + topLevelItem.title}>
                  <SidebarItem className={fontStyle} item={topLevelItem} />
                </li>
              );
            })}
        </ul>
      </div>
    </nav>
  );
};

function SidebarItem({
  item,
  className,
}: {
  item: SidebarItemData;
  className?: string;
}) {
  const { pathname } = useLocation();
  const itemHasChildren = item.children && item.children.length > 0;
  let defaultState = "defaultValue";
  if(itemHasChildren) {
    if(item.children?.some((child: SidebarItemData) => doNormalizedPathsMatch(child.path, pathname))) {
      defaultState = item.title;
    }
  }
  return itemHasChildren ? (
    <div className={className}>
      {item.collapsible ? (
        <Accordion type="single" defaultValue={defaultState} collapsible>
          <AccordionItem value={item.title}>
            <AccordionHeading className="mx-4 flex items-center gap-2" asChild>
              <AccordionTrigger>
          <span className="font-mono text-lg mt-2 mb-2">{item.title}</span>
                <AccordionTriggerIcon />
              </AccordionTrigger>
            </AccordionHeading>
            <AccordionContent>
              <SectionChildren items={item.children} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ) : (
        <>
          <span className="font-mono text-lg mt-2 mb-2">{item.title}</span>
          <SectionChildren items={item.children} />
        </>
      )}
    </div>
  ) : (
    <NavItem
      className={clsx("", className)}
      path={item.path || item.href || ""}
      title={item.title}
    />
  );
}
