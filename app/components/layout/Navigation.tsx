import clsx from "clsx";
import { NavLink, useLoaderData, useRouteLoaderData } from "@remix-run/react";
import config from "~/utils/docs.config";
import { Button } from "@ngrok/mantle/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ngrok/mantle/dropdown-menu";
import { Icon } from "@ngrok/mantle/icon";
import { NavBucket, navData } from "~/utils/navData";
import { CaretDown } from "@phosphor-icons/react";
import { LoaderData } from "~/routes/docs+/route";
import { SidebarItem } from "~/utils/sidebar";

/**
 * Get sidebar data, which already has formatted links etc
 *
 */

export default function Navigation(props: any) {
  const { sidebarData } = useRouteLoaderData<LoaderData>("routes/docs+/route");

  console.log("Navigation sidebar data", sidebarData);

  return (
    <div
      className={clsx(
        `ml-2 relative flex-grow basis-0 items-center space-x-3 hidden md:block`,
        props.className
      )}
    >
      {sidebarData.map((bucket: SidebarItem) => {
        if (!bucket?.title) return null;
        return (
          <DropdownMenu key={`${bucket.title}-${bucket.path}`}>
            <DropdownMenuTrigger asChild>
              <Button appearance="link" type="button">
                {bucket.title} <Icon svg={<CaretDown />} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {/* Get sidebar data for the bucket here*/}
              {bucket?.children?.map((item: SidebarItem) => {
                // This check should be removed eventually.
                // The data should probably always have a title and path.
                if (!item?.title || !item?.path) return null;
                return (
                  <DropdownMenuItem key={item.path + item.title}>
                    <NavLink
                      to={item.path}
                      prefetch="intent"
                      aria-label={item.title}
                      className={({ isActive }) =>
                        clsx(
                          isActive
                            ? "font-semibold text-sky-500 before:bg-sky-500"
                            : "text-black before:hidden before:bg-slate-300 hover:text-slate-600"
                        )
                      }
                    >
                      {item.title}
                    </NavLink>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      })}
    </div>
  );
}
