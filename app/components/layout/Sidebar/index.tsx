import { Link, NavLink, useLoaderData, useLocation } from "@remix-run/react";
import { getActiveNavBucket, type SidebarItemData } from "~/utils/sidebar";
import { CustomDocSearch } from "@components/CustomDocSearch";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { DocsLoaderData } from "~/routes/docs+/route";
import { doNormalizedPathsMatch } from "~/utils/redirects/pathMethods";


const SectionChildren = ({ items, className }: { items: SidebarItemData["children"], className?: string }) => {
  const { pathname } = useLocation();

  return (
    <ul>
      {items?.map((item: any, key) => {
        if (!item) return null;        
        const itemRef = useRef<HTMLLIElement | null>(null);
        const [isActive, setIsActive] = useState(false);
        
        useEffect(() => {
          setIsActive(doNormalizedPathsMatch(pathname, item.path));
          if (isActive && itemRef.current) {
            itemRef.current.scrollIntoView({
              behavior: "smooth",
              block: "center",
              inline: "nearest",
            });
          }
        }, [isActive]);
        return (
          <li key={`${key}${item.path || item.title}`}>
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
  path: SidebarItemData["path"];
  title: SidebarItemData["title"];
  className?: string;
}) => {
  return <NavLink className={clsx("", className)} to={path}>{title}</NavLink>;
};

export const Sidebar = ({ className, algoliaInfo }: any) => {
  const {sidebarData} = useLoaderData<DocsLoaderData>();
  const { pathname } = useLocation();
  if(!sidebarData || sidebarData.length === 0) {
    return null;
  }
  const navBucket = getActiveNavBucket(pathname, sidebarData);
  if(!navBucket) {
    return null;
  }
  return (
    <nav className={clsx("", className)}>
      <CustomDocSearch algoliaInfo={algoliaInfo} />
      <div className="sticky top-0 self-start h-[calc(100vh-4rem)] w-64 overflow-y-auto pr-8 xl:w-72 xl:pr-16">
        <h2><NavLink
          to={navBucket.path || window.location.pathname}
          prefetch="intent"
        >{navBucket.title}</NavLink></h2>
      <ul className="list-none" role="list">
        {navBucket &&
          navBucket.children?.map((topLevelItem: SidebarItemData) => {
            if(!topLevelItem) return null;            
            if(doNormalizedPathsMatch(topLevelItem.path, navBucket.path) && topLevelItem.title === navBucket.title) {
              // Skip the top-level item if it matches the current nav bucket path
              // This is to avoid showing the same item twice in the sidebar
              return null;
            }
            const fontStyle = !topLevelItem?.children ? "font-mono" : ""
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
  const itemHasChildren = item.children && item.children.length > 0;
  return (
    itemHasChildren ? (
      <div className={className}>
        <span className="font-mono text-lg mt-2 mb-2">{item.title}</span>
        <SectionChildren items={item.children} />
      </div>
    ) : (
      <NavItem
        className={clsx("", className)}
        path={item.path}
        title={item.title}
      />
    )
  );
}