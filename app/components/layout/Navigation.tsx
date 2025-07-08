import clsx from "clsx";
import { NavLink, useLoaderData } from "@remix-run/react";
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

export default function Navigation(props: any) {

 
  return (
    <div
      className={clsx(
        `ml-2 relative flex-grow basis-0 items-center space-x-3 hidden md:block`,
        props.className
      )}
    >
        {navData.map((bucket: NavBucket) => {
          return (
            <DropdownMenu key={bucket.label + bucket.link.id}>
              <DropdownMenuTrigger asChild>
                <Button appearance="link" type="button">
                  {bucket.label} <Icon svg={<CaretDown />} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel className="text-sm font-semibold">
                  <NavLink
                    key={`/docs/${bucket.link.id}${bucket.label}`}
                    to={`/docs/${bucket.link.id}`}
                    prefetch="intent"
                    aria-label={bucket.label}
                    className={({ isActive }) =>
                      clsx(
                        isActive
                          ? "font-semibold text-sky-500 before:bg-sky-500"
                          : "text-black before:hidden before:bg-slate-300 hover:text-slate-600  "
                      )
                    }
                  >
                    {bucket.label}
                  </NavLink>
                </DropdownMenuLabel>
                {/* Get sidebar data for the bucket here*/}
              </DropdownMenuContent>
      </DropdownMenu>
          );
        })}
    </div>
  );
}
