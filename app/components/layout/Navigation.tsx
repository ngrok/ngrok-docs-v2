import clsx from "clsx";
import { NavLink } from "@remix-run/react";
import config from "~/utils/docs.config";

export default function Navigation(props: any) {
  return (
    <div
      className={clsx(
        `ml-2 relative flex-grow basis-0 items-center space-x-3 hidden md:block`,
        props.className
      )}
    >
      {config.nav &&
        config.nav.map((nav) => (
          <NavLink
            key={nav.link}
            to={nav.link}
            prefetch="intent"
            aria-label={nav.link}
            className={({ isActive }) =>
              clsx(
                isActive
                  ? "font-semibold text-sky-500 before:bg-sky-500"
                  : "text-black before:hidden before:bg-slate-300 hover:text-slate-600  "
              )
            }
          >
            {nav.text}
          </NavLink>
        ))}
    </div>
  );
}
