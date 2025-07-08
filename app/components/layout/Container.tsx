import {Footer} from "@components/layout/Footer";
import { ThemeSwitcher } from "./ThemeSwitcher";
import Navigation from "./Navigation";
import { DocsLogo } from "./DocsLogo";
import { ClientOnly } from "remix-utils/client-only";
import { Button } from "@ngrok/mantle/button";
import MobileNavigation from "./MobileNavigation";
import { LoaderData } from "~/root";
import { useLoaderData } from "@remix-run/react";

export default function Container({
  algoliaInfo,
  children,
}: {
  algoliaInfo: LoaderData["algoliaInfo"];
  children: React.ReactNode;
}) {
  const data = useLoaderData<LoaderData>();
return (
  <div className="max-w-full">
  <header className="flex gap-2 w-full flex-wrap items-center justify-between bg-white px-4 py-5 transition duration-500 sm:px-6 lg:px-8">
 
   {/* <div className="max-w-full"> */}
    {/* <header className="flex gap-2 w-full flex-wrap items-center justify-between bg-white px-4 py-5 transition duration-500 sm:px-6 lg:px-8"> */}
      <ClientOnly>{() => <DocsLogo className="mr-2" />}</ClientOnly>
      <div className="mr-6 flex lg:hidden">
        <MobileNavigation algoliaInfo={algoliaInfo} />
      </div>
      <div className="md:max-w-full ml-2 relative md:flex flex-grow basis-0 items-center space-x-3 hidden md:block">
        <Navigation />
      </div>
      <div className="hidden md:flex md:gap-3">
        <Button type="button">Log in</Button>
        <Button type="button" appearance="filled">
          Sign Up
        </Button>
      </div>
      <ThemeSwitcher className="ml-5" />
    </header>
    {/* main content */}
      <div className="w-full max-w-full flex flex-col">{children}</div>

  {/* footer */}
  <Footer />
  <div className="flex justify-center items-center h-16 text-gray-600 text-sm">
    © ngrok 2025
  </div>
</div>
);
}
