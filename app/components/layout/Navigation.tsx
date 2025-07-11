import clsx from "clsx";
import { NavLink, useLoaderData, useRouteLoaderData } from "@remix-run/react";
import { Button } from "@ngrok/mantle/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@ngrok/mantle/hover-card";
import { Icon } from "@ngrok/mantle/icon";
import { CaretDown } from "@phosphor-icons/react";
import { DocsLoaderData } from "~/routes/docs+/route";
import { SidebarItem } from "~/utils/sidebar";
import { doNormalizedPathsMatch } from "~/utils/redirects/pathMethods";

const MAX_CHILDREN = 5; // Maximum number of children to show before showing "More"

export default function Navigation(props: any) {
  const data = useRouteLoaderData<DocsLoaderData>("routes/docs+/route");
  const sidebarData = data?.sidebarData;
  if (!sidebarData || sidebarData.length === 0) {
    return null;
  }

  return (
    <div
      className={clsx(
        `ml-2 relative flex-grow basis-0 items-center space-x-3 hidden md:block`,
        props.className
      )}
    >
      {sidebarData.map((bucket: SidebarItemData) => {
        return <NavItem key={bucket.path} bucket={bucket} />;
      })}
    </div>
  );
}

function getItemPath(item: SidebarItemData, bucket: SidebarItemData) {
  // If no path, link to the first child or bucket path
  if (item?.children && item.children.length > 0) {
    return item.children[0].path || bucket.path;
  }

  if (!bucket.path) {
    throw new Error("No viable path found for item: " + item.title);
  }
  return bucket.path;
}

function generateOverviewItemIfNeeded(bucket: SidebarItemData) {
  // If the bucket has a path, and none of its children share that path, list it as the first child with an "Overview" label.
  if (
    bucket.path &&
    !bucket.children?.some((item) =>
      doNormalizedPathsMatch(item.path, bucket.path)
    )
  ) {
    return (
      <NavLink
        to={bucket.path}
        prefetch="intent"
        aria-label={`${bucket.title} Overview`}
        className={({ isActive }) =>
          clsx(
            "w-full hover:text-sky-500",
            isActive
              ? "font-semibold text-sky-500 before:bg-sky-500"
              : "text-black before:hidden before:bg-slate-300 hover:text-slate-600"
          )
        }
      >
        Overview
      </NavLink>
    );
  }
  return null;
}

function NavItem({ bucket }: { bucket: SidebarItemData }) {

  // If there are more than MAX_CHILDREN items, show only the first MAX_CHILDREN items
  const truncatedChildren = bucket.children?.slice(0, MAX_CHILDREN);
  const childrenToShow = truncatedChildren || bucket.children;
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button appearance="link" type="button">
          {bucket.title}{" "}
          {bucket.children?.length === 0 ? null : <Icon svg={<CaretDown />} />}
        </Button>
      </HoverCardTrigger>
      {
        <HoverCardContent className="flex flex-col">
          {bucket.path && generateOverviewItemIfNeeded(bucket)}
          {childrenToShow?.map((item: SidebarItemData) => {
            if (!item) {
              console.warn("Sidebar item is null or undefined", item, bucket);
              return null;
            }
            const itemPath = item?.path || getItemPath(item, bucket);
            return (
              <NavLink
                key={item.path + item.title}
                to={itemPath}
                prefetch="intent"
                aria-label={item.title}
                className={({ isActive }) =>
                  clsx(
                    "w-full hover:text-sky-500",
                    isActive
                      ? "font-semibold text-sky-500 before:bg-sky-500"
                      : "text-black before:hidden before:bg-slate-300 hover:text-slate-600"
                  )
                }
              >
                {item.title}
              </NavLink>
            );
          })}
          {bucket.children?.length && bucket.children.length > MAX_CHILDREN && (
            <NavLink
              to={bucket.path}
              prefetch="intent" 
              aria-label={`More in ${bucket.title}`}
              className={({ isActive }) =>
                clsx(
                  "w-full hover:text-sky-500",
                  isActive
                    ? "font-semibold text-sky-500 before:bg-sky-500"  
                    : "text-black before:hidden before:bg-slate-300 hover:text-slate-600"
                )}
              >View All</NavLink>
            )}
        </HoverCardContent>
      }
    </HoverCard>
  );
}
