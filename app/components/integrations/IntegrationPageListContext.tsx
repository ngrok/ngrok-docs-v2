import { createContext } from "react";
import { Integration } from "~/utils/Integrations/getIntegrations";

export type IntegrationPageListContextType = {
  pageList: Integration[] | undefined;
};

const IntegrationPageListContext =
  createContext<IntegrationPageListContextType | null>(null);

export default IntegrationPageListContext;
