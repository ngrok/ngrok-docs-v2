import { data, LoaderFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import TableOfContents from "@components/TOC";
import { getHeadings } from "~/utils/getHeadings";
import { useLoaderData } from "@remix-run/react";
import { Heading } from "~/utils/getHeadings";
import { create } from "@kodingdotninja/use-tailwind-breakpoint";

export type LoaderData = {
  headings: Heading[];
};

export const loader: LoaderFunction = async ({
  request,
}: LoaderFunctionArgs) => {
  const urlData = new URL(request.url);
  const path = urlData.pathname;
  const headings = await getHeadings(path);

  return data({
    headings,
  });
};

export default function App() {
  const { useBreakpoint } = create({
    md: "768px",
  });

  const isDesktop = useBreakpoint("md");

  const { headings } = useLoaderData<LoaderData>();
  return (
    <div className="relative lg:flex">
      {isDesktop ? (
        <>
          <div className="w-[100%]">
            <Outlet />
          </div>
          <TableOfContents headings={headings} />
        </>
      ) : (
        <div className="relative">
          <TableOfContents headings={headings} />
          <div className="w-[100%]">
            <Outlet />
          </div>
        </div>
      )}
    </div>
  );
}
