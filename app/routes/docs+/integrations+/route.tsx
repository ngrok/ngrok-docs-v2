import { data, LoaderFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import {
  getIntegration,
  Integration,
} from "~/utils/Integrations/getIntegrations";
import IntegrationPageListContext from "@components/integrations/IntegrationPageListContext";

export type IntegrationsLoaderData = {
  pageList: Integration[] | undefined;
};

export const loader: LoaderFunction = async ({
  request,
}: LoaderFunctionArgs) => {
  const urlData = new URL(request.url);
  const { pathname } = urlData;

  const pageList = await getIntegration(pathname);
  // integrationPathName === "integrations"
  //   ? null
  //   : await getIntegration(integrationPathName);
  return data({
    pageList,
  });
};

export default function IntegrationsRoute() {
  const data = useLoaderData<IntegrationsLoaderData>();
  if (!data) {
    console.log("\n* No integrations page list found ***\n");
  }
  return (
    <IntegrationPageListContext.Provider
      value={{
        pageList: data.pageList,
        integrationPathName: data.integrationPathName,
      }}
    >
      <Outlet />
    </IntegrationPageListContext.Provider>
  );
}
