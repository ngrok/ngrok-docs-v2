import { Link } from "@remix-run/react";
import { footerData } from "./data";
import clsx from "clsx";


export function Footer ({className}: {className?: string}) {
  return (
<footer className={clsx(className, "bg-blue-500 flex flex-col sm:flex-row flex-wrap items-start justify-center")}>
  {footerData.links.map((section, index) => (
    <div key={index} className="m-5 flex flex-col items-start w-full sm:w-auto">
      {section.title && (
        <h4 className="text-lg font-semibold mb-2">
          {section.title}
        </h4>
      )}
      <ul className="list-none space-y-1 p-0 m-0 w-full">
        {section.items.map(({ to, label }, itemIndex) => (
          <li key={itemIndex}>
            <Link
              to={to}
              className="text-gray-700 hover:text-blue-500 transition-colors"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  ))}
</footer>

  )
}
