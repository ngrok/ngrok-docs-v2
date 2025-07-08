import { useState } from "react";
import { Heading } from "~/utils/getHeadings";
import { ArrowUp, CaretDown } from "@phosphor-icons/react";
import { Link } from "@remix-run/react";
import { Button } from "@ngrok/mantle/button";
import clsx from "clsx";
import useBreakpoint from "use-breakpoint";

function TOCList(props: { children: React.ReactNode[]; className?: string }) {
  return <ul className={`list-none p-0 m-0 ${props.className}`}>{props.children}</ul>;
}

export default function TableOfContents({ headings, className }: { headings: Heading[], className?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const BREAKPOINTS = { mobile: 0, tablet: 768, desktop: 1280 };
  const { breakpoint } = useBreakpoint(
    BREAKPOINTS,
    "desktop"
  );
  if (!headings || headings.length === 0) return null;
  return (
    <>
      {/* Mobile dropdown */}
      <div className={clsx(className, "lg:hidden w-full mb-6")}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex justify-between items-center w-full px-4 py-2 border rounded-md"
        >
          <span className="font-medium">On this page</span>
          {/* <IconButton
            type="button"
            label="Expand table of contents"
            icon={}
            onClick={() => setIsOpen(!isOpen)}
          /> */}
          <CaretDown />
        </button>
        {isOpen && (
          <nav className="absolute w-[100%] mt-2 border rounded-md p-3">
            {headings.map((heading) => (
              <Link
                onClick={() => setIsOpen(false)}
                key={heading.id}
                to={`#${heading.id}`}
                className={`text-white block text-sm py-1 pl-${(heading.level - 2) * 3} hover:text-blue-500 transition-colors`}
              >
                {heading.text}
              </Link>
            ))}
          </nav>
        )}
      </div>

      {/* Desktop Sidebar */}
      <nav className={clsx(className, "hidden lg:block sticky top-8 self-start  max-h-[calc(100vh-5rem)] overflow-y-auto border-l pl-4")}>
        <h4 className="mb-2 font-semibold text-gray-700">On this page</h4>
        <TOCList className="text-xs space-y-2">
          {headings.map((heading) => {
            if (heading.level < 2) return null; // Skip top-level headings
            return (
              <li className="" key={heading.id}>
                <Link
                  to={`#${heading.id}`}
                  className={`block hover:text-blue-500 transition-colors pl-${(heading.level > 1 ? heading.level + 0.5 : 0)}`}
                >
                  {heading.text}
                </Link>
              </li>
            );
          })}
          <Button
            type="button"
            aria-label="scroll back to top of the page"
            className="mt-4 w-full"
            priority="neutral"
            appearance="ghost"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <ArrowUp /> Back to top
          </Button>
        </TOCList>
      </nav>
    </>
  );
}
