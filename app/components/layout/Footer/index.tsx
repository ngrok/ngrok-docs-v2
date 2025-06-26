import { Link } from "@remix-run/react";
import { footerData } from "./data";
import clsx from "clsx";


export function Footer ({className}: {className?: string}) {
  return (
<footer className="w-full flex place-content-center">
  <div className={clsx(
    className,
    "w-full md:w-[80%] flex flex-col sm:flex-row items-start justify-between"
  )}>
    {footerData.links.map((section, index) => (
      <div key={index} className="m-5 flex flex-col items-start w-full sm:w-full">
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
  </div>
</footer>

  )
}
